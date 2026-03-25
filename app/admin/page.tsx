import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

export const metadata = {
  title: 'Reservations Dashboard',
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <AdminDashboard
      reservations={reservations ?? []}
      error={error?.message ?? null}
      userEmail={user?.email ?? ''}
    />
  )
}
