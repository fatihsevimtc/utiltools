import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

const ZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Pacific/Honolulu',
]

function formatInZone(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: true,
  }).format(date)
}

export default function TimeZoneConverter() {
  const [dateVal, setDateVal]   = useState('')
  const [timeVal, setTimeVal]   = useState('')
  const [sourceZone, setSourceZone] = useState('UTC')
  const [targets, setTargets]   = useState(['America/New_York', 'Europe/London', 'Asia/Tokyo'])
  const [now, setNow]           = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const inputStr = dateVal ? `${dateVal}T${timeVal || '00:00'}` : ''
  const dateToConvert = inputStr ? new Date(inputStr) : now
  const validDate = !isNaN(dateToConvert.getTime())

  function addTarget() {
    const remaining = ZONES.filter(z => !targets.includes(z))
    if (remaining.length) setTargets(t => [...t, remaining[0]])
  }
  function removeTarget(tz) { setTargets(t => t.filter(x => x !== tz)) }
  function updateTarget(i, tz) { setTargets(t => t.map((x, idx) => idx === i ? tz : x)) }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Time Zone Converter</h1>
      <p className="tool-description">Convert a date and time between multiple time zones at once.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label htmlFor="tz-date">Date (leave blank for now)</label>
          <input
            id="tz-date"
            type="date"
            value={dateVal}
            onChange={e => setDateVal(e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label htmlFor="tz-time">Time</label>
          <input
            id="tz-time"
            type="time"
            value={timeVal}
            onChange={e => setTimeVal(e.target.value)}
            disabled={!dateVal}
          />
        </div>
        <div style={{ flex: '2 1 180px' }}>
          <label htmlFor="tz-source">Source time zone</label>
          <select id="tz-source" value={sourceZone} onChange={e => setSourceZone(e.target.value)}>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      {!dateVal && (
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
          Showing current time — updates every second
        </p>
      )}

      {validDate && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Source row */}
          <div style={{ background: 'var(--accent)', color: '#fff', borderRadius: 8, padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>{sourceZone}</span>
            <code style={{ color: '#fff' }}>{formatInZone(dateToConvert, sourceZone)}</code>
          </div>

          {/* Target rows */}
          {targets.map((tz, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select value={tz} onChange={e => updateTarget(i, e.target.value)} style={{ flex: 1, minWidth: 160 }}>
                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <code style={{ flex: 2, minWidth: 180, fontSize: '0.85rem' }}>{formatInZone(dateToConvert, tz)}</code>
              <button className="btn btn-sm" onClick={() => removeTarget(tz)} style={{ flexShrink: 0, padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
          ))}

          <button className="btn btn-sm" onClick={addTarget} style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>+ Add time zone</button>
        </div>
      )}
    </div>
  )
}