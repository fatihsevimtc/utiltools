import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const PRESETS = [
  { label: 'Every minute',        value: '* * * * *' },
  { label: 'Every 5 minutes',     value: '*/5 * * * *' },
  { label: 'Every hour',          value: '0 * * * *' },
  { label: 'Every day at noon',   value: '0 12 * * *' },
  { label: 'Every Monday 9am',    value: '0 9 * * 1' },
  { label: 'First of month',      value: '0 0 1 * *' },
  { label: 'Every Sunday midnight', value: '0 0 * * 0' },
]

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function describeField(value, unit, namesArr) {
  if (value === '*') return `every ${unit}`
  if (value.startsWith('*/')) return `every ${value.slice(2)} ${unit}s`
  const parts = value.split(',').map(p => {
    if (p.includes('-')) {
      const [a, b] = p.split('-')
      const na = namesArr ? namesArr[parseInt(a)] : a
      const nb = namesArr ? namesArr[parseInt(b)] : b
      return `${na} through ${nb}`
    }
    return namesArr ? (namesArr[parseInt(p)] ?? p) : p
  })
  return parts.join(', ')
}

function parseCron(expr) {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return { error: 'Cron expression must have exactly 5 fields.' }
  const [min, hour, dom, month, dow] = parts
  return {
    minute: describeField(min, 'minute'),
    hour:   describeField(hour, 'hour'),
    dom:    describeField(dom, 'day of the month'),
    month:  describeField(month, 'month', MONTHS),
    dow:    describeField(dow, 'day of the week', DAYS),
  }
}

function getNextRuns(expr, count = 5) {
  // Simple next-run calculation for common patterns
  try {
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) return []
    const now = new Date()
    const results = []
    const d = new Date(now)
    d.setSeconds(0, 0)
    d.setMinutes(d.getMinutes() + 1)

    for (let attempt = 0; attempt < 10000 && results.length < count; attempt++) {
      if (matchCron(parts, d)) results.push(new Date(d))
      d.setMinutes(d.getMinutes() + 1)
    }
    return results
  } catch {
    return []
  }
}

function matchField(field, val) {
  if (field === '*') return true
  if (field.startsWith('*/')) return val % parseInt(field.slice(2)) === 0
  return field.split(',').some(p => {
    if (p.includes('-')) {
      const [a, b] = p.split('-').map(Number)
      return val >= a && val <= b
    }
    return parseInt(p) === val
  })
}

function matchCron(parts, d) {
  const [min, hour, dom, month, dow] = parts
  return matchField(min,   d.getMinutes()) &&
         matchField(hour,  d.getHours()) &&
         matchField(dom,   d.getDate()) &&
         matchField(month, d.getMonth() + 1) &&
         matchField(dow,   d.getDay())
}

export default function CronParser() {
  const [input, setInput] = useState('*/5 * * * *')
  const result = input.trim() ? parseCron(input.trim()) : null
  const nextRuns = input.trim() && !result?.error ? getNextRuns(input.trim()) : []

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Cron Expression Parser</h1>
      <p className="tool-description">Parse cron expressions into human-readable descriptions and preview upcoming runs.</p>

      <label htmlFor="cron-input">Cron expression (5 fields)</label>
      <input
        id="cron-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="* * * * *"
        style={{ fontFamily: 'monospace' }}
      />

      <div className="chip-group" style={{ marginTop: '0.75rem' }}>
        {PRESETS.map(p => (
          <button key={p.value} className="chip" onClick={() => setInput(p.value)}>{p.label}</button>
        ))}
      </div>

      {result && (
        result.error
          ? <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>⚠ {result.error}</p>
          : (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="code-block" style={{ fontSize: '1rem', padding: '1rem' }}>
                Run at <strong>{result.minute}</strong>, <strong>{result.hour}</strong>,
                on <strong>{result.dom}</strong>, in <strong>{result.month}</strong>,
                on <strong>{result.dow}</strong>
              </div>

              {nextRuns.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <label>Next {nextRuns.length} scheduled runs</label>
                  <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
                    {nextRuns.map(d => d.toLocaleString()).join('\n')}
                  </div>
                </div>
              )}
            </div>
          )
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        Format: <code>minute  hour  day-of-month  month  day-of-week</code>
      </p>
      <RelatedTools category="developer" exclude="/tools/cron-parser" />
          <ToolSeo />
    </div>
  )
}
