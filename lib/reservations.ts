// ─────────────────────────────────────────────────────────────────────────────
// BEFORE FIRST USE: Run this SQL in the Supabase SQL Editor
//
// ALTER TABLE reservations
//   ADD COLUMN IF NOT EXISTS zone         text,
//   ADD COLUMN IF NOT EXISTS table_ids    text[],
//   ADD COLUMN IF NOT EXISTS source       text DEFAULT 'web_form',
//   ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
// ─────────────────────────────────────────────────────────────────────────────

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'no_show'

export type Reservation = {
  id: string
  name: string
  email: string | null
  phone: string
  date: string          // YYYY-MM-DD
  time: string          // HH:MM
  party_size: string
  status: ReservationStatus
  notes: string | null
  created_at: string
  updated_at: string | null
  zone: string | null           // 'salon' | 'terraza' | null
  table_ids: string[] | null
  source: string | null         // 'web_form' | 'whatsapp' | 'phone' | 'walk_in'
  confirmed_at: string | null
}

export type ReservationInput = {
  name: string
  email?: string | null
  phone: string
  date: string
  time: string
  party_size: string
  status?: ReservationStatus
  notes?: string | null
  zone?: string | null
  table_ids?: string[] | null
  source?: string | null
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  no_show:   'No se presentó',
}

export const STATUS_STYLES: Record<ReservationStatus, string> = {
  pending:   'bg-amber-100 text-amber-700 border-amber-300',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  cancelled: 'bg-red-100 text-red-600 border-red-300',
  no_show:   'bg-gray-100 text-gray-500 border-gray-300',
}

/** Returns today's date in Costa Rica timezone as YYYY-MM-DD */
export function todayCR(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' })
}

export function formatDateCR(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`
}

export function formatTimeCR(timeStr: string): string {
  if (!timeStr) return ''
  const [h, min] = timeStr.split(':')
  const hour = parseInt(h, 10)
  return `${hour % 12 || 12}:${min} ${hour >= 12 ? 'PM' : 'AM'}`
}

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return dt.toLocaleDateString('en-CA')
}
