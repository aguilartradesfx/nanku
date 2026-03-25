'use client'

import { useState } from 'react'

const countryCodes = [
  { value: '+506', label: '🇨🇷 +506' },
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+1-CA', label: '🇨🇦 +1' },
  { value: '+52', label: '🇲🇽 +52' },
  { value: '+55', label: '🇧🇷 +55' },
  { value: '+57', label: '🇨🇴 +57' },
  { value: '+54', label: '🇦🇷 +54' },
  { value: '+56', label: '🇨🇱 +56' },
  { value: '+507', label: '🇵🇦 +507' },
  { value: '+503', label: '🇸🇻 +503' },
  { value: '+502', label: '🇬🇹 +502' },
  { value: '+504', label: '🇭🇳 +504' },
  { value: '+505', label: '🇳🇮 +505' },
  { value: '+593', label: '🇪🇨 +593' },
  { value: '+591', label: '🇧🇴 +591' },
  { value: '+595', label: '🇵🇾 +595' },
  { value: '+598', label: '🇺🇾 +598' },
  { value: '+58', label: '🇻🇪 +58' },
  { value: '+34', label: '🇪🇸 +34' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+49', label: '🇩🇪 +49' },
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+39', label: '🇮🇹 +39' },
  { value: '+31', label: '🇳🇱 +31' },
  { value: '+61', label: '🇦🇺 +61' },
  { value: '+64', label: '🇳🇿 +64' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+82', label: '🇰🇷 +82' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+972', label: '🇮🇱 +972' },
]

const timeOptions = [
  '12:00 PM', '1:00 PM', '2:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM',
  '8:00 PM', '9:00 PM', '10:00 PM',
]

const partySizes = ['1-2', '3-4', '5-6', '7-8', '9+']

interface FormState {
  name: string
  email: string
  phoneCode: string
  phone: string
  date: string
  time: string
  partySize: string
  partyCustom: string
  notes: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  date?: string
  time?: string
  party?: string
}

export default function ReservationForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phoneCode: '+506',
    phone: '',
    date: '',
    time: '',
    partySize: '',
    partyCustom: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email is required'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    if (!form.date) errs.date = 'Date is required'
    if (!form.time) errs.time = 'Time is required'
    if (!form.partySize) errs.party = 'Party size is required'
    if (form.partySize === '9+' && (!form.partyCustom || Number(form.partyCustom) < 9))
      errs.party = 'Please enter a valid number (9–99)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone_code: form.phoneCode,
          phone: form.phone,
          date: form.date,
          time: form.time,
          party_size: form.partySize === '9+' ? form.partyCustom : form.partySize,
          notes: form.notes,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setSuccess(false)
    setForm({
      name: '', email: '', phoneCode: '+506', phone: '',
      date: '', time: '', partySize: '', partyCustom: '', notes: '',
    })
    setErrors({})
  }

  return (
    <div id="resFormWrap">
      {success ? (
        <div id="resSuccess" className="res-success">
          <svg
            className="res-success-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3>Thank You!</h3>
          <p>We&apos;ll confirm your reservation shortly.</p>
          <small>Check WhatsApp for confirmation details.</small>
          <button id="resReset" className="res-reset" onClick={reset}>
            Make Another Reservation
          </button>
        </div>
      ) : (
        <form id="reservationForm" className="res-form" onSubmit={handleSubmit} noValidate>
          <div className="res-grid">
            {/* Full Name */}
            <div className="res-col-2">
              <label className="res-label" htmlFor="resName">Full Name *</label>
              <input
                id="resName"
                className="res-input"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && <p className="res-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="res-label" htmlFor="resEmail">Email *</label>
              <input
                id="resEmail"
                className="res-input"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && <p className="res-error">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="res-label" htmlFor="resPhone">Phone *</label>
              <div className="res-phone-wrap">
                <select
                  id="resPhoneCode"
                  className="res-phone-code"
                  aria-label="Country code"
                  value={form.phoneCode}
                  onChange={(e) => setForm({ ...form, phoneCode: e.target.value })}
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.value} value={cc.value}>
                      {cc.label}
                    </option>
                  ))}
                </select>
                <input
                  id="resPhone"
                  className="res-input res-phone-input"
                  type="tel"
                  placeholder="8888-8888"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              {errors.phone && <p className="res-error">{errors.phone}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="res-label" htmlFor="resDate">Date *</label>
              <input
                id="resDate"
                className="res-input"
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              {errors.date && <p className="res-error">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="res-label" htmlFor="resTime">Time *</label>
              <select
                id="resTime"
                className="res-select"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              >
                <option value="">Select time</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.time && <p className="res-error">{errors.time}</p>}
            </div>

            {/* Party Size */}
            <div className="res-col-2">
              <label className="res-label">Party Size *</label>
              <div className="res-party-btns">
                {partySizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`res-party-btn${form.partySize === size ? ' selected' : ''}`}
                    onClick={() => setForm({ ...form, partySize: size, partyCustom: '' })}
                  >
                    {size} guests
                  </button>
                ))}
              </div>
              {form.partySize === '9+' && (
                <div style={{ marginTop: '10px' }}>
                  <input
                    id="resPartyCustom"
                    className="res-input"
                    type="number"
                    min={9}
                    max={99}
                    step={1}
                    placeholder="Enter exact number (9–99)"
                    inputMode="numeric"
                    value={form.partyCustom}
                    onChange={(e) => setForm({ ...form, partyCustom: e.target.value })}
                  />
                </div>
              )}
              {errors.party && <p className="res-error">{errors.party}</p>}
            </div>

            {/* Submit */}
            <div className="res-col-2">
              <button type="submit" className="res-submit" disabled={submitting}>
                {submitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="res-alt fade-up">
        <a
          href="https://wa.me/50624790707?text=Hi!%20I'd%20like%20to%20make%20a%20reservation%20at%20Nanku%20Tropical%20Bar%20%26%20Steakhouse."
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Reserve via WhatsApp
        </a>
        <a href="tel:+50624790707">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.97-1.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call Us Directly
        </a>
      </div>
    </div>
  )
}
