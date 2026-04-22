import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function svcClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

type Params = { params: { token: string } }

// ── GET — fetch proposal by token (public) ──────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = params
  const supabase  = svcClient()

  const { data: proposal, error } = await supabase
    .from('reschedule_proposals')
    .select('*, reservations(*)')
    .eq('token', token)
    .single()

  if (error || !proposal) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // Mark expired if past deadline
  if (proposal.status === 'pending' && new Date(proposal.expires_at) < new Date()) {
    await supabase
      .from('reschedule_proposals')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', proposal.id)

    await supabase
      .from('reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', proposal.reservation_id)

    return NextResponse.json({ status: 'expired' })
  }

  return NextResponse.json({ proposal })
}

// ── POST — client accepts a proposed time ───────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const { token }     = params
  const body          = await req.json()
  const { chosen_time } = body

  if (!chosen_time) {
    return NextResponse.json({ error: 'chosen_time requerido' }, { status: 400 })
  }

  const supabase = svcClient()

  const { data: proposal, error } = await supabase
    .from('reschedule_proposals')
    .select('*, reservations(*)')
    .eq('token', token)
    .single()

  if (error || !proposal) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  if (proposal.status !== 'pending') {
    return NextResponse.json({ error: 'expired_or_used' }, { status: 400 })
  }

  if (new Date(proposal.expires_at) < new Date()) {
    await supabase
      .from('reschedule_proposals')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', proposal.id)

    await supabase
      .from('reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', proposal.reservation_id)

    return NextResponse.json({ error: 'expired' }, { status: 400 })
  }

  const proposedTimes = proposal.proposed_times as Array<{ time: string; table_ids: string[] }>
  const chosenOption  = proposedTimes.find(opt => opt.time === chosen_time)

  if (!chosenOption) {
    return NextResponse.json({ error: 'Horario no válido' }, { status: 400 })
  }

  const acceptedTableIds = chosenOption.table_ids ?? []

  // Update proposal
  await supabase
    .from('reschedule_proposals')
    .update({
      status:             'accepted',
      accepted_time:      chosen_time,
      accepted_table_ids: acceptedTableIds,
      updated_at:         new Date().toISOString(),
    })
    .eq('id', proposal.id)

  // Update reservation
  await supabase
    .from('reservations')
    .update({
      status:       'confirmed',
      time:         chosen_time,
      date:         proposal.proposed_date,
      table_ids:    acceptedTableIds.length > 0 ? acceptedTableIds : null,
      confirmed_at: new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    })
    .eq('id', proposal.reservation_id)

  // Fetch updated reservation for webhook payload
  const { data: updatedRes } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', proposal.reservation_id)
    .single()

  // Fire confirmation webhook
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
  if (webhookUrl && updatedRes) {
    try {
      // Format time to 12h for the webhook payload
      const [hStr, mStr] = chosen_time.split(':')
      const h = parseInt(hStr, 10)
      const formattedTime = `${h % 12 || 12}:${mStr} ${h >= 12 ? 'PM' : 'AM'}`

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event:          'reservation_confirmed',
          id:             updatedRes.id,
          name:           updatedRes.name,
          email:          updatedRes.email,
          phone:          updatedRes.phone,
          phone_code:     (updatedRes as Record<string, unknown>).phone_code     ?? null,
          date:           proposal.proposed_date,
          time:           formattedTime,
          party_size:     updatedRes.party_size,
          status:         'confirmed',
          zone:           updatedRes.zone,
          table_ids:      acceptedTableIds,
          source:         updatedRes.source,
          ghl_contact_id: (updatedRes as Record<string, unknown>).ghl_contact_id ?? null,
        }),
      })
    } catch (e) {
      console.error('[webhook] Reschedule confirmation failed:', e)
    }
  }

  return NextResponse.json({
    success: true,
    time:    chosen_time,
    date:    proposal.proposed_date,
    name:    proposal.reservations?.name ?? '',
  })
}
