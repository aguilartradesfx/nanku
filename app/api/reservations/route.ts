import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone_code, phone, date, time, party_size, notes } = body

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 5) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
    }
    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: 'Reservation date is required.' }, { status: 400 })
    }
    const reservationDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (reservationDate < today) {
      return NextResponse.json({ error: 'Reservation date must be today or in the future.' }, { status: 400 })
    }
    if (!time || typeof time !== 'string') {
      return NextResponse.json({ error: 'Reservation time is required.' }, { status: 400 })
    }
    if (!party_size || typeof party_size !== 'string') {
      return NextResponse.json({ error: 'Party size is required.' }, { status: 400 })
    }

    // Use service role to bypass RLS for inserts
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { error } = await supabase.from('reservations').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone_code: phone_code ?? '+506',
      phone: phone.trim(),
      date,
      time,
      party_size,
      notes: notes?.trim() || null,
      status: 'pending',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save reservation. Please try again.' }, { status: 500 })
    }

    // Fire webhook notification (non-blocking — errors do not affect the reservation)
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone_code: phone_code ?? '+506',
            phone: phone.trim(),
            date,
            time,
            party_size,
            notes: notes?.trim() || null,
          }),
        })
      } catch (webhookErr) {
        console.error('Webhook notification failed:', webhookErr)
      }
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Reservation API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
