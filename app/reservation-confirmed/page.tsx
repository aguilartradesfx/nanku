import type { Metadata } from 'next'
import ReservationConfirmed from '@/components/ReservationConfirmed'

export const metadata: Metadata = {
  title: 'Reservation Confirmed — Nanku',
  robots: { index: false },
}

export default function ReservationConfirmedPage() {
  return <ReservationConfirmed lang="en" homeUrl="/" />
}
