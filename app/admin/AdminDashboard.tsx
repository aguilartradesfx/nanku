'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LiveMusicManager, { type Artist, type ScheduleDay, type WeeklyEvent } from './LiveMusicManager'
import AdminNav from './components/AdminNav'
import {
  type Reservation,
  type ReservationStatus,
  STATUS_LABELS,
  STATUS_STYLES,
  todayCR,
  formatDateCR,
  formatTimeCR,
  addDays,
} from '@/lib/reservations'

type Tab = 'reservations' | 'live-music'

export default function AdminDashboard({
  reservations: initialReservations,
  error: initialError,
  userEmail,
  schedule,
  events,
  artists,
}: {
  reservations: Reservation[]
  error: string | null
  userEmail: string
  schedule: ScheduleDay[]
  events: WeeklyEvent[]
  artists: Artist[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('reservations')
  const [isPending, startTransition] = useTransition()

  // ── Date navigation ──────────────────────────────────────
  const [currentDate, setCurrentDate] = useState(todayCR())
  const [dayReservations, setDayReservations] = useState<Reservation[]>(
    initialReservations.filter(r => r.date === todayCR())
  )
  const [loadingDay, setLoadingDay] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // ── Zone filter ──────────────────────────────────────────
  const [zoneFilter, setZoneFilter] = useState<'' | 'salon' | 'terraza'>('')

  const fetchDay = useCallback(async (date: string) => {
    setLoadingDay(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true })
      setDayReservations(data ?? [])
    } finally {
      setLoadingDay(false)
    }
  }, [])

  useEffect(() => {
    fetchDay(currentDate)
  }, [currentDate, fetchDay])

  function goDate(n: number) {
    setCurrentDate(prev => addDays(prev, n))
  }

  // ── Stats ────────────────────────────────────────────────
  const counts = {
    total:     dayReservations.length,
    pending:   dayReservations.filter(r => r.status === 'pending').length,
    confirmed: dayReservations.filter(r => r.status === 'confirmed').length,
    cancelled: dayReservations.filter(r => r.status === 'cancelled').length,
    no_show:   dayReservations.filter(r => r.status === 'no_show').length,
    pax:       dayReservations
      .filter(r => r.status !== 'cancelled' && r.status !== 'no_show')
      .reduce((s, r) => s + (parseInt(r.party_size) || 0), 0),
  }

  // For Live Music tab badge (all pending)
  const pendingTotal = initialReservations.filter(r => r.status === 'pending').length

  // ── Filtered rows ────────────────────────────────────────
  const filteredRows = dayReservations.filter(r =>
    zoneFilter ? r.zone === zoneFilter : true
  )

  // ── Actions ──────────────────────────────────────────────
  async function changeStatus(id: string, status: ReservationStatus) {
    setActionLoading(id + status)
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        await fetchDay(currentDate)
        startTransition(() => router.refresh())
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">N</span>
            </div>
            <span className="text-gray-900 font-semibold text-sm">Nanku Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden md:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-900 text-sm transition px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="border-t border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 justify-between">
            <AdminNav />
            <div className="flex gap-0">
              {([
                { id: 'reservations' as Tab, label: 'Dashboard', icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                )},
                { id: 'live-music' as Tab, label: 'Live Music', icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                )},
              ]).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                    tab === t.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.icon}
                  {t.label}
                  {t.id === 'reservations' && counts.pending > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      {counts.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Reservations Tab ───────────────────────────── */}
        {tab === 'reservations' && (
          <>
            {/* Date nav */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => goDate(-1)}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600 text-sm"
              >
                ◀
              </button>
              <div className="flex-1 text-center">
                <div className="text-gray-900 font-semibold">{formatDateCR(currentDate)}</div>
                <div className="text-gray-400 text-xs">{currentDate === todayCR() ? 'Hoy' : ''}</div>
              </div>
              <button
                onClick={() => setCurrentDate(todayCR())}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-500 text-xs"
              >
                Hoy
              </button>
              <button
                onClick={() => goDate(1)}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600 text-sm"
              >
                ▶
              </button>
              <Link
                href="/admin/new-reservation"
                className="ml-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition"
              >
                + Nueva Reserva
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {[
                { label: 'Total',         value: counts.total,     color: 'text-gray-900' },
                { label: 'Pendientes',    value: counts.pending,   color: 'text-amber-600' },
                { label: 'Confirmadas',   value: counts.confirmed, color: 'text-emerald-600' },
                { label: 'Canceladas',    value: counts.cancelled, color: 'text-red-400' },
                { label: 'No llegaron',   value: counts.no_show,   color: 'text-gray-500' },
                { label: 'Pax del día',   value: counts.pax,       color: 'text-orange-400' },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Zone filter */}
            <div className="flex items-center gap-2 mb-4">
              {([
                { val: '' as const,        label: 'Todas las zonas' },
                { val: 'salon' as const,   label: 'Salón' },
                { val: 'terraza' as const, label: 'Terraza' },
              ]).map(z => (
                <button
                  key={z.val}
                  onClick={() => setZoneFilter(z.val)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                    zoneFilter === z.val
                      ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                      : 'border-gray-200 bg-white text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Table */}
            {loadingDay ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400 text-sm">
                Cargando…
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400 text-sm">
                No hay reservas para este día{zoneFilter ? ` en ${zoneFilter}` : ''}.
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {/* Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Hora</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Nombre</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Teléfono</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Pax</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Zona</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Mesa(s)</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                        <th className="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRows.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-mono text-gray-600 text-xs">{formatTimeCR(r.time)}</td>
                          <td className="px-4 py-3 text-gray-900 font-medium">{r.name}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs font-mono">{r.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-600 text-center">{r.party_size}</td>
                          <td className="px-4 py-3">
                            {r.zone ? (
                              <span className="text-xs text-gray-500 capitalize">{r.zone}</span>
                            ) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">
                            {(r.table_ids ?? []).join(', ') || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[r.status]}`}>
                              {STATUS_LABELS[r.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {r.status === 'pending' && (
                                <button
                                  onClick={() => changeStatus(r.id, 'confirmed')}
                                  disabled={!!actionLoading || isPending}
                                  className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition"
                                >
                                  {actionLoading === r.id + 'confirmed' ? '…' : '✔ Confirmar'}
                                </button>
                              )}
                              {(r.status === 'pending' || r.status === 'confirmed') && (
                                <button
                                  onClick={() => changeStatus(r.id, 'cancelled')}
                                  disabled={!!actionLoading || isPending}
                                  className="text-xs px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition"
                                >
                                  {actionLoading === r.id + 'cancelled' ? '…' : '✕ Cancelar'}
                                </button>
                              )}
                              {r.status === 'confirmed' && (
                                <button
                                  onClick={() => changeStatus(r.id, 'no_show')}
                                  disabled={!!actionLoading || isPending}
                                  className="text-xs px-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition"
                                >
                                  {actionLoading === r.id + 'no_show' ? '…' : 'No llegó'}
                                </button>
                              )}
                              <Link
                                href={`/admin/new-reservation?id=${r.id}`}
                                className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition"
                              >
                                ✏ Editar
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {filteredRows.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-gray-900 font-medium">{r.name}</div>
                          <div className="text-gray-400 text-xs font-mono">{r.phone}</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-3 grid grid-cols-2 gap-1">
                        <span>{formatTimeCR(r.time)} · {r.party_size} pax</span>
                        <span>{r.zone ?? '—'} · {(r.table_ids ?? []).join(', ') || '—'}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {r.status === 'pending' && (
                          <button onClick={() => changeStatus(r.id, 'confirmed')} disabled={!!actionLoading}
                            className="flex-1 text-xs py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition">
                            ✔ Confirmar
                          </button>
                        )}
                        {(r.status === 'pending' || r.status === 'confirmed') && (
                          <button onClick={() => changeStatus(r.id, 'cancelled')} disabled={!!actionLoading}
                            className="flex-1 text-xs py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition">
                            Cancelar
                          </button>
                        )}
                        {r.status === 'confirmed' && (
                          <button onClick={() => changeStatus(r.id, 'no_show')} disabled={!!actionLoading}
                            className="flex-1 text-xs py-1.5 rounded-md bg-gray-100 border border-gray-300 text-gray-500 disabled:opacity-50 transition">
                            No llegó
                          </button>
                        )}
                        <Link href={`/admin/new-reservation?id=${r.id}`}
                          className="text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-500 hover:text-gray-900 transition">
                          ✏ Editar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-400 text-xs mt-3 text-right">{filteredRows.length} reservas</p>
          </>
        )}

        {/* ── Live Music Tab ──────────────────────────────── */}
        {tab === 'live-music' && (
          <LiveMusicManager initialSchedule={schedule} initialEvents={events} initialArtists={artists} />
        )}
      </main>
    </div>
  )
}
