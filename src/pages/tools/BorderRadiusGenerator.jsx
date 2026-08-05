import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function BorderRadiusGenerator() {
  const [linked, setLinked] = useState(true)
  const [tl, setTl] = useState(12)
  const [tr, setTr] = useState(12)
  const [br, setBr] = useState(12)
  const [bl, setBl] = useState(12)
  const [unit, setUnit] = useState('px')
  const [copied, setCopied] = useState(false)

  function setAll(val) { setTl(val); setTr(val); setBr(val); setBl(val) }
  function handleChange(setter) {
    return e => {
      const val = Number(e.target.value)
      if (linked) setAll(val)
      else setter(val)
    }
  }

  const radius = `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`
  const cssRule = tl === tr && tr === br && br === bl
    ? `border-radius: ${tl}${unit};`
    : `border-radius: ${radius};`

  function copy() {
    navigator.clipboard.writeText(cssRule).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const boxStyle = {
    width: 140, height: 100,
    background: 'var(--accent)',
    borderRadius: radius,
    transition: 'border-radius 0.2s',
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Border Radius Generator</h1>
      <p className="tool-description">Build CSS border-radius values with a live preview.</p>

      {/* Preview */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0', padding: '2rem' }}>
        <div style={boxStyle} />
      </div>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${unit === 'px' ? 'active' : ''}`} onClick={() => setUnit('px')}>px</button>
        <button className={`chip ${unit === '%' ? 'active' : ''}`} onClick={() => setUnit('%')}>%</button>
        <button className={`chip ${unit === 'rem' ? 'active' : ''}`} onClick={() => setUnit('rem')}>rem</button>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', marginBottom: '1rem' }}>
        <input type="checkbox" checked={linked} onChange={e => setLinked(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
        Link all corners
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          ['Top-left', tl, setTl],
          ['Top-right', tr, setTr],
          ['Bottom-right', br, setBr],
          ['Bottom-left', bl, setBl],
        ].map(([label, val, setter]) => (
          <div key={label}>
            <label style={{ fontSize: '0.82rem' }}>{label}: {val}{unit}</label>
            <input
              type="range"
              min={0} max={unit === '%' ? 50 : 100}
              value={val}
              onChange={handleChange(setter)}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', marginBottom: '0.4rem' }}>
        <label style={{ marginBottom: 0 }}>CSS code</label>
        <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div className="code-block">{cssRule}</div>
    </div>
  )
}
