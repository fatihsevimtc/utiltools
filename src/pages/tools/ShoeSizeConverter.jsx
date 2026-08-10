import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ShoeSizeConverter() {
  const [size, setSize]     = useState('')
  const [fromSys, setFrom]  = useState('us-m')

  // Reference table: [US-Men, US-Women, UK, EU, CM, JP]
  const TABLE = [
    [5,    6,    4,    37,   23.5, 235],
    [5.5,  6.5,  4.5,  37.5, 24,   240],
    [6,    7,    5,    38,   24,   240],
    [6.5,  7.5,  5.5,  38.5, 24.5, 245],
    [7,    8,    6,    39,   25,   250],
    [7.5,  8.5,  6.5,  39.5, 25,   250],
    [8,    9,    7,    40,   26,   260],
    [8.5,  9.5,  7.5,  41,   26.5, 265],
    [9,    10,   8,    41.5, 27,   270],
    [9.5,  10.5, 8.5,  42,   27,   270],
    [10,   11,   9,    43,   28,   280],
    [10.5, 11.5, 9.5,  43.5, 28,   280],
    [11,   12,   10,   44,   29,   290],
    [11.5, 12.5, 10.5, 44.5, 29,   290],
    [12,   13,   11,   45,   30,   300],
    [13,   14,   12,   46,   31,   310],
    [14,   15,   13,   47,   32,   320],
  ]

  const SYSTEMS = [
    { id: 'us-m',  label: 'US (Men)',   col: 0 },
    { id: 'us-w',  label: 'US (Women)', col: 1 },
    { id: 'uk',    label: 'UK',         col: 2 },
    { id: 'eu',    label: 'EU',         col: 3 },
    { id: 'cm',    label: 'CM',         col: 4 },
    { id: 'jp',    label: 'JP',         col: 5 },
  ]

  const fromCol = SYSTEMS.find(s => s.id === fromSys)?.col ?? 0
  const numSize = parseFloat(size)
  const row = isNaN(numSize) ? null : TABLE.find(r => r[fromCol] === numSize)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Shoe Size Converter</h1>
      <p className="tool-description">
        Convert shoe sizes between US Men's, US Women's, UK, EU, CM, and JP systems instantly.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div>
          <label htmlFor="ss-size">Size</label>
          <input id="ss-size" type="number" value={size} onChange={e => setSize(e.target.value)} placeholder="9" style={{ width: 100 }} />
        </div>
        <div>
          <label htmlFor="ss-from">From system</label>
          <select id="ss-from" value={fromSys} onChange={e => setFrom(e.target.value)}>
            {SYSTEMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {size && (
        row ? (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {SYSTEMS.map(s => (
              <div key={s.id} style={{ flex: '1 1 90px', background: s.id === fromSys ? 'var(--accent-soft, #ede9fe)' : 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.8rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{row[s.col]}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Size not found in the conversion table. Try a nearby standard size.</p>
        )
      )}

      <RelatedTools category="misc" exclude="/tools/shoe-size" />
      <ToolSeo />
    </div>
  )
}
