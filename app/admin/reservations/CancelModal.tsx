'use client'

import { useState, useEffect } from 'react'
import type { Reservation } from '@/lib/reservations'
import { formatDateCR, formatTimeCR } from '@/lib/reservations'
import { ALL_SLOTS, ALL_TABLES } from '@/lib/tables'

// Normalize any time string to 24h format (HH:MM)
function to24h(time: string): string {
  if (!time) return ''
  if (!time.includes(' ')) return time
  const [timePart, ampm] = time.split(' ')
  const [hStr, mStr] = timePart.split(':')
  let h = parseInt(hStr, 10)
  const m = mStr ?? '00'
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m}`
}

interface Props {
  reservation: Reservation
  onClose: () => void
  onDone: () => void
}

export default function CancelModal({ reservation, onClose, onDone }: Props) {
  const [mode, setMode]             = useState<'cancel' | 'reschedule'>('cancel')
  const [proposedDate, setProposedDate] = useState(reservation.date)
  const [selectedSlots, setSelectedSlots] = useState<Map<string, string[]>>(new Map())
  const [confirmedForDate, setConfirmedForDate] = useState<Reservation[]>([])
  const [loadingSlots, setLoadingSlots]   = useState(false)
  const [expandedSlot, setExpandedSlot]   = useState<string | null>(null)
  const [submitting, setSubmitting]       = useState(false)

  const originalTime24 = to24h(reservation.time)

  useEffect(() => {
    if (mode !== 'reschedule' || !proposedDate) return
    let cancelled = false
    const load = async () => {
      setLoadingSlots(true)
      try {
        const res  = await fetch(`/api/admin/reservations?date=${proposedDate}&status=confirmed`)
        const json = await res.json()
        if (!cancelled) setConfirmedForDate(json.reservations ?? [])
      } finally {
        if (!cancelled) setLoadingSlots(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [mode, proposedDate])

  function occupiedAtSlot(slotTime: string): Set<string> {
    const occupied = new Set<string>()
    for (const r of confirmedForDate) {
      if (to24h(r.time) === slotTime && r.id !== reservation.id) {
        for (const tid of r.table_ids ?? []) occupied.add(tid)
      }
    }
    return occupied
  }

  function toggleSlot(time: string) {
    const next = new Map(selectedSlots)
    if (next.has(time)) {
      next.delete(time)
      if (expandedSlot === time) setExpandedSlot(null)
    } else {
      next.set(time, [])
      setExpandedSlot(time)
    }
    setSelectedSlots(next)
  }

  function toggleTableForSlot(slotTime: string, tableId: string) {
    const next    = new Map(selectedSlots)
    const current = next.get(slotTime) ?? []
    next.set(
      slotTime,
      current.includes(tableId)
        ? current.filter(t => t !== tableId)
        : [...current, tableId]
    )
    setSelectedSlots(next)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      if (mode === 'cancel') {
        const res = await fetch('/api/admin/cancel-reservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cancel', id: reservation.id }),
        })
        if (!res.ok) {
          const data = await res.json()
          alert(data.error || 'Error al cancelar.')
          return
        }
      } else {
        if (selectedSlots.size === 0) {
          alert('Seleccioná al menos un horario para proponer.')
          return
        }
        const proposed_times = Array.from(selectedSlots.entries()).map(([time, table_ids]) => ({
          time,
          table_ids,
        }))
        const res = await fetch('/api/admin/cancel-reservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action:         'reschedule_propose',
            id:             reservation.id,
            proposed_date:  proposedDate,
            proposed_times,
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          alert(data.error || 'Error al proponer cambio.')
          return
        }
      }
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  const availableSlots = ALL_SLOTS.filter(s => s !== originalTime24)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Cancelar reserva de {reservation.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            {formatDateCR(reservation.date)} · {formatTimeCR(reservation.time)} · {reservation.party_size} pax
          </p>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* Mode selector */}
          <div className="space-y-2 mb-5">
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                mode === 'cancel'
                  ? 'border-red-400 bg-red-50 dark:bg-red-950/20 dark:border-red-700/40'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
              <input
                type="radio" name="cancel-mode" value="cancel"
                checked={mode === 'cancel'}
                onChange={() => setMode('cancel')}
                className="mt-0.5 accent-red-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Cancelar definitivamente</div>
                <div className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Notifica al cliente que su reserva fue cancelada.</div>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                mode === 'reschedule'
                  ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-700/40'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
              <input
                type="radio" name="cancel-mode" value="reschedule"
                checked={mode === 'reschedule'}
                onChange={() => setMode('reschedule')}
                className="mt-0.5 accent-orange-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Proponer cambio de horario</div>
                <div className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">El cliente recibe opciones y elige. El link expira en 30 minutos.</div>
              </div>
            </label>
          </div>

          {/* Reschedule options */}
          {mode === 'reschedule' && (
            <div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Fecha para las propuestas
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={e => { setProposedDate(e.target.value); setSelectedSlots(new Map()) }}
                  className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                    Horarios disponibles
                  </span>
                  {selectedSlots.size > 0 && (
                    <span className="text-xs text-orange-500 font-medium">
                      {selectedSlots.size} seleccionado{selectedSlots.size !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="text-sm text-gray-400 dark:text-zinc-500 py-6 text-center">
                    Cargando disponibilidad…
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {availableSlots.map(slot => {
                      const occupied      = occupiedAtSlot(slot)
                      const isSelected    = selectedSlots.has(slot)
                      const isExpanded    = expandedSlot === slot
                      const selectedTbls  = selectedSlots.get(slot) ?? []
                      const visibleTables = ALL_TABLES.filter(t => !t.hidden)

                      return (
                        <div
                          key={slot}
                          className={`rounded-xl border overflow-hidden transition ${
                            isSelected
                              ? 'border-orange-400 dark:border-orange-600'
                              : 'border-gray-200 dark:border-zinc-700'
                          }`}
                        >
                          {/* Slot row */}
                          <div
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none ${
                              isSelected
                                ? 'bg-orange-50 dark:bg-orange-950/20'
                                : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                            }`}
                            onClick={() => toggleSlot(slot)}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${
                                isSelected
                                  ? 'bg-orange-500 border-orange-500'
                                  : 'border-gray-300 dark:border-zinc-600'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>

                            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 flex-1">
                              {formatTimeCR(slot)}
                            </span>

                            {selectedTbls.length > 0 && (
                              <span className="text-xs text-orange-500 font-mono">
                                {selectedTbls.join(', ')}
                              </span>
                            )}

                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setExpandedSlot(isExpanded ? null : slot) }}
                                className="text-xs text-orange-400 hover:text-orange-600 transition shrink-0 px-1"
                              >
                                {isExpanded ? '▲' : '▼'} mesa
                              </button>
                            )}
                          </div>

                          {/* Table picker — only when slot is selected & expanded */}
                          {isSelected && isExpanded && (
                            <div className="px-3 pb-3 pt-2 bg-orange-50/50 dark:bg-orange-950/10 border-t border-orange-100 dark:border-orange-900/20">
                              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
                                Seleccioná las mesas para este horario (opcional):
                              </p>
                              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
                                {visibleTables.map(t => {
                                  const isOccupied = occupied.has(t.id)
                                  const isChosen   = selectedTbls.includes(t.id)
                                  return (
                                    <button
                                      key={t.id}
                                      type="button"
                                      disabled={isOccupied}
                                      onClick={() => toggleTableForSlot(slot, t.id)}
                                      className={`flex flex-col items-center justify-center rounded-lg p-1.5 border text-[10px] font-mono transition ${
                                        isOccupied
                                          ? 'bg-gray-100 dark:bg-zinc-800/40 border-gray-200 dark:border-zinc-700/50 text-gray-300 dark:text-zinc-600 cursor-not-allowed'
                                          : isChosen
                                          ? 'bg-orange-500 border-orange-500 text-white'
                                          : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:border-orange-400 dark:hover:border-orange-600'
                                      }`}
                                    >
                                      <span className="leading-none">{t.label}</span>
                                      {t.capacity > 0 && (
                                        <span className="opacity-60 mt-0.5">{t.capacity}p</span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-zinc-700 transition disabled:opacity-50"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || (mode === 'reschedule' && selectedSlots.size === 0)}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'cancel'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {submitting
              ? 'Procesando…'
              : mode === 'cancel'
              ? 'Cancelar reserva'
              : 'Enviar propuesta'}
          </button>
        </div>

      </div>
    </div>
  )
}
