'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SECONDS = 12
const RADIUS = 36
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// All text is defined inside the client component — no functions passed as props
const COPY = {
  en: {
    brand: 'NANKU',
    heading: (name: string | null) => name ? `Thank You, ${name}!` : 'Thank You!',
    body: "Your reservation request has been received.\nWe'll confirm within 2 hours via WhatsApp.",
    timerLabel: (n: number) => `Redirecting to home in ${n}s`,
    cta: 'Go Home Now',
  },
  es: {
    brand: 'NANKU',
    heading: (name: string | null) => name ? `¡Gracias, ${name}!` : '¡Gracias!',
    body: 'Tu solicitud de reserva fue recibida.\nTe confirmaremos en menos de 2 horas por WhatsApp.',
    timerLabel: (n: number) => `Redirigiendo al inicio en ${n}s`,
    cta: 'Ir al inicio',
  },
} as const

interface Props {
  lang: 'en' | 'es'
  homeUrl: string
}

function ConfirmationContent({ lang, homeUrl }: Props) {
  const t = COPY[lang]
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawName = searchParams.get('name')
  const firstName = rawName ? rawName.split(' ')[0] : null
  const [countdown, setCountdown] = useState(SECONDS)

  // Fire GTM conversion event as soon as the page mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).dataLayer = (window as any).dataLayer || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).dataLayer.push({ event: 'reservation_confirmed' })
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.replace(homeUrl)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [router, homeUrl])

  const dashOffset = CIRCUMFERENCE * (countdown / SECONDS)

  return (
    <div className="res-confirm-page">
      <div className="res-confirm-card">
        <div className="res-confirm-brand">{t.brand}</div>

        <div className="res-confirm-check">
          <svg
            width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path className="check-draw" d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="res-confirm-heading">{t.heading(firstName)}</h1>
        <p className="res-confirm-body">{t.body}</p>

        <div className="res-confirm-timer-wrap">
          <svg width="92" height="92" viewBox="0 0 92 92">
            <circle cx="46" cy="46" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle
              cx="46" cy="46" r={RADIUS}
              fill="none" stroke="#E8751A" strokeWidth="4"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 46 46)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <text
              x="46" y="46" textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize="22" fontFamily="Montserrat, sans-serif" fontWeight="600"
            >
              {countdown}
            </text>
          </svg>
          <span className="res-confirm-timer-label">{t.timerLabel(countdown)}</span>
        </div>

        <a href={homeUrl} className="btn-orange res-confirm-cta">{t.cta}</a>
      </div>
    </div>
  )
}

export default function ReservationConfirmed(props: Props) {
  const t = COPY[props.lang]
  return (
    <Suspense
      fallback={
        <div className="res-confirm-page">
          <div className="res-confirm-card">
            <div className="res-confirm-brand">{t.brand}</div>
          </div>
        </div>
      }
    >
      <ConfirmationContent {...props} />
    </Suspense>
  )
}
