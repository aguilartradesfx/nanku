'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsent')
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" style={{ transform: visible ? 'translateY(0)' : 'translateY(200%)' }}>
      <div className="cookie-content">
        <p>
          We use cookies to enhance your experience on our website. By continuing to browse,
          you agree to our use of cookies.{' '}
          <a href="/privacy-policy" style={{ color: '#E8751A' }}>
            Learn more
          </a>
        </p>
        <div className="cookie-actions">
          <button className="cookie-accept" onClick={accept}>
            Accept
          </button>
          <button className="cookie-decline" onClick={() => setVisible(false)}>
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
