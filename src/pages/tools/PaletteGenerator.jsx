import { useState } from 'react'
import BackBar from '../../components/BackBar'

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      default: h = ((r - g) / d + 4) / 6
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

function generatePalette(hex, type) {
  const [h, s, l] = hexToHsl(hex)
  switch (type) {
    case 'shades':
      return [10, 20, 30, 40, 50, 60, 70, 80, 90].map(lightness => ({
        hex: hslToHex(h, s, lightness), label: `${lightness}%`
      }))
    case 'complementary':
      return [hex, hslToHex((h + 180) % 360, s, l)].map((c, i) => ({ hex: c, label: i === 0 ? 'Base' : 'Complement' }))
    case 'triadic':
      return [0, 120, 240].map((offset, i) => ({ hex: hslToHex((h + offset) % 360, s, l), label: ['Base', 'Triad 2', 'Triad 3'][i] }))
    case 'analogous':
      return [-30, -15, 0, 15, 30].map((offset, i) => ({ hex: hslToHex((h + offset + 360) % 360, s, l), label: `${offset > 0 ? '+' : ''}${offset}°` }))
    case 'split':
      return [0, 150, 210].map((offset, i) => ({ hex: hslToHex((h + offset) % 360, s, l), label: ['Base', 'Split 1', 'Split 2'][i] }))
    default: return []
  }
}

export default function PaletteGenerator() {
  const [base, setBase] = useState('#6366f1')
  const [type, setType] = useState('shades')
  const [copied, setCopied] = useState('')

  const palette = generatePalette(base, type)

  function copy(hex) {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Palette Generator</h1>
      <p className="tool-description">Generate color palettes from a base color — shades, complementary, triadic, and more.</p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div>
          <label>Base color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="color" value={base} onChange={e => setBase(e.target.value)}
              style={{ width: 48, height: 40, padding: 2, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }} />
            <input type="text" value={base} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBase(e.target.value) }}
              style={{ width: 90, fontFamily: 'monospace' }} />
          </div>
        </div>
      </div>

      <div className="chip-group" style={{ marginBottom: '1.25rem' }}>
        {['shades', 'complementary', 'analogous', 'triadic', 'split'].map(t => (
          <button key={t} className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {palette.map(({ hex, label }) => (
          <div key={hex} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => copy(hex)}>
            <div style={{
              width: 64, height: 64, borderRadius: 10,
              background: hex, border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: '#fff', fontWeight: 700,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}>
              {copied === hex ? '✓' : ''}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{hex}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
