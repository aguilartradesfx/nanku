import type { Metadata } from 'next'
import ReservationConfirmed from '@/components/ReservationConfirmed'

export const metadata: Metadata = {
  title: 'Reserva Confirmada — Nanku',
  robots: { index: false },
}

const texts = {
  brand: 'NANKU',
  heading: (name: string | null) => name ? `¡Gracias, ${name}!` : '¡Gracias!',
  body: 'Tu solicitud de reserva fue recibida.\nTe confirmaremos en menos de 2 horas por WhatsApp.',
  timerLabel: (n: number) => `Redirigiendo al inicio en ${n}s`,
  cta: 'Ir al inicio',
}

export default function ReservationConfirmedPageES() {
  return <ReservationConfirmed homeUrl="/es" texts={texts} />
}
