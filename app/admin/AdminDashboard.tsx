'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LiveMusicManager, { type Artist, type ScheduleDay, type WeeklyEvent } from './LiveMusicManager'
import AdminNav from './components/AdminNav'
import ConfirmTableModal from './reservations/ConfirmTableModal'
import CancelModal from './reservations/CancelModal'
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

function RescheduleTimer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  )
  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() =>
      setRemaining(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    , 1000)
    return () => clearInterval(id)
  }, [expiresAt, remaining])

  if (remaining <= 0) return (
    <span className="text-xs text-red-400 font-medium">Expirada</span>
  )
  const min = Math.floor(remaining / 60)
  const sec = remaining % 60
  const color = remaining < 300 ? 'text-red-400' : remaining < 900 ? 'text-amber-400' : 'text-purple-400'
  return (
    <span className={`text-xs font-mono ${color}`}>
      Pendiente · {min}:{String(sec).padStart(2, '0')}
    </span>
  )
}

function ElapsedTimer({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  )
  useEffect(() => {
    const id = setInterval(() =>
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    , 1000)
    return () => clearInterval(id)
  }, [createdAt])

  const min = Math.floor(elapsed / 60)
  const sec = elapsed % 60
  const label = `${min}:${String(sec).padStart(2, '0')}`

  if (min < 5) return (
    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{label}</span>
  )
  if (min < 10) return (
    <span className="text-xs font-mono text-amber-600 dark:text-amber-400">{label}</span>
  )
  return (
    <span className="text-xs font-mono text-red-500 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
      {label}
    </span>
  )
}

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
  const [proposalExpiry, setProposalExpiry] = useState<Map<string, string>>(new Map())

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

      // Fetch expiry for any reschedule_proposed reservations
      const rescheduled = (data ?? []).filter(r => r.status === 'reschedule_proposed')
      if (rescheduled.length > 0) {
        const { data: proposals } = await supabase
          .from('reschedule_proposals')
          .select('reservation_id, expires_at')
          .in('reservation_id', rescheduled.map(r => r.id))
          .eq('status', 'pending')
        const map = new Map<string, string>()
        for (const p of proposals ?? []) map.set(p.reservation_id, p.expires_at)
        setProposalExpiry(map)
      } else {
        setProposalExpiry(new Map())
      }
    } finally {
      setLoadingDay(false)
    }
  }, [])

  useEffect(() => {
    fetchDay(currentDate)
  }, [currentDate, fetchDay])

  // Poll every 15s when there are active reschedule proposals — picks up client acceptance automatically
  useEffect(() => {
    const hasActive = dayReservations.some(r => r.status === 'reschedule_proposed')
    if (!hasActive) return
    const id = setInterval(() => fetchDay(currentDate), 15000)
    return () => clearInterval(id)
  }, [dayReservations, currentDate, fetchDay])

  // ── Pending queue (all dates) ────────────────────────────
  const [pendingRows, setPendingRows] = useState<Reservation[]>([])
  const [pendingLoading, setPendingLoading] = useState(true)
  const [confirmingRes, setConfirmingRes] = useState<Reservation | null>(null)
  const [cancelingRes, setCancelingRes]   = useState<Reservation | null>(null)

  const fetchPending = useCallback(async () => {
    setPendingLoading(true)
    try {
      const res = await fetch('/api/admin/reservations?status=pending')
      const json = await res.json()
      const sorted = (json.reservations ?? []).slice().sort(
        (a: Reservation, b: Reservation) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      setPendingRows(sorted)
    } finally {
      setPendingLoading(false)
    }
  }, [])

  useEffect(() => { fetchPending() }, [fetchPending])

  async function handleConfirmed() {
    setConfirmingRes(null)
    await Promise.all([fetchPending(), fetchDay(currentDate)])
    startTransition(() => router.refresh())
  }

  async function handleCancelDone() {
    setCancelingRes(null)
    await Promise.all([fetchPending(), fetchDay(currentDate)])
    startTransition(() => router.refresh())
  }

  // ── Zone filter ──────────────────────────────────────────
  const [zoneFilter, setZoneFilter] = useState<'' | 'salon' | 'terraza'>('')

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">N</span>
            </div>
            <span className="text-gray-900 dark:text-white font-semibold text-sm">Nanku Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 dark:text-zinc-500 text-sm hidden md:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="border-t border-gray-200 dark:border-zinc-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-0 min-w-max sm:min-w-0 sm:justify-between">
            <AdminNav />
            <div className="flex gap-0 border-l border-gray-100 dark:border-zinc-800 sm:border-0">
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
                  className={`flex items-center gap-1.5 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition ${
                    tab === t.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {t.icon}
                  {t.label}
                  {t.id === 'reservations' && pendingRows.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      {pendingRows.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* ── Reservations Tab ───────────────────────────── */}
        {tab === 'reservations' && (
          <>
            {/* Pending queue */}
            <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-amber-200 dark:border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    Pendientes por confirmar
                  </span>
                  {!pendingLoading && (
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-500">
                      ({pendingRows.length})
                    </span>
                  )}
                </div>
                <button
                  onClick={fetchPending}
                  className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 transition"
                >
                  ↻ Actualizar
                </button>
              </div>

              {pendingLoading ? (
                <div className="px-4 py-6 text-center text-sm text-amber-600 dark:text-amber-500">
                  Cargando…
                </div>
              ) : pendingRows.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-amber-600 dark:text-amber-500">
                  No hay reservas pendientes.
                </div>
              ) : (
                <div className="divide-y divide-amber-100 dark:divide-amber-500/10">
                  {pendingRows.map(r => (
                    <div key={r.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate">{r.name}</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono">{r.phone || '—'}</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400">
                          {formatDateCR(r.date)} · {formatTimeCR(r.time)} · {r.party_size} pax
                        </span>
                        {r.notes && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 italic truncate max-w-[200px]">
                            "{r.notes}"
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <ElapsedTimer createdAt={r.created_at} />
                        <button
                          onClick={() => setConfirmingRes(r)}
                          disabled={!!actionLoading}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition whitespace-nowrap disabled:opacity-50"
                        >
                          Confirmar y asignar mesa →
                        </button>
                        <button
                          onClick={() => setCancelingRes(r)}
                          disabled={!!actionLoading}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition disabled:opacity-50"
                        >
                          Cancelar / Cambio
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date nav */}
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => goDate(-1)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition text-gray-600 dark:text-zinc-400 text-sm"
                >
                  ◀
                </button>
                <div className="flex-1 text-center">
                  <div className="text-gray-900 dark:text-white font-semibold">{formatDateCR(currentDate)}</div>
                  <div className="text-gray-400 dark:text-zinc-500 text-xs">{currentDate === todayCR() ? 'Hoy' : ''}</div>
                </div>
                <button
                  onClick={() => setCurrentDate(todayCR())}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition text-gray-500 dark:text-zinc-400 text-xs"
                >
                  Hoy
                </button>
                <button
                  onClick={() => goDate(1)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition text-gray-600 dark:text-zinc-400 text-sm"
                >
                  ▶
                </button>
              </div>
              <Link
                href="/admin/new-reservation"
                className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition"
              >
                + Nueva Reserva
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {[
                { label: 'Total',         value: counts.total,     color: 'text-gray-900 dark:text-white' },
                { label: 'Pendientes',    value: counts.pending,   color: 'text-amber-600' },
                { label: 'Confirmadas',   value: counts.confirmed, color: 'text-emerald-600' },
                { label: 'Canceladas',    value: counts.cancelled, color: 'text-red-400' },
                { label: 'No llegaron',   value: counts.no_show,   color: 'text-gray-500' },
                { label: 'Pax del día',   value: counts.pax,       color: 'text-orange-400' },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-400 dark:text-zinc-500 text-xs mt-0.5">{s.label}</div>
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
                      : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Table */}
            {loadingDay ? (
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center text-gray-400 dark:text-zinc-500 text-sm">
                Cargando…
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center text-gray-400 dark:text-zinc-500 text-sm">
                No hay reservas para este día{zoneFilter ? ` en ${zoneFilter}` : ''}.
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                {/* Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Hora</th>
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Nombre</th>
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Teléfono</th>
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Pax</th>
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Zona</th>
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Mesa(s)</th>
                        <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Estado</th>
                        <th className="text-right px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                      {filteredRows.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="px-4 py-3 font-mono text-gray-600 dark:text-zinc-400 text-xs">{formatTimeCR(r.time)}</td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{r.name}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 text-xs font-mono">{r.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-zinc-400 text-center">{r.party_size}</td>
                          <td className="px-4 py-3">
                            {r.zone ? (
                              <span className="text-xs text-gray-500 dark:text-zinc-400 capitalize">{r.zone}</span>
                            ) : <span className="text-gray-400 dark:text-zinc-600">—</span>}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-zinc-400">
                            {(r.table_ids ?? []).join(', ') || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[r.status]}`}>
                              {STATUS_LABELS[r.status]}
                            </span>
                            {r.status === 'reschedule_proposed' && proposalExpiry.get(r.id) && (
                              <div className="mt-1">
                                <RescheduleTimer expiresAt={proposalExpiry.get(r.id)!} />
                              </div>
                            )}
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
                                  onClick={() => setCancelingRes(r)}
                                  disabled={!!actionLoading || isPending}
                                  className="text-xs px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition"
                                >
                                  ✕ Cancelar
                                </button>
                              )}
                              {r.status === 'confirmed' && (
                                <button
                                  onClick={() => changeStatus(r.id, 'no_show')}
                                  disabled={!!actionLoading || isPending}
                                  className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 transition"
                                >
                                  {actionLoading === r.id + 'no_show' ? '…' : 'No llegó'}
                                </button>
                              )}
                              <Link
                                href={`/admin/new-reservation?id=${r.id}`}
                                className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 transition"
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
                <div className="lg:hidden divide-y divide-gray-200 dark:divide-zinc-800">
                  {filteredRows.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 dark:bg-zinc-900">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium">{r.name}</div>
                          <div className="text-gray-400 dark:text-zinc-500 text-xs font-mono">{r.phone}</div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[r.status]}`}>
                            {STATUS_LABELS[r.status]}
                          </span>
                          {r.status === 'reschedule_proposed' && proposalExpiry.get(r.id) && (
                            <RescheduleTimer expiresAt={proposalExpiry.get(r.id)!} />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400 mb-3 grid grid-cols-2 gap-1">
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
                          <button onClick={() => setCancelingRes(r)} disabled={!!actionLoading}
                            className="flex-1 text-xs py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition">
                            Cancelar
                          </button>
                        )}
                        {r.status === 'confirmed' && (
                          <button onClick={() => changeStatus(r.id, 'no_show')} disabled={!!actionLoading}
                            className="flex-1 text-xs py-1.5 rounded-md bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 disabled:opacity-50 transition">
                            No llegó
                          </button>
                        )}
                        <Link href={`/admin/new-reservation?id=${r.id}`}
                          className="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition">
                          ✏ Editar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-400 dark:text-zinc-500 text-xs mt-3 text-right">{filteredRows.length} reservas</p>
          </>
        )}

        {/* ── Live Music Tab ──────────────────────────────── */}
        {tab === 'live-music' && (
          <LiveMusicManager initialSchedule={schedule} initialEvents={events} initialArtists={artists} />
        )}
      </main>

      {confirmingRes && (
        <ConfirmTableModal
          reservation={confirmingRes}
          onCancel={() => setConfirmingRes(null)}
          onConfirmed={handleConfirmed}
        />
      )}

      {cancelingRes && (
        <CancelModal
          reservation={cancelingRes}
          onClose={() => setCancelingRes(null)}
          onDone={handleCancelDone}
        />
      )}
    </div>
  )
}
