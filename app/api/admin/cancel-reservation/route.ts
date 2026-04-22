import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function svcClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function requireSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

const CANCEL_WEBHOOK_URL = process.env.N8N_CANCEL_WEBHOOK_URL

// POST — cancel a reservation or propose reschedule
export async function POST(req: NextRequest) {
  const session = await requireSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { action, id } = body

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  const supabase = svcClient()

  const { data: res, error: fetchErr } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !res) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
  }

  // ── Cancel definitively ─────────────────────────────────
  if (action === 'cancel') {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (CANCEL_WEBHOOK_URL) {
      try {
        await fetch(CANCEL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event:           'reservation_cancelled',
            id:              res.id,
            name:            res.name,
            email:           res.email,
            phone:           res.phone,
            phone_code:      res.phone_code      ?? null,
            date:            res.date,
            time:            res.time,
            party_size:      res.party_size,
            status:          'cancelled',
            zone:            res.zone,
            table_ids:       res.table_ids,
            source:          res.source,
            ghl_contact_id:  res.ghl_contact_id  ?? null,
          }),
        })
      } catch (e) {
        console.error('[webhook] Cancel notification failed:', e)
      }
    }

    return NextResponse.json({ success: true })
  }

  // ── Propose reschedule ──────────────────────────────────
  if (action === 'reschedule_propose') {
    const { proposed_date, proposed_times } = body

    if (!proposed_date || !Array.isArray(proposed_times) || proposed_times.length === 0) {
      return NextResponse.json({ error: 'Faltan proposed_date o proposed_times' }, { status: 400 })
    }

    const token      = crypto.randomUUID()
    const expiresAt  = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    const { error: insertErr } = await supabase
      .from('reschedule_proposals')
      .insert({
        token,
        reservation_id: id,
        proposed_times,
        proposed_date,
        original_date:  res.date,
        original_time:  res.time,
        status:         'pending',
        expires_at:     expiresAt,
      })

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

    const { error: updateErr } = await supabase
      .from('reservations')
      .update({ status: 'reschedule_proposed', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

    if (CANCEL_WEBHOOK_URL) {
      try {
        await fetch(CANCEL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event:             'reservation_reschedule_proposed',
            id:                res.id,
            name:              res.name,
            email:             res.email,
            phone:             res.phone,
            phone_code:        res.phone_code      ?? null,
            date:              res.date,
            time:              res.time,
            party_size:        res.party_size,
            status:            'reschedule_proposed',
            zone:              res.zone,
            table_ids:         res.table_ids,
            source:            res.source,
            ghl_contact_id:    res.ghl_contact_id  ?? null,
            reschedule_token:  token,
          }),
        })
      } catch (e) {
        console.error('[webhook] Reschedule propose notification failed:', e)
      }
    }

    return NextResponse.json({ success: true, token })
  }

  return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
}
