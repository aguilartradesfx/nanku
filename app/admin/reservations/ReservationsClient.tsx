'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminNav from '../components/AdminNav'
import ConfirmTableModal from './ConfirmTableModal'
import {
  type Reservation,
  type ReservationStatus,
  STATUS_LABELS,
  STATUS_STYLES,
  formatDateCR,
  formatTimeCR,
  todayCR,
} from '@/lib/reservations'

const PAGE_SIZE = 20

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
  const display = `${min}:${String(sec).padStart(2, '0')}`

  const isGreen  = min < 5
  const isYellow = min >= 5 && min < 10
  // red = 10+ min

  const containerCls = isGreen
    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400'
    : isYellow
    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400'
    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'

  const dotCls = isGreen
    ? 'bg-emerald-500'
    : isYellow
    ? 'bg-amber-500'
    : 'bg-red-500 animate-pulse'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono border ${containerCls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotCls}`} />
      {display}
    </span>
  )
}

export default function ReservationsClient({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const [rows, setRows]           = useState<Reservation[]>([])
  const [filtered, setFiltered]   = useState<Reservation[]>([])
  const [loading, setLoading]     = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage]           = useState(1)

  // Pending-confirmation state — fetched independently of main filters
  const [pendingRows, setPendingRows]   = useState<Reservation[]>([])
  const [pendingLoading, setPendingLoading] = useState(true)
  const [confirmingRes, setConfirmingRes]   = useState<Reservation | null>(null)

  // Filters
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo, setDateTo]       = useState('')
  const [status, setStatus]       = useState('')
  const [zone, setZone]           = useState('')
  const [search, setSearch]       = useState('')

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo)   params.set('dateTo', dateTo)
      if (status)   params.set('status', status)
      if (zone)     params.set('zone', zone)
      const res = await fetch(`/api/admin/reservations?${params}`)
      const json = await res.json()
      setRows(json.reservations ?? [])
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo, status, zone])

  useEffect(() => { fetchData() }, [fetchData])

  const fetchPending = useCallback(async () => {
    setPendingLoading(true)
    try {
      const res  = await fetch('/api/admin/reservations?status=pending')
      const json = await res.json()
      // Sort by arrival order: who submitted first appears first
      const sorted = (json.reservations ?? []).sort((a: Reservation, b: Reservation) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      setPendingRows(sorted)
    } finally {
      setPendingLoading(false)
    }
  }, [])

  useEffect(() => { fetchPending() }, [fetchPending])

  const handleConfirmed = useCallback(() => {
    setConfirmingRes(null)
    fetchPending()
    fetchData()
  }, [fetchPending, fetchData])

  // Client-side search filter
  useEffect(() => {
    const q = search.trim().toLowerCase()
    setFiltered(q
      ? rows.filter(r =>
          r.name.toLowerCase().includes(q) ||
          (r.phone ?? '').toLowerCase().includes(q)
        )
      : rows
    )
    setPage(1)
  }, [rows, search])

  function handleSearch(val: string) {
    setSearch(val)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
  }

  function clearFilters() {
    setDateFrom(''); setDateTo(''); setStatus(''); setZone(''); setSearch('')
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function changeStatus(id: string, newStatus: ReservationStatus) {
    if (!confirm(`¿${newStatus === 'cancelled' ? 'Cancelar' : newStatus === 'confirmed' ? 'Confirmar' : 'Marcar como no presentado'} esta reserva?`)) return
    setActionLoading(id + newStatus)
    try {
      await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      await fetchData()
    } finally { setActionLoading(null) }
  }

  async function deleteRow(id: string) {
    if (!confirm('¿Eliminar esta reserva permanentemente? No se puede deshacer.')) return
    setActionLoading(id + 'del')
    try {
      await fetch(`/api/admin/reservations?id=${id}`, { method: 'DELETE' })
      await fetchData()
    } finally { setActionLoading(null) }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // CSV export
  function exportCSV() {
    if (!filtered.length) return
    const headers = ['Fecha','Hora','Nombre','Email','Teléfono','Pax','Zona','Mesas','Estado','Notas','Origen']
    const csvRows = filtered.map(r => [
      r.date, r.time, r.name, r.email ?? '', r.phone ?? '', r.party_size,
      r.zone ?? '', (r.table_ids ?? []).join(';'), r.status, (r.notes ?? '').replace(/\n/g,' '), r.source ?? ''
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    const csv  = [headers.join(','), ...csvRows].join('\r\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: `nanku-reservas-${todayCR()}.csv` })
    a.click(); URL.revokeObjectURL(url)
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
            <button onClick={handleSignOut} className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
              Sign out
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-zinc-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todas las Reservas</h1>
            <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition">
              ⬇ CSV
            </button>
            <Link href="/admin/new-reservation" className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition">
              + Nueva Reserva
            </Link>
          </div>
        </div>

        {/* ── Pending-confirmation section ───────────────── */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 mb-6">
          <div className="px-4 py-3 border-b border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingRows.length}
              </span>
              <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Pendientes por confirmar
              </h2>
            </div>
            <button
              onClick={fetchPending}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              Actualizar
            </button>
          </div>

          {pendingLoading ? (
            <div className="px-4 py-6 text-center text-sm text-amber-600 dark:text-amber-500">
              Cargando…
            </div>
          ) : pendingRows.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-amber-600/60 dark:text-amber-500/60">
              No hay reservas pendientes
            </div>
          ) : (
            <div className="divide-y divide-amber-100 dark:divide-amber-900/30">
              {pendingRows.map(r => (
                <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {r.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 space-x-1.5">
                      <span>{formatDateCR(r.date)}</span>
                      <span>·</span>
                      <span>{r.time}</span>
                      <span>·</span>
                      <span>{r.party_size} pax</span>
                      {r.phone && <><span>·</span><span className="font-mono">{r.phone}</span></>}
                    </div>
                    {r.notes && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 italic mt-0.5 truncate">
                        {r.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                    <ElapsedTimer createdAt={r.created_at} />
                    <button
                      onClick={() => setConfirmingRes(r)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition"
                    >
                      Confirmar y asignar mesa →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-gray-400 dark:text-zinc-500 text-xs mb-1 uppercase tracking-wide">Desde</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-gray-400 dark:text-zinc-500 text-xs mb-1 uppercase tracking-wide">Hasta</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-gray-400 dark:text-zinc-500 text-xs mb-1 uppercase tracking-wide">Estado</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option value="">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="no_show">No se presentó</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 dark:text-zinc-500 text-xs mb-1 uppercase tracking-wide">Zona</label>
              <select value={zone} onChange={e => setZone(e.target.value)}
                className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option value="">Todas</option>
                <option value="salon">Salón</option>
                <option value="terraza">Terraza</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500 placeholder-gray-400 dark:placeholder-zinc-600"
            />
            <button onClick={clearFilters} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition">
              Limpiar
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center text-gray-400 dark:text-zinc-500 text-sm">Cargando…</div>
        ) : pageRows.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center text-gray-400 dark:text-zinc-500 text-sm">No hay reservas con estos filtros.</div>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            {/* Desktop table - hidden on mobile */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Fecha / Hora</th>
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Nombre</th>
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Teléfono</th>
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Pax</th>
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Zona / Mesa</th>
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Estado</th>
                    <th className="text-left px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Notas</th>
                    <th className="text-right px-4 py-3 text-gray-500 dark:text-zinc-400 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {pageRows.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                      <td className="px-4 py-3">
                        <div className="text-gray-600 dark:text-zinc-400 text-xs">{formatDateCR(r.date)}</div>
                        <div className="text-gray-400 dark:text-zinc-500 text-xs font-mono">{formatTimeCR(r.time)}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 text-xs font-mono">{r.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400 text-center">{r.party_size}</td>
                      <td className="px-4 py-3">
                        <div className="text-gray-500 dark:text-zinc-400 text-xs capitalize">{r.zone ?? '—'}</div>
                        <div className="text-gray-400 dark:text-zinc-500 text-xs font-mono">{(r.table_ids ?? []).join(', ') || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 dark:text-zinc-500 text-xs italic max-w-[140px] truncate">
                        {r.notes || ''}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {r.status === 'pending' && (
                            <button onClick={() => setConfirmingRes(r)}
                              className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition">
                              ✔
                            </button>
                          )}
                          {(r.status === 'pending' || r.status === 'confirmed') && (
                            <button onClick={() => changeStatus(r.id, 'cancelled')} disabled={!!actionLoading}
                              className="text-xs px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition">
                              {actionLoading === r.id + 'cancelled' ? '…' : '✕'}
                            </button>
                          )}
                          <Link href={`/admin/new-reservation?id=${r.id}`}
                            className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition">
                            ✏
                          </Link>
                          <button onClick={() => deleteRow(r.id)} disabled={!!actionLoading}
                            className="text-xs px-2 py-1 rounded-md border border-red-900/40 text-red-600 hover:text-red-400 disabled:opacity-50 transition">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards - hidden on sm+ */}
            <div className="sm:hidden divide-y divide-gray-200 dark:divide-zinc-800">
              {pageRows.map(r => (
                <div key={r.id} className="p-4 bg-white dark:bg-zinc-900">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{r.name}</div>
                      <div className="text-xs text-gray-400 dark:text-zinc-500 font-mono">{r.phone || '—'}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400 mb-3 space-y-0.5">
                    <div>{formatDateCR(r.date)} · {formatTimeCR(r.time)} · {r.party_size} pax</div>
                    <div>{r.zone ?? '—'} · Mesa: {(r.table_ids ?? []).join(', ') || '—'}</div>
                    {r.notes && <div className="italic text-gray-400 dark:text-zinc-500 truncate">{r.notes}</div>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {r.status === 'pending' && (
                      <button onClick={() => setConfirmingRes(r)}
                        className="flex-1 text-xs py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition">
                        ✔ Confirmar
                      </button>
                    )}
                    {(r.status === 'pending' || r.status === 'confirmed') && (
                      <button onClick={() => changeStatus(r.id, 'cancelled')} disabled={!!actionLoading}
                        className="flex-1 text-xs py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition">
                        ✕ Cancelar
                      </button>
                    )}
                    <Link href={`/admin/new-reservation?id=${r.id}`}
                      className="text-xs px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition">
                      ✏ Editar
                    </Link>
                    <button onClick={() => deleteRow(r.id)} disabled={!!actionLoading}
                      className="text-xs px-3 py-2 rounded-md border border-red-900/40 text-red-500 hover:text-red-400 disabled:opacity-50 transition">
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 text-sm disabled:opacity-40 hover:border-gray-300 transition">◀</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .map((n, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span key={`gap-${n}`} className="text-gray-400 dark:text-zinc-500 text-sm px-1">…</span>}
                  <button key={n} onClick={() => setPage(n)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition ${n === page ? 'border-orange-500/40 bg-orange-500/10 text-orange-400' : 'border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:border-gray-300'}`}>
                    {n}
                  </button>
                </>
              ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 text-sm disabled:opacity-40 hover:border-gray-300 transition">▶</button>
          </div>
        )}
      </main>

      {/* Table-assignment confirmation modal */}
      {confirmingRes && (
        <ConfirmTableModal
          reservation={confirmingRes}
          onCancel={() => setConfirmingRes(null)}
          onConfirmed={handleConfirmed}
        />
      )}
    </div>
  )
}
