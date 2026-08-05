import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

function isWeekend(date) {
  const d = date.getDay()
  return d === 0 || d === 6
}

function countWorkingDays(start, end, holidays) {
  const holidaySet = new Set(holidays)
  let count = 0
  const d = new Date(start)
  d.setHours(0, 0, 0, 0)
  const e = new Date(end)
  e.setHours(0, 0, 0, 0)

  while (d <= e) {
    const key = d.toISOString().slice(0, 10)
    if (!isWeekend(d) && !holidaySet.has(key)) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

function addWorkingDays(start, days, holidays) {
  const holidaySet = new Set(holidays)
  const d = new Date(start)
  d.setHours(0, 0, 0, 0)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    const key = d.toISOString().slice(0, 10)
    if (!isWeekend(d) && !holidaySet.has(key)) added++
  }
  return d
}

export default function WorkingDays() {
  const [mode, setMode] = useState('count')
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10))
  const [end, setEnd] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 10) })
  const [daysToAdd, setDaysToAdd] = useState('10')
  const [holidaysText, setHolidaysText] = useState('')

  const holidays = useMemo(() => {
    return holidaysText.split('\n').map(l => l.trim()).filter(l => /^\d{4}-\d{2}-\d{2}$/.test(l))
  }, [holidaysText])

  const workingDays = useMemo(() => {
    if (!start || !end) return null
    return countWorkingDays(new Date(start), new Date(end), holidays)
  }, [start, end, holidays])

  const resultDate = useMemo(() => {
    const n = parseInt(daysToAdd)
    if (!start || isNaN(n) || n <= 0) return null
    return addWorkingDays(new Date(start), n, holidays)
  }, [start, daysToAdd, holidays])

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Working Days Calculator</h1>
      <p className="tool-description">Count working days between two dates, or add working days to a start date.</p>

      <div className="chip-group">
        <button className={`chip ${mode === 'count' ? 'active' : ''}`} onClick={() => setMode('count')}>Count working days</button>
        <button className={`chip ${mode === 'add' ? 'active' : ''}`} onClick={() => setMode('add')}>Add working days</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label htmlFor="wd-start">Start date</label>
          <input id="wd-start" type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        {mode === 'count' ? (
          <div style={{ flex: 1, minWidth: 160 }}>
            <label htmlFor="wd-end">End date</label>
            <input id="wd-end" type="date" value={end} onChange={e => setEnd(e.target.value)} min={start} />
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 160 }}>
            <label htmlFor="wd-add">Working days to add</label>
            <input id="wd-add" type="number" min={1} value={daysToAdd} onChange={e => setDaysToAdd(e.target.value)} />
          </div>
        )}
      </div>

      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}>Add holidays to exclude (one YYYY-MM-DD per line)</summary>
        <textarea
          value={holidaysText}
          onChange={e => setHolidaysText(e.target.value)}
          placeholder={'2026-12-25\n2026-01-01'}
          style={{ minHeight: 100, fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.5rem' }}
        />
        {holidays.length > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.25rem' }}>{holidays.length} holiday(s) loaded</p>}
      </details>

      {mode === 'count' && workingDays !== null && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>{workingDays}</div>
          <div style={{ color: 'var(--muted)', marginTop: '0.3rem' }}>working day{workingDays !== 1 ? 's' : ''} between {start} and {end}</div>
        </div>
      )}

      {mode === 'add' && resultDate && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{resultDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style={{ color: 'var(--muted)', marginTop: '0.3rem' }}>{daysToAdd} working day{daysToAdd !== '1' ? 's' : ''} after {start}</div>
        </div>
      )}
    </div>
  )
}
