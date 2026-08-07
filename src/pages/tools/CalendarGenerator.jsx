import { useState } from 'react'
import BackBar from '../../components/BackBar'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function firstDayOfMonth(year, month) { return new Date(year, month, 1).getDay() }

export default function CalendarGenerator() {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [notes, setNotes] = useState({})
  const [selected, setSelected] = useState(null)
  const [noteText, setNoteText] = useState('')

  function prev() { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function next() { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const totalDays = daysInMonth(year, month)
  const startDay  = firstDayOfMonth(year, month)
  const cells = Array(startDay).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1))
  while (cells.length % 7 !== 0) cells.push(null)

  function selectDay(day) {
    if (!day) return
    setSelected(day)
    setNoteText(notes[`${year}-${month}-${day}`] || '')
  }

  function saveNote() {
    const key = `${year}-${month}-${selected}`
    setNotes(n => ({ ...n, [key]: noteText }))
  }

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Calendar Generator</h1>
      <p className="tool-description">Browse any month, highlight today, and add notes to dates.</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button className="btn btn-sm" onClick={prev}>‹ Prev</button>
        <strong style={{ fontSize: '1.1rem', minWidth: 180, textAlign: 'center' }}>{MONTHS[month]} {year}</strong>
        <button className="btn btn-sm" onClick={next}>Next ›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '1rem' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', opacity: 0.6, padding: '4px 0' }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          const key = `${year}-${month}-${day}`
          const hasNote = day && notes[key]
          return (
            <button
              key={i}
              onClick={() => selectDay(day)}
              style={{
                padding: '8px 4px',
                borderRadius: 6,
                border: selected === day && day ? '2px solid var(--accent, #6366f1)' : '1px solid var(--border, #ddd)',
                background: isToday(day) ? 'var(--accent, #6366f1)' : day ? 'var(--surface, #fff)' : 'transparent',
                color: isToday(day) ? '#fff' : undefined,
                fontWeight: isToday(day) ? 700 : undefined,
                cursor: day ? 'pointer' : 'default',
                position: 'relative',
                fontSize: '0.9rem',
              }}
            >
              {day || ''}
              {hasNote && <span style={{ position: 'absolute', top: 2, right: 4, fontSize: '0.5rem', color: 'var(--accent, #6366f1)' }}>●</span>}
            </button>
          )
        })}
      </div>

      {selected && (
        <div style={{ background: 'var(--surface2, #f5f5f5)', borderRadius: 8, padding: '1rem', marginTop: '0.5rem' }}>
          <label style={{ fontWeight: 600 }}>{MONTHS[month]} {selected}, {year} — Note</label>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Add a note for this day…"
            style={{ minHeight: 80, marginTop: '0.5rem' }}
          />
          <button className="btn btn-sm" onClick={saveNote} style={{ marginTop: '0.5rem' }}>Save Note</button>
        </div>
      )}
    </div>
  )
}
