import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function AreaCalculator() {
  const [shape, setShape] = useState('rectangle')
  const [vals, setVals]   = useState({})

  function set(k, v) { setVals(prev => ({ ...prev, [k]: v })) }
  function num(k) { return parseFloat(vals[k]) || 0 }

  const shapes = [
    { id: 'rectangle', label: 'Rectangle',  fields: ['Width', 'Height'] },
    { id: 'circle',    label: 'Circle',     fields: ['Radius'] },
    { id: 'triangle',  label: 'Triangle',   fields: ['Base', 'Height'] },
    { id: 'trapezoid', label: 'Trapezoid',  fields: ['Base a', 'Base b', 'Height'] },
    { id: 'ellipse',   label: 'Ellipse',    fields: ['Semi-axis a', 'Semi-axis b'] },
    { id: 'sector',    label: 'Sector',     fields: ['Radius', 'Angle (°)'] },
  ]

  const area = (() => {
    switch (shape) {
      case 'rectangle': return num('Width') * num('Height')
      case 'circle':    return Math.PI * num('Radius') ** 2
      case 'triangle':  return 0.5 * num('Base') * num('Height')
      case 'trapezoid': return 0.5 * (num('Base a') + num('Base b')) * num('Height')
      case 'ellipse':   return Math.PI * num('Semi-axis a') * num('Semi-axis b')
      case 'sector':    return 0.5 * num('Radius') ** 2 * (num('Angle (°)') * Math.PI / 180)
      default:          return 0
    }
  })()

  const currentShape = shapes.find(s => s.id === shape)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Area Calculator</h1>
      <p className="tool-description">
        Calculate the area of common 2D shapes: rectangle, circle, triangle, trapezoid, ellipse, and sector.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        {shapes.map(s => (
          <button key={s.id} className={`chip ${shape === s.id ? 'active' : ''}`} onClick={() => { setShape(s.id); setVals({}) }}>{s.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', maxWidth: 480 }}>
        {currentShape.fields.map(f => (
          <div key={f}>
            <label htmlFor={`ac-${f}`}>{f}</label>
            <input id={`ac-${f}`} type="number" min="0" value={vals[f] || ''} onChange={e => set(f, e.target.value)} placeholder="0" />
          </div>
        ))}
      </div>

      {area > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1.25rem', maxWidth: 260, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{area.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>square units</div>
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/area-calculator" />
      <ToolSeo />
    </div>
  )
}
