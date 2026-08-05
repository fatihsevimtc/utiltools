import { useState } from 'react'
import BackBar from '../../components/BackBar'

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return { week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), year: d.getUTCFullYear() }
}

function getWeekStartEnd(isoYear, isoWeek) {
  // Jan 4 is always in week 1
  const jan4 = new Date(Date.UTC(isoYear, 0, 4))
  const weekStart = new Date(jan4)
  weekStart.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1 + (isoWeek - 1) * 7)
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)
  return { weekStart, weekEnd }
}

function weeksInYear(year) {
  const dec28 = new Date(year, 11, 28)
  return getISOWeek(dec28).week
}

export default function WeekNumber() {
  const today = new Date()
  const [date, setDate] = useState(today.toISOString().slice(0, 10))
  const [lookupYear, setLookupYear] = useState(today.getFullYear())
  const [lookupWeek, setLookupWeek] = useState(getISOWeek(today).week)

  const d = new Date(date + 'T00:00:00')
  const { week, year } = getISOWeek(d)
  const { weekStart, weekEnd } = getWeekStartEnd(year, week)
  const totalWeeks = weeksInYear(year)

  const lookupResult = getWeekStartEnd(lookupYear, lookupWeek)

  const fmt = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Week Number</h1>
      <p className="tool-description">Find the ISO week number for any date, or look up what dates a week number covers.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Date → Week number */}
        <div>
          <label htmlFor="wn-date">Date → Week number</label>
          <input id="wn-date" type="date" value={date} onChange={e => setDate(e.target.value)} />

          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>W{String(week).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>ISO week {year}</div>
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Week runs:</div>
              <div style={{ fontWeight: 600 }}>{fmt(weekStart)}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>to</div>
              <div style={{ fontWeight: 600 }}>{fmt(weekEnd)}</div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{year} has {totalWeeks} ISO weeks</p>
        </div>

        {/* Week number → dates */}
        <div>
          <label>Week number → dates</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 100 }}>
              <label htmlFor="wn-year" style={{ fontSize: '0.82rem' }}>Year</label>
              <input id="wn-year" type="number" value={lookupYear} onChange={e => setLookupYear(Number(e.target.value))} />
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <label htmlFor="wn-week" style={{ fontSize: '0.82rem' }}>Week (1–53)</label>
              <input id="wn-week" type="number" min={1} max={53} value={lookupWeek} onChange={e => setLookupWeek(Number(e.target.value))} />
            </div>
          </div>
          <div className="code-block" style={{ marginTop: '0.75rem', fontFamily: 'inherit' }}>
            <strong>W{String(lookupWeek).padStart(2, '0')} {lookupYear}:</strong>
            <span style={{ marginLeft: '0.5rem' }}>{fmt(lookupResult.weekStart)} – {fmt(lookupResult.weekEnd)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
