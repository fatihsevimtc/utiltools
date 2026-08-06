import { useRef, useState, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

const MAX_HISTORY = 20

export default function DigitalSignature() {
  const canvasRef  = useRef()
  const drawing    = useRef(false)
  const lastPos    = useRef(null)
  const history    = useRef([])   // stack of ImageData snapshots

  const [penColor,    setPenColor]    = useState('#000000')
  const [penSize,     setPenSize]     = useState(3)
  const [bgColor,     setBgColor]     = useState('#ffffff')
  const [transparent, setTransparent] = useState(false)
  const [isEmpty,     setIsEmpty]     = useState(true)
  const [canUndo,     setCanUndo]     = useState(false)

  // Draw the canvas background fill
  const fillBg = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!transparent) {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [transparent, bgColor])

  // When bg/transparent changes reset canvas and history
  useEffect(() => {
    fillBg()
    history.current = []
    setIsEmpty(true)
    setCanUndo(false)
  }, [fillBg])

  function saveSnapshot() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height)
    history.current.push(snap)
    if (history.current.length > MAX_HISTORY) history.current.shift()
    setCanUndo(true)
  }

  function undo() {
    if (history.current.length === 0) return
    const snap   = history.current.pop()
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    ctx.putImageData(snap, 0, 0)
    const remaining = history.current.length
    setCanUndo(remaining > 0)
    setIsEmpty(remaining === 0)
  }

  function getPos(e, canvas) {
    const rect   = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    const src    = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    }
  }

  function startDraw(e) {
    e.preventDefault()
    saveSnapshot()                   // save state BEFORE this stroke
    drawing.current = true
    lastPos.current = getPos(e, canvasRef.current)
    setIsEmpty(false)
  }

  function draw(e) {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const pos    = getPos(e, canvas)

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = penColor
    ctx.lineWidth   = penSize
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.stroke()

    lastPos.current = pos
  }

  function stopDraw(e) {
    e.preventDefault()
    drawing.current = false
    lastPos.current = null
  }

  function clear() {
    fillBg()
    history.current = []
    setIsEmpty(true)
    setCanUndo(false)
  }

  function download(format) {
    const src = canvasRef.current
    const off = document.createElement('canvas')
    off.width  = src.width
    off.height = src.height
    const ctx  = off.getContext('2d', { alpha: true })

    ctx.clearRect(0, 0, off.width, off.height)
    if (!transparent) {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, off.width, off.height)
    }
    ctx.drawImage(src, 0, 0)

    if (format === 'svg') {
      const dataUrl = off.toDataURL('image/png')
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${off.width}" height="${off.height}">\n  <image href="${dataUrl}" width="${off.width}" height="${off.height}"/>\n</svg>`
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'signature.svg'
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(a.href)
      return
    }

    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
    off.toBlob(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `signature.${format}`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(a.href)
    }, mime, 0.95)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Digital Signature</h1>
      <p className="tool-description">
        Draw your signature with mouse or touch. Download as PNG, JPG, or SVG — with optional transparent background.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 200 }}>

          <div>
            <label>Pen color</label>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)}
                style={{ width: 36, height: 32, padding: 2, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
              {['#000000','#1e40af','#15803d','#b91c1c','#7c3aed'].map(c => (
                <div key={c} onClick={() => setPenColor(c)}
                  style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer',
                    border: `2px solid ${penColor === c ? 'var(--accent)' : 'var(--border)'}` }} />
              ))}
            </div>
          </div>

          <div>
            <label>Pen thickness: {penSize}px</label>
            <input type="range" min={1} max={12} value={penSize}
              onChange={e => setPenSize(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          {/* Transparent toggle — both rows always rendered, visibility toggled so height never changes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}>
              <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)}
                style={{ width: 'auto', accentColor: 'var(--accent)' }} />
              Transparent background
            </label>
            {/* Color picker — always in DOM, hidden when transparent is on */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', visibility: transparent ? 'hidden' : 'visible' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Background:</span>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                style={{ width: 28, height: 24, padding: 1, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }} />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!canUndo}
              style={{ opacity: canUndo ? 1 : 0.4 }} title="Undo last stroke (Ctrl+Z)">
              ↩ Undo
            </button>
            <button className="btn btn-ghost btn-sm" onClick={clear}>
              🗑 Clear
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label>Download</label>
            {['png', 'jpg', 'svg'].map(fmt => (
              <button key={fmt} className="btn btn-sm" onClick={() => download(fmt)}
                disabled={isEmpty} style={{ opacity: isEmpty ? 0.45 : 1 }}>
                ⬇ {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: '1 1 400px' }}>
          <label style={{ marginBottom: '0.4rem', display: 'block' }}>
            Sign here
            <span style={{ color: 'var(--muted)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
              (mouse or touch)
            </span>
          </label>
          <canvas
            ref={canvasRef}
            width={700}
            height={280}
            style={{
              width: '100%',
              borderRadius: 'var(--radius)',
              border: '2px dashed var(--border)',
              cursor: 'crosshair',
              touchAction: 'none',
              background: transparent
                ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 16px 16px'
                : bgColor,
              display: 'block',
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
            Draw your signature above · Undo last stroke with ↩ · Download as PNG, JPG, or SVG.
          </p>
        </div>
      </div>

      <ToolSeo />
    </div>
  )
}
