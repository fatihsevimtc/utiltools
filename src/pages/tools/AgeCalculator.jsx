import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function AgeCalculator() {
  const [dob, setDob]       = useState('')
  const [target, setTarget] = useState(new Date().toISOString().slice(0,10))

  function calc() {
    if (!dob) return null
    const from = new Date(dob), to = new Date(target)
    if (isNaN(from) || isNaN(to) || from > to) return null
    let years = to.getFullYear() - from.getFullYear()
    let months = to.getMonth() - from.getMonth()
    let days = to.getDate() - from.getDate()
    if (days < 0) { months--; days += new Date(to.getFullYear(), to.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    const totalDays = Math.floor((to - from) / (1000*60*60*24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    return { years, months, days, totalDays, totalWeeks, totalMonths }
  }

  const r = calc()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Age Calculator</h1>
      <p className="tool-description">Calculate exact age or time between two dates in years, months, days and more.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="age-dob">Date of birth</label>
          <input id="age-dob" type="date" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="age-to">As of date</label>
          <input id="age-to" type="date" value={target} onChange={e => setTarget(e.target.value)} />
        </div>
      </div>

      {r && (
        <>
          <div className="stat-card" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="stat-value" style={{ fontSize: '2.5rem' }}>{r.years} <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>yrs</span> {r.months} <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>mo</span> {r.days} <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>days</span></div>
            <div className="stat-label">Exact age</div>
          </div>
          <div className="stats-row">
            {[['Total days', r.totalDays.toLocaleString()],['Total weeks', r.totalWeeks.toLocaleString()],['Total months', r.totalMonths.toLocaleString()]].map(([l,v]) => (
              <div key={l} className="stat-card">
                <div className="stat-value">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
