'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Reservation = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  party_size: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  notes?: string
}

type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled'

export default function AdminDashboard({
  reservations,
  error,
  userEmail,
}: {
  reservations: Reservation[]
  error: string | null
  userEmail: string
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [isPending, startTransition] = useTransition()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = reservations.filter((r) =>
    filter === 'all' ? true : r.status === filter
  )

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  }

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    setActionLoading(id + status)
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
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

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function formatCreatedAt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm">N</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm">Nanku Admin</span>
              <span className="text-zinc-500 text-sm ml-2 hidden sm:inline">· Reservations</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-sm hidden md:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-zinc-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(['all', 'pending', 'confirmed', 'cancelled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl border p-4 text-left transition ${
                filter === f
                  ? 'border-orange-500/40 bg-orange-500/5'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="text-2xl font-bold text-white">{counts[f]}</div>
              <div className={`text-sm mt-0.5 capitalize ${filter === f ? 'text-orange-400' : 'text-zinc-400'}`}>
                {f === 'all' ? 'Total' : f}
              </div>
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-950/50 border border-red-800/50 rounded-xl p-4 mb-6 text-red-400 text-sm">
            Error loading reservations: {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
          {(['all', 'pending', 'confirmed', 'cancelled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition capitalize ${
                filter === f
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <div className="text-zinc-600 text-sm">No reservations found</div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Guest</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Contact</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Date &amp; Time</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Party</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Submitted</th>
                    <th className="text-right px-4 py-3 text-zinc-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filtered.map((r) => (
                    <tr key={r.id} className="bg-zinc-900/30 hover:bg-zinc-900/60 transition">
                      <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                      <td className="px-4 py-3">
                        <div className="text-zinc-300">{r.email}</div>
                        <div className="text-zinc-500 text-xs">{r.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-zinc-300">{formatDate(r.date)}</div>
                        <div className="text-zinc-500 text-xs">{r.time}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{r.party_size}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${statusStyles[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{formatCreatedAt(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {r.status !== 'confirmed' && (
                            <button
                              onClick={() => updateStatus(r.id, 'confirmed')}
                              disabled={actionLoading === r.id + 'confirmed' || isPending}
                              className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {actionLoading === r.id + 'confirmed' ? '…' : 'Confirm'}
                            </button>
                          )}
                          {r.status !== 'cancelled' && (
                            <button
                              onClick={() => updateStatus(r.id, 'cancelled')}
                              disabled={actionLoading === r.id + 'cancelled' || isPending}
                              className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {actionLoading === r.id + 'cancelled' ? '…' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-zinc-800/50">
              {filtered.map((r) => (
                <div key={r.id} className="p-4 bg-zinc-900/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-white font-medium">{r.name}</div>
                      <div className="text-zinc-400 text-sm">{r.email}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-zinc-400 mb-3">
                    <span>{formatDate(r.date)} · {r.time}</span>
                    <span>Party: {r.party_size}</span>
                    <span>{r.phone}</span>
                    <span className="text-zinc-600 text-xs">{formatCreatedAt(r.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    {r.status !== 'confirmed' && (
                      <button
                        onClick={() => updateStatus(r.id, 'confirmed')}
                        disabled={actionLoading === r.id + 'confirmed' || isPending}
                        className="flex-1 text-xs py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition"
                      >
                        Confirm
                      </button>
                    )}
                    {r.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(r.id, 'cancelled')}
                        disabled={actionLoading === r.id + 'cancelled' || isPending}
                        className="flex-1 text-xs py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-zinc-600 text-xs mt-4 text-right">
          {filtered.length} of {reservations.length} reservations
        </p>
      </main>
    </div>
  )
}
