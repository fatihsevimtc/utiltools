import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState([
    { x: 0, y: 4, blur: 16, spread: 0, color: '#00000033', inset: false },
  ])
  const [copied, setCopied] = useState(false)

  function update(i, field, val) {
    setShadows(s => s.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }
  function addShadow() {
    setShadows(s => [...s, { x: 0, y: 4, blur: 16, spread: 0, color: '#00000033', inset: false }])
  }
  function removeShadow(i) {
    setShadows(s => s.filter((_, idx) => idx !== i))
  }

  const cssValue = shadows.map(s =>
    `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
  ).join(', ')
  const cssRule = `box-shadow: ${cssValue};`

  function copy() {
    navigator.clipboard.writeText(cssRule).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Box Shadow Generator</h1>
      <p className="tool-description">Build and preview CSS box-shadow values visually.</p>

      {/* Preview */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0', padding: '2.5rem' }}>
        <div style={{
          width: 140, height: 100, borderRadius: 12,
          background: 'var(--surface)', border: '1px solid var(--border)',
          boxShadow: cssValue, transition: 'box-shadow 0.3s',
        }} />
      </div>

      {shadows.map((s, i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.9rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Shadow {i + 1}</span>
            {shadows.length > 1 && <button className="btn btn-sm" onClick={() => removeShadow(i)} style={{ padding: '0.15rem 0.45rem' }}>✕</button>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))', gap: '0.5rem' }}>
            {[['x', 'X offset'], ['y', 'Y offset'], ['blur', 'Blur'], ['spread', 'Spread']].map(([field, label]) => (
              <div key={field}>
                <label style={{ fontSize: '0.78rem' }}>{label}: {s[field]}px</label>
                <input type="range" min={-50} max={100} value={s[field]} onChange={e => update(i, field, Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Color</label>
              <input type="color" value={s.color.slice(0, 7)} onChange={e => update(i, 'color', e.target.value + s.color.slice(7))}
                style={{ display: 'block', width: 40, height: 32, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Opacity</label>
              <input type="range" min={0} max={255} value={parseInt(s.color.slice(7) || 'ff', 16)}
                onChange={e => update(i, 'color', s.color.slice(0, 7) + parseInt(e.target.value).toString(16).padStart(2, '0'))}
                style={{ width: 80, accentColor: 'var(--accent)' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text)', marginBottom: 0 }}>
              <input type="checkbox" checked={s.inset} onChange={e => update(i, 'inset', e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
              Inset
            </label>
          </div>
        </div>
      ))}

      <button className="btn btn-sm" onClick={addShadow} style={{ marginBottom: '1.25rem' }}>+ Add shadow</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label style={{ marginBottom: 0 }}>CSS code</label>
        <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div className="code-block" style={{ wordBreak: 'break-all' }}>{cssRule}</div>
    </div>
  )
}
