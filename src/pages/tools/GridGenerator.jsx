import { useState } from 'react'
import BackBar from '../../components/BackBar'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#06b6d4','#84cc16','#a855f7']

export default function GridGenerator() {
  const [cols, setCols]         = useState(3)
  const [rows, setRows]         = useState(3)
  const [colUnit, setColUnit]   = useState('1fr')
  const [rowUnit, setRowUnit]   = useState('100px')
  const [gap, setGap]           = useState(8)
  const [items, setItems]       = useState(9)
  const [copied, setCopied]     = useState(false)

  const colTemplate = Array(cols).fill(colUnit).join(' ')
  const rowTemplate = Array(rows).fill(rowUnit).join(' ')

  const css = [
    `display: grid;`,
    `grid-template-columns: ${colTemplate};`,
    `grid-template-rows: ${rowTemplate};`,
    `gap: ${gap}px;`,
  ].join('\n')

  function copy() {
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: colTemplate,
    gridTemplateRows: rowTemplate,
    gap,
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: 10,
    padding: 12,
    minHeight: 160,
  }

  const COL_UNITS = ['1fr','auto','minmax(100px,1fr)','200px','25%']
  const ROW_UNITS = ['100px','auto','1fr','minmax(60px,auto)','80px']

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Grid Generator</h1>
      <p className="tool-description">Build CSS Grid layouts visually and copy the generated CSS.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Columns: {cols}</label>
          <input type="range" min={1} max={6} value={cols} onChange={e => setCols(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Rows: {rows}</label>
          <input type="range" min={1} max={6} value={rows} onChange={e => setRows(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Column unit</label>
          <select value={colUnit} onChange={e => setColUnit(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
            {COL_UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Row unit</label>
          <select value={rowUnit} onChange={e => setRowUnit(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
            {ROW_UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Gap: {gap}px</label>
          <input type="range" min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Items: {items}</label>
          <input type="range" min={1} max={cols * rows} value={items} onChange={e => setItems(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
      </div>

      <div style={containerStyle}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} style={{
            background: COLORS[i % COLORS.length],
            color: '#fff', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.9rem', minHeight: 40,
          }}>
            {i + 1}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>CSS output</label>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
        <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{css}</div>
      </div>
    </div>
  )
}
