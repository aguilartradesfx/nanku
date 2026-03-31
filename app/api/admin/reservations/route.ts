import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { expandTableIds } from '@/lib/tables'

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

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'no_show']

// ── GET — list with optional filters ──────────────────────
export async function GET(req: NextRequest) {
  const session = await requireSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date     = searchParams.get('date')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo   = searchParams.get('dateTo')
  const status   = searchParams.get('status')
  const zone     = searchParams.get('zone')
  const search   = searchParams.get('search')

  const supabase = await createClient()
  let query = supabase.from('reservations').select('*')

  if (date)     query = query.eq('date', date)
  if (dateFrom) query = query.gte('date', dateFrom)
  if (dateTo)   query = query.lte('date', dateTo)
  if (status)   query = query.eq('status', status)
  if (zone)     query = query.eq('zone', zone)
  if (search)   query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)

  const { data, error } = await query
    .order('date', { ascending: false })
    .order('time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reservations: data })
}

// ── POST — create reservation ──────────────────────────────
export async function POST(req: NextRequest) {
  const session = await requireSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.name || !body.phone || !body.date || !body.time || !body.party_size) {
    return NextResponse.json({ error: 'Faltan campos requeridos: name, phone, date, time, party_size' }, { status: 400 })
  }

  const payload = {
    name:         body.name,
    email:        body.email      || null,
    phone:        body.phone,
    date:         body.date,
    time:         body.time,
    party_size:   String(body.party_size),
    status:       VALID_STATUSES.includes(body.status) ? body.status : 'pending',
    notes:        body.notes      || null,
    zone:         body.zone       || null,
    table_ids:    body.table_ids  ? expandTableIds(body.table_ids) : null,
    source:       body.source     || 'web_form',
    confirmed_at: body.status === 'confirmed' ? new Date().toISOString() : null,
  }

  const { data, error } = await svcClient()
    .from('reservations')
    .insert(payload)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reservation: data }, { status: 201 })
}

// ── PATCH — update status or full fields ───────────────────
export async function PATCH(req: NextRequest) {
  const session = await requireSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id } = body
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  // Full update (when name is present)
  if (body.name !== undefined) {
    const patch: Record<string, unknown> = {
      name:       body.name,
      email:      body.email      || null,
      phone:      body.phone,
      date:       body.date,
      time:       body.time,
      party_size: String(body.party_size),
      notes:      body.notes      || null,
      zone:       body.zone       || null,
      table_ids:  body.table_ids  ? expandTableIds(body.table_ids) : null,
      source:     body.source     || 'web_form',
      updated_at: new Date().toISOString(),
    }
    if (body.status && VALID_STATUSES.includes(body.status)) {
      patch.status = body.status
      if (body.status === 'confirmed') patch.confirmed_at = new Date().toISOString()
    }
    const { error } = await svcClient().from('reservations').update(patch).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Reschedule-request action — fires webhook without changing status
  if (body.action === 'reschedule_requested') {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        const { data: resData } = await svcClient()
          .from('reservations').select('*').eq('id', id).single()
        if (resData) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'reschedule_requested', ...resData }),
          })
        }
      } catch (e) {
        console.error('[webhook] Reschedule notification failed:', e)
      }
    }
    return NextResponse.json({ success: true })
  }

  // Status-only update (also accepts zone + table_ids for the confirmation flow)
  const { status, zone, table_ids } = body
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  }
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === 'confirmed') patch.confirmed_at = new Date().toISOString()
  if (zone      !== undefined) patch.zone      = zone
  if (table_ids !== undefined) patch.table_ids = expandTableIds(table_ids)

  const { error } = await svcClient().from('reservations').update(patch).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fire webhook when a reservation is confirmed
  if (status === 'confirmed') {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        const { data: resData } = await svcClient()
          .from('reservations').select('*').eq('id', id).single()
        if (resData) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'reservation_confirmed', ...resData }),
          })
        }
      } catch (e) {
        console.error('[webhook] Confirmation notification failed:', e)
      }
    }
  }

  return NextResponse.json({ success: true })
}

// ── DELETE — remove reservation ────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await requireSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { error } = await svcClient().from('reservations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
