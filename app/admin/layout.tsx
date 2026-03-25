import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: {
    template: '%s | Nanku Admin',
    default: 'Dashboard | Nanku Admin',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
