import type { Metadata } from 'next'
import ReservationConfirmed from '@/components/ReservationConfirmed'

export const metadata: Metadata = {
  title: 'Reserva Confirmada — Nanku',
  robots: { index: false },
}

export default function ReservationConfirmedPageES() {
  return <ReservationConfirmed lang="es" homeUrl="/es" />
}
