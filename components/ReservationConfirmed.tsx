'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SECONDS = 8
const RADIUS = 36
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Props {
  homeUrl: string
  texts: {
    brand: string
    heading: (name: string | null) => string
    body: string
    timerLabel: (n: number) => string
    cta: string
  }
}

function ConfirmationContent({ homeUrl, texts }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawName = searchParams.get('name')
  const firstName = rawName ? rawName.split(' ')[0] : null
  const [countdown, setCountdown] = useState(SECONDS)

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
        <div className="res-confirm-brand">{texts.brand}</div>

        <div className="res-confirm-check">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="check-draw" d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="res-confirm-heading">{texts.heading(firstName)}</h1>
        <p className="res-confirm-body">{texts.body}</p>

        <div className="res-confirm-timer-wrap">
          <svg width="92" height="92" viewBox="0 0 92 92">
            <circle
              cx="46" cy="46" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
            />
            <circle
              cx="46" cy="46" r={RADIUS}
              fill="none"
              stroke="#E8751A"
              strokeWidth="4"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 46 46)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <text
              x="46" y="46"
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="22"
              fontFamily="Montserrat, sans-serif"
              fontWeight="600"
            >
              {countdown}
            </text>
          </svg>
          <span className="res-confirm-timer-label">{texts.timerLabel(countdown)}</span>
        </div>

        <a href={homeUrl} className="btn-orange res-confirm-cta">{texts.cta}</a>
      </div>
    </div>
  )
}

export default function ReservationConfirmed(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="res-confirm-page">
          <div className="res-confirm-card">
            <div className="res-confirm-brand">{props.texts.brand}</div>
          </div>
        </div>
      }
    >
      <ConfirmationContent {...props} />
    </Suspense>
  )
}
