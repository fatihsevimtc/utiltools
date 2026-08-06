import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

export default function DateDifference() {
  const today = new Date().toISOString().slice(0,10)
  const [from, setFrom] = useState(today)
  const [to, setTo]     = useState(today)

  function calc() {
    const d1 = new Date(from), d2 = new Date(to)
    if (isNaN(d1) || isNaN(d2)) return null
    const diff = Math.abs(d2 - d1)
    const days  = Math.floor(diff / (1000*60*60*24))
    const weeks = Math.floor(days / 7)
    const months = Math.abs((d2.getFullYear()-d1.getFullYear())*12 + d2.getMonth()-d1.getMonth())
    const years = Math.abs(d2.getFullYear()-d1.getFullYear())
    return { days, weeks, months, years }
  }

  const r = calc()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Date Difference</h1>
      <p className="tool-description">Find the number of days, weeks, months, and years between two dates.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="dd-from">From</label>
          <input id="dd-from" type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="dd-to">To</label>
          <input id="dd-to" type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      {r && (
        <div className="stats-row">
          {[['Days', r.days],['Weeks', r.weeks],['Months', r.months],['Years', r.years]].map(([l,v]) => (
            <div key={l} className="stat-card">
              <div className="stat-value">{v.toLocaleString()}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      )}
      <RelatedTools category="time" exclude="/tools/date-difference" />
    </div>
  )
}
