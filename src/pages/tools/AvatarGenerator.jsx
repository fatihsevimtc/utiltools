import { useState, useRef, useEffect } from 'react'
import BackBar from '../../components/BackBar'

const STYLES = ['initials', 'geometric', 'pixel']
const BG_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16']
const SIZES = [32, 64, 128, 256]

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i)
  return Math.abs(hash)
}

function drawInitials(ctx, size, name, bg) {
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()
  const initials = name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${size * 0.38}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, size / 2, size / 2)
}

function drawGeometric(ctx, size, seed) {
  const cols = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6']
  const bg = cols[seed % cols.length]
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)
  const shapes = (seed % 4) + 3
  for (let i = 0; i < shapes; i++) {
    ctx.fillStyle = cols[(seed + i + 1) % cols.length] + 'cc'
    const x = ((seed * (i + 3)) % size)
    const y = ((seed * (i + 7)) % size)
    const r = size * 0.15 + (seed % 20)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawPixel(ctx, size, seed) {
  const grid = 8
  const cell = size / grid
  const cols = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899']
  ctx.fillStyle = '#1e1e2e'
  ctx.fillRect(0, 0, size, size)
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < Math.ceil(grid / 2); col++) {
      if (((seed >> (row * 4 + col)) & 1) || ((seed * row) % (col + 2) === 0)) {
        ctx.fillStyle = cols[(seed + row + col) % cols.length]
        ctx.fillRect(col * cell, row * cell, cell, cell)
        ctx.fillRect((grid - 1 - col) * cell, row * cell, cell, cell)
      }
    }
  }
}

export default function AvatarGenerator() {
  const [name, setName] = useState('John Doe')
  const [style, setStyle] = useState('initials')
  const [bg, setBg] = useState(BG_COLORS[0])
  const [size, setSize] = useState(128)
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)
    const seed = hashCode(name || 'user')
    if (style === 'initials') drawInitials(ctx, size, name || '?', bg)
    else if (style === 'geometric') drawGeometric(ctx, size, seed)
    else if (style === 'pixel') drawPixel(ctx, size, seed)
  }, [name, style, bg, size])

  function download() {
    const canvas = canvasRef.current
    canvas.toBlob(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `avatar-${size}x${size}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Avatar Generator</h1>
      <p className="tool-description">Generate placeholder avatars from initials, geometric patterns, or pixel art.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="av-name">Name or seed text</label>
          <input id="av-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
        </div>
        <div>
          <label>Size: {size}px</label>
          <div className="chip-group" style={{ margin: 0, flexWrap: 'wrap' }}>
            {SIZES.map(s => <button key={s} className={`chip ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>)}
          </div>
        </div>
      </div>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        {STYLES.map(s => <button key={s} className={`chip ${style === s ? 'active' : ''}`} onClick={() => setStyle(s)}>{s}</button>)}
      </div>

      {style === 'initials' && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Background color</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {BG_COLORS.map(c => (
              <div key={c} onClick={() => setBg(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: `3px solid ${bg === c ? 'var(--text)' : 'transparent'}` }} />
            ))}
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 28, height: 28, padding: 1, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <canvas ref={canvasRef} style={{ borderRadius: style === 'initials' ? '50%' : 10, border: '2px solid var(--border)', imageRendering: 'pixelated' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="btn btn-sm" onClick={download}>⬇ Download PNG</button>
        </div>
      </div>
    </div>
  )
}
