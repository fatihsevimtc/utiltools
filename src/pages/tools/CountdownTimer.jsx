import { useState, useEffect, useRef } from 'react'
import BackBar from '../../components/BackBar'

function pad(n) { return String(n).padStart(2, '0') }

// Build a datetime-local string from separate date + time strings
function combine(date, time) {
  if (!date) return ''
  return `${date}T${time || '00:00'}`
}

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('')
  const [dateVal, setDateVal]       = useState('')
  const [timeVal, setTimeVal]       = useState('00:00')
  const [label, setLabel]           = useState('New Year 2027')
  const [timeLeft, setTimeLeft]     = useState(null)
  const [finished, setFinished]     = useState(false)
  const rafRef = useRef()

  // Keep combined targetDate in sync
  useEffect(() => {
    setTargetDate(combine(dateVal, timeVal))
  }, [dateVal, timeVal])

  useEffect(() => {
    if (!targetDate) { setTimeLeft(null); setFinished(false); return }

    function tick() {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setFinished(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setFinished(false)
      const seconds = Math.floor(diff / 1000) % 60
      const minutes = Math.floor(diff / 60000) % 60
      const hours   = Math.floor(diff / 3600000) % 24
      const days    = Math.floor(diff / 86400000)
      setTimeLeft({ days, hours, minutes, seconds })
      rafRef.current = setTimeout(tick, 500)
    }

    tick()
    return () => clearTimeout(rafRef.current)
  }, [targetDate])

  function applyPreset(dt) {
    const [d, t] = dt.split('T')
    setDateVal(d)
    setTimeVal(t || '00:00')
  }

  const presets = [
    { label: 'New Year 2027',    date: '2027-01-01T00:00' },
    { label: 'Christmas 2026',   date: '2026-12-25T00:00' },
    { label: 'In 1 hour',        date: (() => { const d = new Date(); d.setHours(d.getHours() + 1); return d.toISOString().slice(0, 16) })() },
    { label: 'In 24 hours',      date: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 16) })() },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Countdown Timer</h1>
      <p className="tool-description">Count down to any date and time, right in your browser.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="cd-date">Target date</label>
          <input
            id="cd-date"
            type="date"
            value={dateVal}
            onChange={e => setDateVal(e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label htmlFor="cd-time">Time</label>
          <input
            id="cd-time"
            type="time"
            value={timeVal}
            onChange={e => setTimeVal(e.target.value)}
          />
        </div>
        <div style={{ flex: '2 1 180px' }}>
          <label htmlFor="cd-label">Label (optional)</label>
          <input id="cd-label" type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Event name" />
        </div>
      </div>

      <div className="chip-group" style={{ marginBottom: '1.5rem' }}>
        {presets.map(p => (
          <button key={p.label} className="chip" onClick={() => { applyPreset(p.date); setLabel(p.label) }}>{p.label}</button>
        ))}
      </div>

      {timeLeft && (
        <div style={{ textAlign: 'center' }}>
          {label && <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>{label}</p>}
          {finished ? (
            <div style={{ fontSize: '2rem', color: 'var(--success)', fontWeight: 700 }}>🎉 Time's up!</div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[['days', timeLeft.days], ['hours', timeLeft.hours], ['minutes', timeLeft.minutes], ['seconds', timeLeft.seconds]].map(([unit, val]) => (
                <div key={unit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.5rem', minWidth: 80, textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>{pad(val)}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{unit}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}