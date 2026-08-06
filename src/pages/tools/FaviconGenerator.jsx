import { useState, useRef, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

const SIZES = [16, 32, 48, 64, 128, 256]
const BG_PRESETS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','transparent']

export default function FaviconGenerator() {
  const [emoji, setEmoji] = useState('⚡')
  const [bg, setBg] = useState('#6366f1')
  const [size, setSize] = useState(64)
  const [rounded, setRounded] = useState(true)
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    if (bg !== 'transparent') {
      if (rounded) {
        const r = size * 0.2
        ctx.beginPath()
        ctx.moveTo(r, 0)
        ctx.lineTo(size - r, 0)
        ctx.quadraticCurveTo(size, 0, size, r)
        ctx.lineTo(size, size - r)
        ctx.quadraticCurveTo(size, size, size - r, size)
        ctx.lineTo(r, size)
        ctx.quadraticCurveTo(0, size, 0, size - r)
        ctx.lineTo(0, r)
        ctx.quadraticCurveTo(0, 0, r, 0)
        ctx.closePath()
        ctx.fillStyle = bg
        ctx.fill()
      } else {
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, size, size)
      }
    }

    ctx.font = `${size * 0.6}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, size / 2, size / 2 + size * 0.05)
  }, [emoji, bg, size, rounded])

  function download(px) {
    const offscreen = document.createElement('canvas')
    offscreen.width = px
    offscreen.height = px
    const ctx = offscreen.getContext('2d')
    ctx.clearRect(0, 0, px, px)

    if (bg !== 'transparent') {
      if (rounded) {
        const r = px * 0.2
        ctx.beginPath()
        ctx.moveTo(r, 0); ctx.lineTo(px - r, 0); ctx.quadraticCurveTo(px, 0, px, r)
        ctx.lineTo(px, px - r); ctx.quadraticCurveTo(px, px, px - r, px)
        ctx.lineTo(r, px); ctx.quadraticCurveTo(0, px, 0, px - r)
        ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0)
        ctx.closePath()
        ctx.fillStyle = bg; ctx.fill()
      } else {
        ctx.fillStyle = bg; ctx.fillRect(0, 0, px, px)
      }
    }
    ctx.font = `${px * 0.6}px serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(emoji, px / 2, px / 2 + px * 0.05)

    offscreen.toBlob(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `favicon-${px}x${px}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Favicon Generator</h1>
      <p className="tool-description">Create emoji-based favicons and download them at multiple sizes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label htmlFor="fav-emoji">Emoji or character</label>
          <input id="fav-emoji" type="text" value={emoji} onChange={e => setEmoji(e.target.value.slice(-2))} style={{ fontSize: '1.5rem', textAlign: 'center' }} />
        </div>
        <div>
          <label>Preview size: {size}px</label>
          <input type="range" min={16} max={256} value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
      </div>

      <label>Background color</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {BG_PRESETS.map(c => (
          <div
            key={c}
            onClick={() => setBg(c)}
            title={c}
            style={{
              width: 32, height: 32, borderRadius: 6, cursor: 'pointer',
              background: c === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 10px 10px' : c,
              border: `3px solid ${bg === c ? 'var(--accent)' : 'var(--border)'}`,
            }}
          />
        ))}
        <input type="color" value={bg === 'transparent' ? '#ffffff' : bg} onChange={e => setBg(e.target.value)}
          style={{ width: 32, height: 32, padding: 2, borderRadius: 6, cursor: 'pointer', border: '1px solid var(--border)' }} />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)' }}>
        <input type="checkbox" checked={rounded} onChange={e => setRounded(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
        Rounded corners
      </label>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <label>Preview</label>
          <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated', border: '1px solid var(--border)', borderRadius: 6 }} />
        </div>

        <div>
          <label>Download sizes</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {SIZES.map(px => (
              <button key={px} className="btn btn-sm" onClick={() => download(px)}>
                ⬇ {px}×{px} PNG
              </button>
            ))}
          </div>
        </div>
      </div>
      <RelatedTools category="files" exclude="/tools/favicon-generator" />
    </div>
  )
}
