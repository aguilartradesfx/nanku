'use client'

import { useState } from 'react'
import { formatDateCR, formatTimeCR } from '@/lib/reservations'

type ProposedTime = { time: string; table_ids: string[] }

interface Proposal {
  proposed_times: ProposedTime[]
  proposed_date:  string
  original_date:  string
  original_time:  string
}

interface ReservationData {
  name:       string
  party_size: string
}

interface Props {
  token:       string
  proposal:    Proposal
  reservation: ReservationData
}

export default function ReschedulePageClient({ token, proposal, reservation }: Props) {
  const [selected,   setSelected]   = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [done,       setDone]       = useState(false)
  const [result,     setResult]     = useState<{ time: string; date: string } | null>(null)
  const [error,      setError]      = useState<string | null>(null)
  const [noOption,   setNoOption]   = useState(false)

  async function handleConfirm() {
    if (!selected) return
    setConfirming(true)
    setError(null)
    try {
      const res  = await fetch(`/api/reschedule/${token}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chosen_time: selected }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ time: data.time, date: data.date })
        setDone(true)
      } else if (data.error === 'expired' || data.error === 'expired_or_used') {
        setError('Esta propuesta ya expiró o fue utilizada. Contactanos por WhatsApp.')
      } else {
        setError(data.error || 'Ocurrió un error. Intentá de nuevo.')
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setConfirming(false)
    }
  }

  // ── Success screen ────────────────────────────────────────
  if (done && result) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-white font-serif text-3xl font-bold tracking-wide mb-8">Nanku</h1>
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">¡Reserva confirmada!</h2>
            <p className="text-zinc-300 text-lg font-medium">
              {formatDateCR(result.date)}
            </p>
            <p className="text-[#E8751A] text-2xl font-bold mt-1 mb-4">
              {formatTimeCR(result.time)}
            </p>
            <p className="text-zinc-400">¡Te esperamos en Nanku!</p>
          </div>
        </div>
      </div>
    )
  }

  const proposedTimes = proposal.proposed_times as ProposedTime[]

  // ── Main selection screen ────────────────────────────────
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="max-w-sm w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white font-serif text-3xl font-bold tracking-wide">Nanku</h1>
          <p className="text-zinc-500 text-sm mt-1">Restaurant & Lounge</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-zinc-800">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Hola <span className="text-white font-semibold">{reservation.name}</span>, tenemos estas opciones para tu reserva:
            </p>
            <div className="mt-2 text-xs text-zinc-600 font-mono">
              {formatDateCR(proposal.proposed_date)} · {reservation.party_size} pax
            </div>
          </div>

          {/* Time options */}
          <div className="p-4 space-y-3">
            {proposedTimes.map(opt => (
              <button
                key={opt.time}
                type="button"
                onClick={() => { setSelected(opt.time); setNoOption(false); setError(null) }}
                className={`w-full p-4 rounded-xl border-2 text-left transition ${
                  selected === opt.time
                    ? 'border-[#E8751A] bg-[#E8751A]/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-xl">
                      {formatTimeCR(opt.time)}
                    </div>
                    {opt.table_ids.length > 0 && (
                      <div className="text-zinc-500 text-xs mt-0.5 font-mono">
                        Mesa: {opt.table_ids.join(', ')}
                      </div>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      selected === opt.time
                        ? 'border-[#E8751A] bg-[#E8751A]'
                        : 'border-zinc-600'
                    }`}
                  >
                    {selected === opt.time && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Confirmation row */}
          {selected && !noOption && (
            <div className="px-4 pb-4">
              <p className="text-zinc-500 text-xs text-center mb-3">
                Confirmás tu reserva para las{' '}
                <span className="text-white font-medium">{formatTimeCR(selected)}</span>
              </p>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full py-3.5 px-4 bg-[#E8751A] hover:bg-[#C4610F] active:bg-[#C4610F] text-white font-semibold rounded-xl transition disabled:opacity-50 text-base"
              >
                {confirming ? 'Confirmando…' : 'Confirmar reserva'}
              </button>
            </div>
          )}

          {error && (
            <div className="px-4 pb-4">
              <p className="text-red-400 text-sm text-center bg-red-950/20 border border-red-900/30 rounded-lg p-3">
                {error}
              </p>
            </div>
          )}

          {/* No option link */}
          <div className="px-4 pb-6 text-center border-t border-zinc-800 pt-4">
            {!noOption ? (
              <button
                type="button"
                onClick={() => { setNoOption(true); setSelected(null) }}
                className="text-zinc-600 hover:text-zinc-400 text-xs underline transition"
              >
                Ninguna opción me sirve
              </button>
            ) : (
              <div>
                <p className="text-zinc-400 text-sm mb-4">
                  Sin problema, contactanos y encontramos una solución.
                </p>
                <a
                  href="https://wa.me/50624790707"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-xl font-medium transition text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.997 0C5.372 0 0 5.372 0 11.997c0 2.122.558 4.112 1.528 5.836L0 24l6.335-1.507A11.93 11.93 0 0011.997 24C18.623 24 24 18.628 24 11.997 24 5.372 18.623 0 11.997 0zm0 21.818a9.807 9.807 0 01-5.038-1.384l-.36-.214-3.762.894.929-3.663-.235-.374a9.794 9.794 0 01-1.534-5.28c0-5.426 4.414-9.839 9.839-9.839 5.426 0 9.839 4.413 9.839 9.839 0 5.425-4.413 9.821-9.678 9.821z"/>
                  </svg>
                  WhatsApp +506 2479-0707
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
