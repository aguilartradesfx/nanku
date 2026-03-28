'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export type Artist = {
  id: string
  name: string
  label: string
  photo: string
  bio: string
  bio_es: string
  sort_order: number
  is_active: boolean
}

export type ScheduleDay = {
  id: string
  day_of_week: string
  is_active: boolean
  event_label: string
  start_time: string
  sort_order: number
  artist_id: string | null
  event_detail: string | null
}

export type WeeklyEvent = {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  cta_link: string | null
  cta_text: string | null
  is_active: boolean
  sort_order: number
}

const EMPTY_EVENT_FORM = {
  title: '',
  subtitle: '',
  image_url: '',
  cta_link: '',
  cta_text: '',
  is_active: true,
  sort_order: 0,
}

const EMPTY_ARTIST_FORM = {
  name: '',
  label: '',
  photo: '',
  bio: '',
  bio_es: '',
  sort_order: 0,
  is_active: true,
}

function Toggle({ active, onChange, disabled }: { active: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${active ? 'bg-orange-500' : 'bg-zinc-700'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

type ScheduleDraft = { artist_id: string | null; start_time: string; event_detail: string }

export default function LiveMusicManager({
  initialSchedule,
  initialEvents,
  initialArtists,
}: {
  initialSchedule: ScheduleDay[]
  initialEvents: WeeklyEvent[]
  initialArtists: Artist[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [tab, setTab] = useState<'schedule' | 'events' | 'artists'>('schedule')

  const [schedule, setSchedule] = useState<ScheduleDay[]>(initialSchedule)
  const [events, setEvents] = useState<WeeklyEvent[]>(initialEvents)
  const [artists, setArtists] = useState<Artist[]>(initialArtists)

  // ── Schedule state ───────────────────────────────────────
  const [savingDayId, setSavingDayId] = useState<string | null>(null)
  const [savingDayDetailId, setSavingDayDetailId] = useState<string | null>(null)
  // Inline draft edits per day (only tracked when row is expanded)
  const [drafts, setDrafts] = useState<Record<string, ScheduleDraft>>({})

  function getDraft(day: ScheduleDay): ScheduleDraft {
    return drafts[day.id] ?? {
      artist_id: day.artist_id,
      start_time: day.start_time,
      event_detail: day.event_detail ?? '',
    }
  }

  function isDirty(day: ScheduleDay): boolean {
    if (!drafts[day.id]) return false
    const d = drafts[day.id]
    return (
      d.artist_id !== day.artist_id ||
      d.start_time !== day.start_time ||
      d.event_detail !== (day.event_detail ?? '')
    )
  }

  async function toggleDay(day: ScheduleDay) {
    const newActive = !day.is_active
    setSavingDayId(day.id)
    setSchedule(prev => prev.map(d => d.id === day.id ? { ...d, is_active: newActive } : d))
    await fetch('/api/admin/live-music/schedule', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: day.id, is_active: newActive }),
    })
    setSavingDayId(null)
    startTransition(() => router.refresh())
  }

  async function saveDayDetail(day: ScheduleDay) {
    const d = getDraft(day)
    setSavingDayDetailId(day.id)
    const res = await fetch('/api/admin/live-music/schedule', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: day.id,
        artist_id: d.artist_id || null,
        start_time: d.start_time,
        event_detail: d.event_detail || null,
      }),
    })
    if (res.ok) {
      setSchedule(prev => prev.map(x =>
        x.id === day.id
          ? { ...x, artist_id: d.artist_id || null, start_time: d.start_time, event_detail: d.event_detail || null }
          : x
      ))
      setDrafts(prev => { const next = { ...prev }; delete next[day.id]; return next })
    }
    setSavingDayDetailId(null)
    startTransition(() => router.refresh())
  }

  // ── Events state ─────────────────────────────────────────
  const [savingEventId, setSavingEventId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<WeeklyEvent | null>(null)
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM)
  const [eventFormError, setEventFormError] = useState('')
  const [savingEventForm, setSavingEventForm] = useState(false)

  async function toggleEventActive(event: WeeklyEvent) {
    const newActive = !event.is_active
    setSavingEventId(event.id)
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_active: newActive } : e))
    await fetch('/api/admin/live-music/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: event.id, is_active: newActive }),
    })
    setSavingEventId(null)
    startTransition(() => router.refresh())
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    setDeletingId(id)
    await fetch('/api/admin/live-music/events', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setEvents(prev => prev.filter(e => e.id !== id))
    setDeletingId(null)
    startTransition(() => router.refresh())
  }

  function openAddEvent() {
    setEditingEvent(null)
    setEventForm({ ...EMPTY_EVENT_FORM, sort_order: events.length })
    setShowAddForm(true)
    setEventFormError('')
  }

  function openEditEvent(event: WeeklyEvent) {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      subtitle: event.subtitle ?? '',
      image_url: event.image_url ?? '',
      cta_link: event.cta_link ?? '',
      cta_text: event.cta_text ?? '',
      is_active: event.is_active,
      sort_order: event.sort_order,
    })
    setShowAddForm(false)
    setEventFormError('')
  }

  function cancelEventForm() {
    setShowAddForm(false)
    setEditingEvent(null)
    setEventForm(EMPTY_EVENT_FORM)
    setEventFormError('')
  }

  async function submitEventForm() {
    if (!eventForm.title.trim()) { setEventFormError('Title is required'); return }
    setSavingEventForm(true)
    setEventFormError('')
    try {
      if (editingEvent) {
        const res = await fetch('/api/admin/live-music/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEvent.id, ...eventForm }),
        })
        if (res.ok) {
          setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventForm } : e))
          setEditingEvent(null)
        }
      } else {
        const res = await fetch('/api/admin/live-music/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm),
        })
        if (res.ok) {
          const { event } = await res.json()
          setEvents(prev => [...prev, event])
          setShowAddForm(false)
          setEventForm(EMPTY_EVENT_FORM)
        }
      }
      startTransition(() => router.refresh())
    } finally {
      setSavingEventForm(false)
    }
  }

  // ── Artists state ─────────────────────────────────────────
  const [showAddArtistForm, setShowAddArtistForm] = useState(false)
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [artistForm, setArtistForm] = useState(EMPTY_ARTIST_FORM)
  const [artistFormError, setArtistFormError] = useState('')
  const [savingArtistForm, setSavingArtistForm] = useState(false)
  const [deletingArtistId, setDeletingArtistId] = useState<string | null>(null)

  function openAddArtist() {
    setEditingArtist(null)
    setArtistForm({ ...EMPTY_ARTIST_FORM, sort_order: artists.length })
    setShowAddArtistForm(true)
    setArtistFormError('')
  }

  function openEditArtist(artist: Artist) {
    setEditingArtist(artist)
    setArtistForm({
      name: artist.name,
      label: artist.label,
      photo: artist.photo,
      bio: artist.bio,
      bio_es: artist.bio_es,
      sort_order: artist.sort_order,
      is_active: artist.is_active,
    })
    setShowAddArtistForm(false)
    setArtistFormError('')
  }

  function cancelArtistForm() {
    setShowAddArtistForm(false)
    setEditingArtist(null)
    setArtistForm(EMPTY_ARTIST_FORM)
    setArtistFormError('')
  }

  async function submitArtistForm() {
    if (!artistForm.name.trim()) { setArtistFormError('Name is required'); return }
    if (!artistForm.photo.trim()) { setArtistFormError('Photo URL is required'); return }
    setSavingArtistForm(true)
    setArtistFormError('')
    try {
      if (editingArtist) {
        const res = await fetch('/api/admin/live-music/artists', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingArtist.id, ...artistForm }),
        })
        if (res.ok) {
          setArtists(prev => prev.map(a => a.id === editingArtist.id ? { ...a, ...artistForm } : a))
          setEditingArtist(null)
        }
      } else {
        const res = await fetch('/api/admin/live-music/artists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(artistForm),
        })
        if (res.ok) {
          const { artist } = await res.json()
          setArtists(prev => [...prev, artist])
          setShowAddArtistForm(false)
          setArtistForm(EMPTY_ARTIST_FORM)
        }
      }
      startTransition(() => router.refresh())
    } finally {
      setSavingArtistForm(false)
    }
  }

  async function deleteArtist(id: string) {
    if (!confirm('Delete this artist? They will be unlinked from the schedule.')) return
    setDeletingArtistId(id)
    await fetch('/api/admin/live-music/artists', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setArtists(prev => prev.filter(a => a.id !== id))
    // Unlink from any schedule days
    setSchedule(prev => prev.map(d => d.artist_id === id ? { ...d, artist_id: null } : d))
    setDeletingArtistId(null)
    startTransition(() => router.refresh())
  }

  // ── Forms ─────────────────────────────────────────────────
  const EventForm = (
    <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-xl p-5 space-y-4 mt-3">
      <h4 className="text-white font-semibold text-sm">{editingEvent ? 'Edit Event' : 'New Event'}</h4>
      {eventFormError && <p className="text-red-400 text-xs">{eventFormError}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">Title *</label>
          <input
            value={eventForm.title}
            onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Friday Jazz Night"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">Image URL</label>
          <input
            value={eventForm.image_url}
            onChange={e => setEventForm(p => ({ ...p, image_url: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-zinc-400 text-xs mb-1.5">Subtitle / Description</label>
          <textarea
            value={eventForm.subtitle}
            onChange={e => setEventForm(p => ({ ...p, subtitle: e.target.value }))}
            rows={2}
            placeholder="Enjoy live jazz, signature cocktails and a unique atmosphere..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition resize-none"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">CTA Button Text</label>
          <input
            value={eventForm.cta_text}
            onChange={e => setEventForm(p => ({ ...p, cta_text: e.target.value }))}
            placeholder="Reserve Now"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">CTA Link</label>
          <input
            value={eventForm.cta_link}
            onChange={e => setEventForm(p => ({ ...p, cta_link: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">Display Order</label>
          <input
            type="number"
            min={0}
            value={eventForm.sort_order}
            onChange={e => setEventForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <span className="text-zinc-400 text-xs">Active on website</span>
          <Toggle active={eventForm.is_active} onChange={() => setEventForm(p => ({ ...p, is_active: !p.is_active }))} />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={submitEventForm}
          disabled={savingEventForm}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition"
        >
          {savingEventForm ? 'Saving…' : editingEvent ? 'Update Event' : 'Create Event'}
        </button>
        <button onClick={cancelEventForm} className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition">
          Cancel
        </button>
      </div>
    </div>
  )

  const ArtistForm = (
    <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-xl p-5 space-y-4 mt-3">
      <h4 className="text-white font-semibold text-sm">{editingArtist ? 'Edit Artist' : 'New Artist'}</h4>
      {artistFormError && <p className="text-red-400 text-xs">{artistFormError}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">Name *</label>
          <input
            value={artistForm.name}
            onChange={e => setArtistForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Chris Charía"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">Label / Genre</label>
          <input
            value={artistForm.label}
            onChange={e => setArtistForm(p => ({ ...p, label: e.target.value }))}
            placeholder="Rock & Trova"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-zinc-400 text-xs mb-1.5">Photo URL *</label>
          <input
            value={artistForm.photo}
            onChange={e => setArtistForm(p => ({ ...p, photo: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-zinc-400 text-xs mb-1.5">Bio (English)</label>
          <textarea
            value={artistForm.bio}
            onChange={e => setArtistForm(p => ({ ...p, bio: e.target.value }))}
            rows={3}
            placeholder="Artist biography in English..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition resize-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-zinc-400 text-xs mb-1.5">Bio (Español)</label>
          <textarea
            value={artistForm.bio_es}
            onChange={e => setArtistForm(p => ({ ...p, bio_es: e.target.value }))}
            rows={3}
            placeholder="Biografía del artista en español..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition resize-none"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1.5">Display Order</label>
          <input
            type="number"
            min={0}
            value={artistForm.sort_order}
            onChange={e => setArtistForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition"
          />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <span className="text-zinc-400 text-xs">Active on website</span>
          <Toggle active={artistForm.is_active} onChange={() => setArtistForm(p => ({ ...p, is_active: !p.is_active }))} />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={submitArtistForm}
          disabled={savingArtistForm}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition"
        >
          {savingArtistForm ? 'Saving…' : editingArtist ? 'Update Artist' : 'Add Artist'}
        </button>
        <button onClick={cancelArtistForm} className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition">
          Cancel
        </button>
      </div>
    </div>
  )

  const activeArtists = artists.filter(a => a.is_active)

  return (
    <div className="space-y-6">
      {/* ── Tab nav ── */}
      <div className="flex gap-0 border-b border-zinc-800">
        {([
          { id: 'schedule' as const, label: 'Horario' },
          { id: 'events' as const, label: 'Eventos' },
          { id: 'artists' as const, label: 'Artistas' },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              tab === t.id
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Schedule Tab ── */}
      {tab === 'schedule' && (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/80 border-b border-zinc-800 px-5 py-3.5 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            <h3 className="text-white font-semibold text-sm">Live Music Schedule</h3>
            <span className="text-zinc-500 text-xs ml-1">· Activar días y asignar artistas</span>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {schedule.map(day => {
              const draft = getDraft(day)
              const dirty = isDirty(day)
              const assignedArtist = artists.find(a => a.id === day.artist_id)
              return (
                <div key={day.id} className={`px-5 py-3.5 transition ${day.is_active ? 'bg-orange-500/5' : 'bg-zinc-900/20'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 text-xs font-bold uppercase tracking-wide ${day.is_active ? 'text-orange-400' : 'text-zinc-600'}`}>
                        {day.day_of_week.slice(0, 3)}
                      </span>
                      <div>
                        <p className={`text-sm font-medium ${day.is_active ? 'text-white' : 'text-zinc-400'}`}>{day.day_of_week}</p>
                        <p className="text-zinc-500 text-xs">
                          {day.is_active && assignedArtist
                            ? `${assignedArtist.name} · ${day.start_time}`
                            : `${day.event_label} · ${day.start_time}`}
                        </p>
                      </div>
                      {day.is_active && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25">
                          LIVE
                        </span>
                      )}
                    </div>
                    <Toggle active={day.is_active} onChange={() => toggleDay(day)} disabled={savingDayId === day.id} />
                  </div>

                  {day.is_active && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-zinc-500 text-[10px] mb-1 uppercase tracking-wide">Artista</label>
                        <select
                          value={draft.artist_id ?? ''}
                          onChange={e => setDrafts(prev => ({
                            ...prev,
                            [day.id]: { ...draft, artist_id: e.target.value || null },
                          }))}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition"
                        >
                          <option value="">— Sin artista —</option>
                          {activeArtists.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] mb-1 uppercase tracking-wide">Hora de inicio</label>
                        <input
                          value={draft.start_time}
                          onChange={e => setDrafts(prev => ({
                            ...prev,
                            [day.id]: { ...draft, start_time: e.target.value },
                          }))}
                          placeholder="8:00 PM"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] mb-1 uppercase tracking-wide">Detalle</label>
                        <input
                          value={draft.event_detail}
                          onChange={e => setDrafts(prev => ({
                            ...prev,
                            [day.id]: { ...draft, event_detail: e.target.value },
                          }))}
                          placeholder="Ej: Rock clásico en vivo"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition"
                        />
                      </div>
                      {dirty && (
                        <div className="sm:col-span-3 flex justify-end">
                          <button
                            onClick={() => saveDayDetail(day)}
                            disabled={savingDayDetailId === day.id}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
                          >
                            {savingDayDetailId === day.id ? 'Guardando…' : 'Guardar'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Events Tab ── */}
      {tab === 'events' && (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/80 border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3 className="text-white font-semibold text-sm">Weekly Events</h3>
              <span className="text-zinc-500 text-xs ml-1">· Tarjetas promocionales en el sitio</span>
            </div>
            {!showAddForm && !editingEvent && (
              <button
                onClick={openAddEvent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/20 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Event
              </button>
            )}
          </div>
          <div className="p-4 space-y-3">
            {showAddForm && EventForm}
            {events.length === 0 && !showAddForm && (
              <div className="text-center py-10 text-zinc-600 text-sm">
                No events yet. Click &ldquo;Add Event&rdquo; to create the first one.
              </div>
            )}
            {events.map(event => (
              <div key={event.id}>
                <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition ${event.is_active ? 'border-zinc-700/60 bg-zinc-800/25' : 'border-zinc-800 bg-zinc-900/20 opacity-50'}`}>
                  {event.image_url && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{event.title}</p>
                    {event.subtitle && <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{event.subtitle}</p>}
                    {event.cta_text && <p className="text-orange-400/70 text-xs mt-0.5">CTA: {event.cta_text}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Toggle active={event.is_active} onChange={() => toggleEventActive(event)} disabled={savingEventId === event.id} />
                    <button onClick={() => openEditEvent(event)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition" title="Edit">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      disabled={deletingId === event.id}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-40"
                      title="Delete"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {editingEvent?.id === event.id && EventForm}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Artists Tab ── */}
      {tab === 'artists' && (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/80 border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <h3 className="text-white font-semibold text-sm">Artists</h3>
              <span className="text-zinc-500 text-xs ml-1">· Artistas que aparecen en la página</span>
            </div>
            {!showAddArtistForm && !editingArtist && (
              <button
                onClick={openAddArtist}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/20 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Artist
              </button>
            )}
          </div>
          <div className="p-4 space-y-3">
            {showAddArtistForm && ArtistForm}
            {artists.length === 0 && !showAddArtistForm && (
              <div className="text-center py-10 text-zinc-600 text-sm">
                No artists yet. Click &ldquo;Add Artist&rdquo; to create the first one.
              </div>
            )}
            {artists.map(artist => (
              <div key={artist.id}>
                <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition ${artist.is_active ? 'border-zinc-700/60 bg-zinc-800/25' : 'border-zinc-800 bg-zinc-900/20 opacity-50'}`}>
                  {artist.photo && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={artist.photo} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{artist.name}</p>
                    <p className="text-orange-400/70 text-xs mt-0.5">{artist.label}</p>
                    {artist.bio && <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{artist.bio}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Toggle
                      active={artist.is_active}
                      onChange={async () => {
                        const newActive = !artist.is_active
                        setArtists(prev => prev.map(a => a.id === artist.id ? { ...a, is_active: newActive } : a))
                        await fetch('/api/admin/live-music/artists', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: artist.id, is_active: newActive }),
                        })
                        startTransition(() => router.refresh())
                      }}
                    />
                    <button onClick={() => openEditArtist(artist)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition" title="Edit">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteArtist(artist.id)}
                      disabled={deletingArtistId === artist.id}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-40"
                      title="Delete"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {editingArtist?.id === artist.id && ArtistForm}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
