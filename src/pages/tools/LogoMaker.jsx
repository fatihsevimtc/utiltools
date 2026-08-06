import { useState, useRef, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'

const SHAPES = ['circle', 'rounded-square', 'square', 'hexagon', 'diamond', 'none']
const FONTS  = ['Inter, sans-serif', 'Georgia, serif', 'Courier New, monospace', 'Impact, sans-serif', '"Trebuchet MS", sans-serif', 'Verdana, sans-serif']
const FONT_LABELS = ['Sans-serif', 'Serif', 'Monospace', 'Impact', 'Trebuchet', 'Verdana']

const SIZES = [128, 256, 512, 1024]

const PRESETS = [
  { bg: '#6366f1', fg: '#ffffff', shape: 'circle',         text: 'UX', font: 0, fontSize: 42, iconSize: 60, bold: true,  italic: false },
  { bg: '#10b981', fg: '#ffffff', shape: 'rounded-square', text: 'GO', font: 0, fontSize: 40, iconSize: 60, bold: true,  italic: false },
  { bg: '#f59e0b', fg: '#1f2937', shape: 'hexagon',        text: 'AX', font: 3, fontSize: 38, iconSize: 60, bold: true,  italic: false },
  { bg: '#ef4444', fg: '#ffffff', shape: 'circle',         text: '❤️', font: 0, fontSize: 48, iconSize: 60, bold: false, italic: false },
  { bg: '#1f2937', fg: '#6366f1', shape: 'square',         text: '</>', font: 2, fontSize: 30, iconSize: 60, bold: true,  italic: false },
  { bg: '#8b5cf6', fg: '#ffffff', shape: 'diamond',        text: '★',  font: 0, fontSize: 48, iconSize: 60, bold: false, italic: false },
]

const GRADIENT_PRESETS = [
  { from: '#6366f1', to: '#a855f7' },
  { from: '#10b981', to: '#3b82f6' },
  { from: '#f59e0b', to: '#ef4444' },
  { from: '#ec4899', to: '#f97316' },
  { from: '#1f2937', to: '#4b5563' },
]

function drawHexagon(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function drawShape(ctx, shape, size) {
  const pad = size * 0.06
  const s = size - pad * 2
  const cx = size / 2, cy = size / 2

  if (shape === 'none') return

  if (shape === 'circle') {
    ctx.beginPath()
    ctx.arc(cx, cy, s / 2, 0, Math.PI * 2)
  } else if (shape === 'square') {
    ctx.beginPath()
    ctx.rect(pad, pad, s, s)
  } else if (shape === 'rounded-square') {
    const r = s * 0.2
    ctx.beginPath()
    ctx.moveTo(pad + r, pad)
    ctx.lineTo(pad + s - r, pad)
    ctx.quadraticCurveTo(pad + s, pad, pad + s, pad + r)
    ctx.lineTo(pad + s, pad + s - r)
    ctx.quadraticCurveTo(pad + s, pad + s, pad + s - r, pad + s)
    ctx.lineTo(pad + r, pad + s)
    ctx.quadraticCurveTo(pad, pad + s, pad, pad + s - r)
    ctx.lineTo(pad, pad + r)
    ctx.quadraticCurveTo(pad, pad, pad + r, pad)
    ctx.closePath()
  } else if (shape === 'hexagon') {
    drawHexagon(ctx, cx, cy, s / 2)
  } else if (shape === 'diamond') {
    ctx.beginPath()
    ctx.moveTo(cx, pad)
    ctx.lineTo(pad + s, cy)
    ctx.lineTo(cx, pad + s)
    ctx.lineTo(pad, cy)
    ctx.closePath()
  }
}

export default function LogoMaker() {
  const canvasRef = useRef()

  const [text, setText]         = useState('UX')
  const [shape, setShape]       = useState('circle')
  const [bgType, setBgType]     = useState('solid')         // solid | gradient
  const [bgColor, setBgColor]   = useState('#6366f1')
  const [bgFrom, setBgFrom]     = useState('#6366f1')
  const [bgTo, setBgTo]         = useState('#a855f7')
  const [gradAngle, setGradAngle] = useState(135)
  const [fgColor, setFgColor]   = useState('#ffffff')
  const [fontIdx, setFontIdx]   = useState(0)
  const [fontSize, setFontSize] = useState(42)
  const [bold, setBold]         = useState(true)
  const [italic, setItalic]     = useState(false)
  const [shadow, setShadow]     = useState(false)
  const [iconSize, setIconSize] = useState(60)              // % of canvas
  const [exportSize, setExportSize] = useState(512)
  const [bgCanvas, setBgCanvas] = useState('#ffffff')       // canvas bg (for transparent)
  const [transparent, setTransparent] = useState(false)
  const [canvasSize] = useState(256)                        // preview canvas px

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = canvasSize

    ctx.clearRect(0, 0, size, size)

    // Canvas background (for preview)
    if (!transparent) {
      ctx.fillStyle = bgCanvas
      ctx.fillRect(0, 0, size, size)
    }

    // Shape fill
    ctx.save()
    drawShape(ctx, shape, size)
    if (shape !== 'none') ctx.clip()

    if (bgType === 'gradient') {
      const rad = (gradAngle * Math.PI) / 180
      const cx = size / 2, cy = size / 2, r = size / 2
      const x1 = cx - Math.cos(rad) * r, y1 = cy - Math.sin(rad) * r
      const x2 = cx + Math.cos(rad) * r, y2 = cy + Math.sin(rad) * r
      const grad = ctx.createLinearGradient(x1, y1, x2, y2)
      grad.addColorStop(0, bgFrom)
      grad.addColorStop(1, bgTo)
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = bgColor
    }
    ctx.fillRect(0, 0, size, size)
    ctx.restore()

    // Shape stroke
    if (shape !== 'none') {
      ctx.save()
      drawShape(ctx, shape, size)
      ctx.restore()
    }

    // Text
    if (text) {
      const weight = bold ? 'bold ' : ''
      const style  = italic ? 'italic ' : ''
      const scaledSize = size * (fontSize / 100)
      ctx.font = `${style}${weight}${scaledSize}px ${FONTS[fontIdx]}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.4)'
        ctx.shadowBlur  = scaledSize * 0.15
        ctx.shadowOffsetX = scaledSize * 0.04
        ctx.shadowOffsetY = scaledSize * 0.04
      }

      ctx.fillStyle = fgColor

      // Clip to shape for text too
      if (shape !== 'none') {
        ctx.save()
        drawShape(ctx, shape, size)
        ctx.clip()
      }

      // Auto-fit long text
      let fs = scaledSize
      ctx.font = `${style}${weight}${fs}px ${FONTS[fontIdx]}`
      while (ctx.measureText(text).width > size * 0.82 && fs > 8) {
        fs -= 1
        ctx.font = `${style}${weight}${fs}px ${FONTS[fontIdx]}`
      }

      ctx.fillText(text, size / 2, size / 2)
      if (shape !== 'none') ctx.restore()

      ctx.shadowColor = 'transparent'
    }
  }, [text, shape, bgType, bgColor, bgFrom, bgTo, gradAngle, fgColor, fontIdx, fontSize, bold, italic, shadow, transparent, bgCanvas, canvasSize])

  useEffect(() => { draw() }, [draw])

  function applyPreset(p) {
    setText(p.text); setShape(p.shape); setBgColor(p.bg)
    setFgColor(p.fg); setFontIdx(p.font); setFontSize(p.fontSize)
    setBold(p.bold); setItalic(p.italic); setBgType('solid')
  }

  function download(size) {
    const offscreen = document.createElement('canvas')
    offscreen.width = offscreen.height = size
    // alpha:true is the default but being explicit ensures transparency is preserved
    const ctx = offscreen.getContext('2d', { alpha: true })

    // Always start fully transparent
    ctx.clearRect(0, 0, size, size)

    // Solid canvas background — only when NOT transparent mode
    if (!transparent) {
      ctx.fillStyle = bgCanvas
      ctx.fillRect(0, 0, size, size)
    }

    // Shape background fill
    // When transparent + shape='none': skip fill, let canvas stay clear outside text
    if (shape !== 'none' || !transparent) {
      ctx.save()
      drawShape(ctx, shape, size)
      if (shape !== 'none') ctx.clip()

      if (bgType === 'gradient') {
        const rad = (gradAngle * Math.PI) / 180
        const cx = size / 2, cy = size / 2, r = size / 2
        const x1 = cx - Math.cos(rad) * r, y1 = cy - Math.sin(rad) * r
        const x2 = cx + Math.cos(rad) * r, y2 = cy + Math.sin(rad) * r
        const grad = ctx.createLinearGradient(x1, y1, x2, y2)
        grad.addColorStop(0, bgFrom)
        grad.addColorStop(1, bgTo)
        ctx.fillStyle = grad
      } else {
        ctx.fillStyle = bgColor
      }
      ctx.fillRect(0, 0, size, size)
      ctx.restore()
    }

    // Text
    if (text) {
      const weight = bold ? 'bold ' : ''
      const style  = italic ? 'italic ' : ''
      const scaledSize = size * (fontSize / 100)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = fgColor

      if (shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.4)'
        ctx.shadowBlur = scaledSize * 0.15
        ctx.shadowOffsetX = scaledSize * 0.04
        ctx.shadowOffsetY = scaledSize * 0.04
      }

      if (shape !== 'none') {
        ctx.save()
        drawShape(ctx, shape, size)
        ctx.clip()
      }

      let fs = scaledSize
      ctx.font = `${style}${weight}${fs}px ${FONTS[fontIdx]}`
      while (ctx.measureText(text).width > size * 0.82 && fs > 8) {
        fs -= 1
        ctx.font = `${style}${weight}${fs}px ${FONTS[fontIdx]}`
      }

      ctx.fillText(text, size / 2, size / 2)

      if (shape !== 'none') ctx.restore()
      ctx.shadowColor = 'transparent'
    }

    // Force PNG so alpha channel is preserved
    offscreen.toBlob(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `logo-${size}x${size}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    }, 'image/png')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Logo Maker</h1>
      <p className="tool-description">Design a simple logo with text, shapes, gradients, and custom fonts — download as PNG.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Presets */}
          <div>
            <label>Quick presets</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PRESETS.map((p, i) => (
                <div
                  key={i} onClick={() => applyPreset(p)} title="Apply preset"
                  style={{ width: 44, height: 44, borderRadius: p.shape === 'circle' ? '50%' : 8, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: p.fg, fontWeight: 700, fontSize: '0.85rem', border: '2px solid var(--border)', flexShrink: 0 }}
                >
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label htmlFor="logo-text">Logo text / emoji</label>
            <input id="logo-text" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. AB or ⚡" maxLength={6} />
          </div>

          {/* Shape */}
          <div>
            <label>Shape</label>
            <div className="chip-group" style={{ margin: 0, flexWrap: 'wrap' }}>
              {SHAPES.map(s => <button key={s} className={`chip ${shape === s ? 'active' : ''}`} onClick={() => setShape(s)}>{s}</button>)}
            </div>
          </div>

          {/* Background */}
          <div>
            <label>Background</label>
            <div className="chip-group" style={{ margin: 0, marginBottom: '0.5rem' }}>
              <button className={`chip ${bgType === 'solid' ? 'active' : ''}`} onClick={() => setBgType('solid')}>Solid</button>
              <button className={`chip ${bgType === 'gradient' ? 'active' : ''}`} onClick={() => setBgType('gradient')}>Gradient</button>
            </div>

            {bgType === 'solid' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 40, height: 36, padding: 2, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }} />
                <code style={{ fontSize: '0.85rem' }}>{bgColor}</code>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={bgFrom} onChange={e => setBgFrom(e.target.value)} style={{ width: 36, height: 32, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>→</span>
                  <input type="color" value={bgTo} onChange={e => setBgTo(e.target.value)} style={{ width: 36, height: 32, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
                  <div style={{ height: 32, flex: 1, borderRadius: 6, background: `linear-gradient(${gradAngle}deg,${bgFrom},${bgTo})` }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem' }}>Angle: {gradAngle}°</label>
                  <input type="range" min={0} max={360} value={gradAngle} onChange={e => setGradAngle(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {GRADIENT_PRESETS.map((g, i) => (
                    <div key={i} onClick={() => { setBgFrom(g.from); setBgTo(g.to) }}
                      style={{ width: 36, height: 24, borderRadius: 6, background: `linear-gradient(135deg,${g.from},${g.to})`, cursor: 'pointer', border: '1px solid var(--border)' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text color */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.82rem' }}>Text color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ width: 36, height: 32, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
                {[['#ffffff','White'],['#000000','Black'],['#f8fafc','Off-white']].map(([c,l]) => (
                  <div key={c} onClick={() => setFgColor(c)} title={l} style={{ width: 24, height: 24, borderRadius: 4, background: c, border: `2px solid ${fgColor===c?'var(--accent)':'var(--border)'}`, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Font */}
          <div>
            <label>Font family</label>
            <div className="chip-group" style={{ margin: 0, flexWrap: 'wrap' }}>
              {FONT_LABELS.map((f, i) => <button key={i} className={`chip ${fontIdx === i ? 'active' : ''}`} onClick={() => setFontIdx(i)}>{f}</button>)}
            </div>
          </div>

          {/* Size & style */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem' }}>Font size: {fontSize}%</label>
              <input type="range" min={10} max={90} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1.5rem' }}>
              {[['Bold', bold, setBold], ['Italic', italic, setItalic], ['Shadow', shadow, setShadow]].map(([l, v, s]) => (
                <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text)', marginBottom: 0 }}>
                  <input type="checkbox" checked={v} onChange={e => s(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
                  {l}
                </label>
              ))}
            </div>
          </div>

          {/* Canvas BG */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text)', marginBottom: 0 }}>
              <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
              Transparent PNG
            </label>
            {!transparent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Canvas bg:</span>
                <input type="color" value={bgCanvas} onChange={e => setBgCanvas(e.target.value)} style={{ width: 32, height: 28, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
              </div>
            )}
          </div>
        </div>

        {/* Preview + Download */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <label>Preview</label>
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            style={{ borderRadius: 12, border: '2px solid var(--border)', display: 'block', background: transparent ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 16px 16px' : bgCanvas }}
          />
          <label>Download</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
            {SIZES.map(s => (
              <button key={s} className="btn btn-sm" onClick={() => download(s)}>⬇ {s}×{s} PNG</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
