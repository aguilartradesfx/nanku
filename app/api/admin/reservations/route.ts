import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// GET all reservations (admin only)
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reservations: data })
  } catch (err) {
    console.error('Admin GET reservations error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH update reservation status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Reservation ID is required.' }, { status: 400 })
    }

    const validStatuses = ['confirmed', 'cancelled', 'pending']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 })
    }

    // Use service role to bypass RLS for admin updates
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { error } = await serviceClient
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update reservation.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin PATCH reservation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
