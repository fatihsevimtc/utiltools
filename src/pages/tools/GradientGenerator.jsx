import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

const TYPES = ['linear', 'radial', 'conic']
const PRESETS = [
  { colors: ['#6366f1', '#a855f7'], angle: 135, type: 'linear' },
  { colors: ['#10b981', '#3b82f6'], angle: 90,  type: 'linear' },
  { colors: ['#f59e0b', '#ef4444'], angle: 45,  type: 'linear' },
  { colors: ['#ec4899', '#f97316'], angle: 180, type: 'linear' },
  { colors: ['#6366f1', '#06b6d4', '#10b981'], angle: 120, type: 'linear' },
]

export default function GradientGenerator() {
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState(135)
  const [colors, setColors] = useState(['#6366f1', '#a855f7'])
  const [copied, setCopied] = useState(false)

  function addColor() { setColors(c => [...c, '#ffffff']) }
  function removeColor(i) { if (colors.length > 2) setColors(c => c.filter((_, idx) => idx !== i)) }
  function updateColor(i, val) { setColors(c => c.map((x, idx) => idx === i ? val : x)) }

  function buildCss() {
    const stops = colors.join(', ')
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stops})`
    if (type === 'radial') return `radial-gradient(circle, ${stops})`
    return `conic-gradient(from ${angle}deg, ${stops})`
  }

  const css = buildCss()
  const cssRule = `background: ${css};`

  function copy() {
    navigator.clipboard.writeText(cssRule).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function applyPreset(p) {
    setType(p.type)
    setAngle(p.angle)
    setColors([...p.colors])
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Gradient Generator</h1>
      <p className="tool-description">Build CSS gradients visually and copy the code.</p>

      {/* Preview */}
      <div style={{ height: 160, borderRadius: 12, background: css, marginBottom: '1.25rem', border: '1px solid var(--border)', transition: 'background 0.3s' }} />

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        {TYPES.map(t => (
          <button key={t} className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>

      {(type === 'linear' || type === 'conic') && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Angle: {angle}°</label>
          <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
      )}

      <label>Colors</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {colors.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="color" value={c} onChange={e => updateColor(i, e.target.value)}
              style={{ width: 48, height: 36, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
            <code style={{ flex: 1, fontSize: '0.9rem' }}>{c}</code>
            <button className="btn btn-sm" onClick={() => removeColor(i)} disabled={colors.length <= 2} style={{ padding: '0.2rem 0.5rem' }}>✕</button>
          </div>
        ))}
        <button className="btn btn-sm" onClick={addColor} style={{ alignSelf: 'flex-start' }}>+ Add color</button>
      </div>

      <label>Presets</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {PRESETS.map((p, i) => (
          <div
            key={i}
            onClick={() => applyPreset(p)}
            style={{ width: 48, height: 36, borderRadius: 8, cursor: 'pointer', border: '2px solid var(--border)',
              background: `linear-gradient(${p.angle}deg, ${p.colors.join(', ')})` }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label style={{ marginBottom: 0 }}>CSS code</label>
        <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div className="code-block">{cssRule}</div>
      <RelatedTools category="design" exclude="/tools/gradient-generator" />
    </div>
  )
}
