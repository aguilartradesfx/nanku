import type { Metadata } from 'next'
import ReservationConfirmed from '@/components/ReservationConfirmed'

export const metadata: Metadata = {
  title: 'Reservation Confirmed — Nanku',
  robots: { index: false },
}

const texts = {
  brand: 'NANKU',
  heading: (name: string | null) => name ? `Thank You, ${name}!` : 'Thank You!',
  body: "Your reservation request has been received.\nWe'll confirm within 2 hours via WhatsApp.",
  timerLabel: (n: number) => `Redirecting to home in ${n}s`,
  cta: 'Go Home Now',
}

export default function ReservationConfirmedPage() {
  return <ReservationConfirmed homeUrl="/" texts={texts} />
}
