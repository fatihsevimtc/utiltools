import { useState, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const DEFAULT_ZONES = [
  { tz: 'UTC', label: 'UTC' },
  { tz: 'America/New_York', label: 'New York (ET)' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { tz: 'Europe/London', label: 'London (GMT/BST)' },
  { tz: 'Europe/Paris', label: 'Paris (CET)' },
  { tz: 'Asia/Dubai', label: 'Dubai (GST)' },
  { tz: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { tz: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { tz: 'Australia/Sydney', label: 'Sydney (AEST)' },
]

const ALL_ZONES = Intl.supportedValuesOf
  ? Intl.supportedValuesOf('timeZone')
  : DEFAULT_ZONES.map(z => z.tz)

function formatTime(tz, use24) {
  try {
    return new Date().toLocaleTimeString('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24,
    })
  } catch { return '—' }
}

function formatDate(tz) {
  try {
    return new Date().toLocaleDateString('en-GB', {
      timeZone: tz,
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    })
  } catch { return '' }
}

export default function WorldClock() {
  const [zones, setZones] = useState(DEFAULT_ZONES)
  const [tick, setTick] = useState(0)
  const [use24, setUse24] = useState(true)
  const [search, setSearch] = useState('')
  const [addTz, setAddTz] = useState('')

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const filtered = ALL_ZONES.filter(tz =>
    tz.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20)

  function addZone() {
    const tz = addTz || (filtered[0] || '')
    if (!tz || zones.find(z => z.tz === tz)) return
    setZones(prev => [...prev, { tz, label: tz.replace(/_/g, ' ') }])
    setAddTz('')
    setSearch('')
  }

  function removeZone(tz) {
    setZones(prev => prev.filter(z => z.tz !== tz))
  }

  // Get local offset hours for a given timezone
  function getOffset(tz) {
    try {
      const now = new Date()
      const utcMs = now.getTime()
      const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }))
      const diff = (tzDate - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))) / 3600000
      const h = Math.floor(Math.abs(diff))
      const m = Math.round((Math.abs(diff) - h) * 60)
      return `UTC${diff >= 0 ? '+' : '−'}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
    } catch { return '' }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>World Clock</h1>
      <p className="tool-description">
        See the current time in multiple time zones at a glance. Add or remove cities to build your personal world clock.
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={use24} onChange={e => setUse24(e.target.checked)} />
          24-hour format
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '0.75rem' }}>
        {zones.map(z => (
          <div key={z.tz} style={{ padding: '0.9rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, position: 'relative' }}>
            <button
              onClick={() => removeZone(z.tz)}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.8rem', padding: '0.2rem 0.4rem' }}
              aria-label={`Remove ${z.label}`}
            >✕</button>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{getOffset(z.tz)}</div>
            <div style={{ fontWeight: 700, fontSize: '1.6rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              {formatTime(z.tz, use24)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{formatDate(z.tz)}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '0.4rem' }}>{z.label}</div>
          </div>
        ))}
      </div>

      {/* Add a timezone */}
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px' }}>
          <label htmlFor="wc-search">Add a time zone</label>
          <input
            id="wc-search"
            list="wc-tz-list"
            value={addTz || search}
            onChange={e => { setSearch(e.target.value); setAddTz(e.target.value) }}
            placeholder="Search e.g. Tokyo or America/Chicago"
          />
          <datalist id="wc-tz-list">
            {filtered.map(tz => <option key={tz} value={tz} />)}
          </datalist>
        </div>
        <button className="btn" onClick={addZone} style={{ marginBottom: 0 }}>+ Add</button>
      </div>

      <RelatedTools category="time" exclude="/tools/world-clock" />
      <ToolSeo />
    </div>
  )
}
