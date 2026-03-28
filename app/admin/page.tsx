import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

export const metadata = { title: 'Reservations Dashboard' }

export default async function AdminPage() {
  const supabase = createClient()

  const [
    { data: reservations, error },
    { data: { user } },
    { data: schedule },
    { data: events },
    { data: artists },
  ] = await Promise.all([
    supabase.from('reservations').select('*').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
    supabase.from('live_music_schedule').select('*').order('sort_order'),
    supabase.from('weekly_events').select('*').order('sort_order'),
    supabase.from('artists').select('*').order('sort_order'),
  ])

  return (
    <AdminDashboard
      reservations={reservations ?? []}
      error={error?.message ?? null}
      userEmail={user?.email ?? ''}
      schedule={schedule ?? []}
      events={events ?? []}
      artists={artists ?? []}
    />
  )
}
