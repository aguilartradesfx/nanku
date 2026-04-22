import { createClient as createServiceClient } from '@supabase/supabase-js'
import ReschedulePageClient from './ReschedulePageClient'

function svcClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export const dynamic = 'force-dynamic'

export default async function RescheduleTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const supabase = svcClient()

  const { data: proposal } = await supabase
    .from('reschedule_proposals')
    .select('*, reservations(*)')
    .eq('token', params.token)
    .single()

  // Expired at load time
  if (proposal?.status === 'pending' && new Date(proposal.expires_at) < new Date()) {
    await supabase
      .from('reschedule_proposals')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', proposal.id)

    await supabase
      .from('reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', proposal.reservation_id)

    return <ExpiredPage />
  }

  if (!proposal || proposal.status !== 'pending') {
    return <UnavailablePage status={proposal?.status} />
  }

  return (
    <ReschedulePageClient
      token={params.token}
      proposal={proposal}
      reservation={proposal.reservations}
    />
  )
}

// ── Static error screens ──────────────────────────────────────

function ExpiredPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-white font-serif text-3xl font-bold tracking-wide mb-8">Nanku</h1>
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          <div className="text-5xl mb-5">⏰</div>
          <h2 className="text-white text-xl font-semibold mb-2">Esta propuesta expiró</h2>
          <p className="text-zinc-400 text-sm mb-6">
            El tiempo para confirmar tu horario ha vencido. Contactanos por WhatsApp y con gusto te ayudamos.
          </p>
          <a
            href="https://wa.me/50624790707"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-xl font-medium transition text-sm"
          >
            WhatsApp +506 2479-0707
          </a>
        </div>
      </div>
    </div>
  )
}

function UnavailablePage({ status }: { status?: string }) {
  const accepted = status === 'accepted'
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-white font-serif text-3xl font-bold tracking-wide mb-8">Nanku</h1>
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          {accepted ? (
            <>
              <div className="text-5xl mb-5">✓</div>
              <h2 className="text-white text-xl font-semibold mb-2">¡Ya confirmaste tu reserva!</h2>
              <p className="text-zinc-400 text-sm">Esta propuesta ya fue utilizada. ¡Te esperamos en Nanku!</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-5">🔍</div>
              <h2 className="text-white text-xl font-semibold mb-2">Esta propuesta ya no está disponible</h2>
              <p className="text-zinc-400 text-sm mb-6">El enlace que usaste ya no es válido.</p>
              <a
                href="https://wa.me/50624790707"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-xl font-medium transition text-sm"
              >
                WhatsApp +506 2479-0707
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
