import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
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
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export default function ImageColorPicker() {
  const [imageUrl, setImageUrl] = useState(null)
  const [color, setColor] = useState(null)
  const [history, setHistory] = useState([])
  const [dragging, setDragging] = useState(false)
  const canvasRef = useRef()
  const fileRef = useRef()

  function loadImage(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setImageUrl(e.target.result)
      setColor(null)
    }
    reader.readAsDataURL(file)
  }

  const handleCanvasClick = useCallback(e => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    const ctx = canvas.getContext('2d')
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    const picked = { hex: rgbToHex(r, g, b), rgb: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHsl(r, g, b), r, g, b }
    setColor(picked)
    setHistory(prev => [picked, ...prev.filter(c => c.hex !== picked.hex)].slice(0, 12))
  }, [])

  function drawImage(src) {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
    }
    img.src = src
  }

  const [copied, setCopied] = useState('')
  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Color Picker</h1>
      <p className="tool-description">Upload an image and click anywhere to pick a color — get HEX, RGB, and HSL values.</p>

      <div
        onClick={() => fileRef.current.click()}
        onDrop={e => { e.preventDefault(); setDragging(false); loadImage(e.dataTransfer.files[0]) }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        style={{ border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'var(--surface)', marginBottom: '1rem' }}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => loadImage(e.target.files[0])} />
        <p style={{ margin: 0, color: 'var(--muted)' }}>🖼️ Drop an image or click to browse</p>
      </div>

      {imageUrl && (
        <div style={{ position: 'relative', cursor: 'crosshair', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '1rem' }}>
          <canvas
            ref={el => { canvasRef.current = el; if (el && imageUrl) drawImage(imageUrl) }}
            onClick={handleCanvasClick}
            style={{ width: '100%', display: 'block' }}
          />
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 6, padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}>
            Click to pick a color
          </div>
        </div>
      )}

      {color && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: 60, height: 60, borderRadius: 10, background: color.hex, border: '2px solid var(--border)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[['HEX', color.hex], ['RGB', color.rgb], ['HSL', color.hsl]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ minWidth: 40, color: 'var(--accent)', fontSize: '0.82rem' }}>{label}</code>
                <code style={{ fontSize: '0.85rem' }}>{val}</code>
                <button className="btn btn-sm" onClick={() => copy(val, label)} style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>
                  {copied === label ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <label>Color history</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {history.map(c => (
              <div
                key={c.hex}
                title={c.hex}
                onClick={() => setColor(c)}
                style={{ width: 36, height: 36, borderRadius: 6, background: c.hex, border: '2px solid var(--border)', cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
