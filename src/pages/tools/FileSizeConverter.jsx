import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

const UNITS = [
  { id: 'b',   label: 'Bytes (B)',       factor: 1 },
  { id: 'kb',  label: 'Kilobytes (KB)',  factor: 1024 },
  { id: 'mb',  label: 'Megabytes (MB)',  factor: 1024**2 },
  { id: 'gb',  label: 'Gigabytes (GB)',  factor: 1024**3 },
  { id: 'tb',  label: 'Terabytes (TB)',  factor: 1024**4 },
  { id: 'kbit',label: 'Kilobits (Kbit)', factor: 125 },
  { id: 'mbit',label: 'Megabits (Mbit)', factor: 125000 },
  { id: 'gbit',label: 'Gigabits (Gbit)', factor: 125000000 },
]

export default function FileSizeConverter() {
  const [value, setValue] = useState('')
  const [unit, setUnit]   = useState('mb')

  const bytes = value !== '' ? Number(value) * (UNITS.find(u=>u.id===unit)?.factor ?? 1) : null

  function fmt(n) {
    if (n === null) return '—'
    if (n < 1) return n.toExponential(3)
    if (n >= 1e12) return (n/1e12).toPrecision(6)
    return Number(n.toPrecision(8)).toLocaleString()
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>File Size Converter</h1>
      <p className="tool-description">Convert between bytes, KB, MB, GB, TB, and bits.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '2 1 180px' }}>
          <label htmlFor="fs-value">Value</label>
          <input id="fs-value" type="number" min={0} value={value} onChange={e => setValue(e.target.value)} placeholder="0" />
        </div>
        <div style={{ flex: '2 1 180px' }}>
          <label>Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)}>
            {UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
      </div>

      {bytes !== null && (
        <div className="stats-row">
          {UNITS.map(u => (
            <div key={u.id} className="stat-card" style={{ flex: '1 1 140px' }}>
              <div className="stat-value" style={{ fontSize: '1rem', wordBreak: 'break-all' }}>
                {fmt(bytes / u.factor)}
              </div>
              <div className="stat-label">{u.label}</div>
            </div>
          ))}
        </div>
      )}
      <RelatedTools category="files" exclude="/tools/file-size" />
    </div>
  )
}
