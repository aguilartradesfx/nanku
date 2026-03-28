'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AdminNav from '../components/AdminNav'
import {
  type Reservation,
  type ReservationStatus,
  todayCR,
} from '@/lib/reservations'
import {
  LUNCH_SLOTS,
  DINNER_SLOTS,
  getSelectableTables,
  expandTableIds,
  TABLE_COMBINATIONS,
  type TableDef,
} from '@/lib/tables'

const SOURCE_OPTIONS = [
  { value: 'web_form', label: 'Formulario web' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone',    label: 'Teléfono' },
  { value: 'walk_in',  label: 'Walk-in' },
]

export default function NewReservationClient({
  userEmail,
  editId,
  existing,
}: {
  userEmail: string
  editId: string | null
  existing: Reservation | null
}) {
  const router = useRouter()
  const isEdit = !!editId

  // Form state
  const [name,      setName]      = useState(existing?.name      ?? '')
  const [phone,     setPhone]     = useState(existing?.phone     ?? '')
  const [email,     setEmail]     = useState(existing?.email     ?? '')
  const [source,    setSource]    = useState(existing?.source    ?? 'web_form')
  const [date,      setDate]      = useState(existing?.date      ?? todayCR())
  const [time,      setTime]      = useState(existing?.time      ?? '')
  const [partySize, setPartySize] = useState(existing?.party_size ?? '')
  const [zone,      setZone]      = useState<string>(existing?.zone ?? '')
  const [status,    setStatus]    = useState<ReservationStatus>(existing?.status ?? 'pending')
  const [notes,     setNotes]     = useState(existing?.notes     ?? '')

  // Table selection
  const [selectedTables, setSelectedTables] = useState<string[]>(existing?.table_ids ?? [])
  const [occupiedTables, setOccupiedTables] = useState<string[]>([])
  const [loadingTables,  setLoadingTables]  = useState(false)
  const [suggestion,     setSuggestion]     = useState<string | null>(null)

  // UI state
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  // Fetch occupied tables when date/time/zone change
  useEffect(() => {
    if (!date || !time) { setOccupiedTables([]); return }
    const controller = new AbortController()
    setLoadingTables(true)
    const params = new URLSearchParams({ date, time })
    if (editId) params.set('excludeId', editId)
    fetch(`/api/admin/tables?${params}`, { signal: controller.signal })
      .then(r => r.json())
      .then(j => setOccupiedTables(j.occupied ?? []))
      .catch(() => {})
      .finally(() => setLoadingTables(false))
    return () => controller.abort()
  }, [date, time, editId])

  // Auto-suggestion for large parties
  useEffect(() => {
    const pax = parseInt(partySize)
    if (!pax || pax < 8) { setSuggestion(null); return }
    const combo = TABLE_COMBINATIONS.find(c =>
      c.capacity >= pax && !c.ids.some(id => occupiedTables.includes(id))
    )
    setSuggestion(combo ? `💡 Para ${pax} personas: combinar ${combo.label}` : null)
  }, [partySize, occupiedTables])

  function toggleTable(id: string, linkedTo?: string) {
    setSelectedTables(prev => {
      const set = new Set(prev)
      if (set.has(id)) {
        set.delete(id)
        if (linkedTo) set.delete(linkedTo)
      } else {
        set.add(id)
        if (linkedTo) set.add(linkedTo)
      }
      return Array.from(set)
    })
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!name.trim())  errs.name     = 'El nombre es requerido.'
    if (!phone.trim()) errs.phone    = 'El teléfono es requerido.'
    if (!date)         errs.date     = 'La fecha es requerida.'
    if (!isEdit && date < todayCR()) errs.date = 'La fecha no puede ser en el pasado.'
    if (!time)         errs.time     = 'Selecciona un turno.'
    const pax = parseInt(partySize)
    if (!pax || pax < 1) errs.partySize = 'Indica el número de personas.'
    const conflict = selectedTables.filter(t => occupiedTables.includes(t))
    if (conflict.length) errs.tables = `Mesa(s) ocupada(s): ${conflict.join(', ')}`
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        id:         editId,
        name:       name.trim(),
        phone:      phone.trim(),
        email:      email.trim() || null,
        source,
        date,
        time,
        party_size: partySize,
        zone:       zone || null,
        status,
        notes:      notes.trim() || null,
        table_ids:  expandTableIds(selectedTables),
      }
      const res = await fetch('/api/admin/reservations', {
        method:  isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json()
        setErrors({ form: j.error ?? 'Error al guardar.' })
        return
      }
      router.push('/admin')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!editId || !confirm('¿Eliminar esta reserva permanentemente?')) return
    setSaving(true)
    await fetch(`/api/admin/reservations?id=${editId}`, { method: 'DELETE' })
    router.push('/admin')
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const tables = getSelectableTables(zone || null)

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
            <button onClick={handleSignOut} className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">Sign out</button>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-zinc-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminNav />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Editar Reserva' : 'Nueva Reserva'}</h1>
          <Link href="/admin" className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition">← Volver</Link>
        </div>

        {errors.form && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-600 text-sm">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Customer */}
          <section className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-4">Datos del Cliente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre *" error={errors.name}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nombre completo" className={inputCls(!!errors.name)} />
              </Field>
              <Field label="Teléfono *" error={errors.phone}>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+506 XXXX-XXXX" className={inputCls(!!errors.phone)} />
              </Field>
              <Field label="Email">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className={inputCls(false)} />
              </Field>
              <Field label="Origen">
                <select value={source} onChange={e => setSource(e.target.value)} className={inputCls(false)}>
                  {SOURCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* Reservation details */}
          <section className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-4">Detalles de la Reserva</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Fecha *" error={errors.date}>
                <input type="date" value={date} min={isEdit ? undefined : todayCR()}
                  onChange={e => setDate(e.target.value)} className={inputCls(!!errors.date)} />
              </Field>
              <Field label="Turno horario *" error={errors.time}>
                <select value={time} onChange={e => setTime(e.target.value)} className={inputCls(!!errors.time)}>
                  <option value="">— Seleccionar —</option>
                  <optgroup label="Almuerzo">
                    {LUNCH_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Cena">
                    {DINNER_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
              </Field>
              <Field label="Personas *" error={errors.partySize}>
                <input type="number" value={partySize} onChange={e => setPartySize(e.target.value)}
                  min={1} max={50} placeholder="Ej: 4" className={inputCls(!!errors.partySize)} />
              </Field>
              <Field label="Zona preferida">
                <select value={zone} onChange={e => { setZone(e.target.value); setSelectedTables([]) }} className={inputCls(false)}>
                  <option value="">Sin preferencia</option>
                  <option value="salon">Salón</option>
                  <option value="terraza">Terraza</option>
                </select>
              </Field>
              <Field label="Estado">
                <select value={status} onChange={e => setStatus(e.target.value as ReservationStatus)} className={inputCls(false)}>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="no_show">No se presentó</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Table selector */}
          <section className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">Mesa(s)</h2>
            <p className="text-gray-400 dark:text-zinc-500 text-xs mb-3">Selecciona fecha + hora para ver disponibilidad.</p>

            {suggestion && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">{suggestion}</div>
            )}

            {errors.tables && <p className="text-red-400 text-xs mb-2">{errors.tables}</p>}

            {(!date || !time) ? (
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Elige fecha y turno primero.</p>
            ) : loadingTables ? (
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Verificando disponibilidad…</p>
            ) : (
              <>
                <div className="text-xs text-gray-400 dark:text-zinc-500 mb-2">
                  <span className="text-emerald-500">● Disponible</span>
                  {' · '}
                  <span className="text-red-500">● Ocupada</span>
                  {' · '}
                  <span className="text-orange-400">● Seleccionada</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tables.map((t: TableDef) => {
                    const isOcc = occupiedTables.includes(t.id)
                    const isSel = selectedTables.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={isOcc && !isSel}
                        onClick={() => toggleTable(t.id, t.linkedTo)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition ${
                          isSel
                            ? 'border-orange-500/50 bg-orange-500/15 text-orange-400'
                            : isOcc
                            ? 'border-red-900/40 bg-red-950/30 text-red-600 cursor-not-allowed'
                            : 'border-emerald-800/40 bg-emerald-950/20 text-emerald-500 hover:border-emerald-600'
                        }`}
                      >
                        {t.label}
                        {t.capacity > 0 && <span className="ml-1 opacity-60">{t.capacity}p</span>}
                      </button>
                    )
                  })}
                </div>
                {selectedTables.length > 0 && (
                  <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
                    Seleccionadas: <span className="text-gray-600 dark:text-zinc-300 font-mono">{selectedTables.join(', ')}</span>
                  </p>
                )}
              </>
            )}
          </section>

          {/* Notes */}
          <section className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-3">Notas Internas</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Alergias, celebraciones, preferencias especiales…"
              className={`${inputCls(false)} resize-none`}
            />
          </section>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium transition">
              {saving ? 'Guardando…' : isEdit ? '💾 Actualizar Reserva' : '💾 Crear Reserva'}
            </button>
            <Link href="/admin" className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-sm transition">
              Cancelar
            </Link>
            {isEdit && (
              <button type="button" onClick={handleDelete} disabled={saving}
                className="ml-auto px-4 py-2.5 rounded-lg border border-red-900/40 text-red-500 hover:text-red-400 text-sm transition">
                🗑 Eliminar
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-400 dark:text-zinc-400 text-xs uppercase tracking-wide font-medium">{label}</label>
      {children}
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full bg-gray-100 dark:bg-zinc-800 border ${hasError ? 'border-red-700' : 'border-gray-300 dark:border-zinc-700'} rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500 placeholder-gray-400 dark:placeholder-zinc-600`
}
