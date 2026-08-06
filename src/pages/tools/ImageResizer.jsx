import { useState, useRef } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

export default function ImageResizer() {
  const [original, setOriginal] = useState(null) // { w, h, src, name }
  const [width, setWidth]       = useState('')
  const [height, setHeight]     = useState('')
  const [lockAspect, setLock]   = useState(true)
  const [format, setFormat]     = useState('image/png')
  const [quality, setQuality]   = useState(90)
  const [dragging, setDragging] = useState(false)
  const canvasRef               = useRef(null)
  const fileInputRef            = useRef(null)

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        setOriginal({ w: img.naturalWidth, h: img.naturalHeight, src: ev.target.result, name: file.name })
        setWidth(String(img.naturalWidth))
        setHeight(String(img.naturalHeight))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  function onFile(e) { loadFile(e.target.files?.[0]) }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    loadFile(e.dataTransfer.files?.[0])
  }

  function handleW(val) {
    setWidth(val)
    if (lockAspect && original) setHeight(String(Math.round(Number(val) * original.h / original.w)))
  }
  function handleH(val) {
    setHeight(val)
    if (lockAspect && original) setWidth(String(Math.round(Number(val) * original.w / original.h)))
  }

  function download() {
    if (!original) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = Number(width), h = Number(height)
    canvas.width = w; canvas.height = h
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'
        a.download = original.name.replace(/\.[^.]+$/, '') + `_${w}x${h}.${ext}`
        a.target = '_blank'
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }, format, quality/100)
    }
    img.src = original.src
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Resizer</h1>
      <p className="tool-description">Resize images in your browser — no upload, no server, instant download.</p>

      {/* Drop zone */}
      <div
        className={`file-drop-zone${dragging ? ' file-drop-zone--active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Select or drop an image"
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <span className="file-drop-icon">🖼️</span>
        <p className="file-drop-label">
          {original ? original.name : 'Drop an image here or click to browse'}
        </p>
        {original && (
          <p className="file-drop-meta">{original.w} × {original.h} px</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          style={{ display: 'none' }}
        />
      </div>

      {original && (
        <>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 120px' }}>
              <label>Width (px)</label>
              <input type="number" min={1} value={width} onChange={e => handleW(e.target.value)} />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label>Height (px)</label>
              <input type="number" min={1} value={height} onChange={e => handleH(e.target.value)} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', cursor: 'pointer', paddingBottom: '0.65rem' }}>
              <input type="checkbox" checked={lockAspect} onChange={e => setLock(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
              Lock aspect ratio
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 140px' }}>
              <label>Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            {format !== 'image/png' && (
              <div style={{ flex: '1 1 140px' }}>
                <label>Quality: {quality}%</label>
                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
              </div>
            )}
          </div>

          <button className="btn" onClick={download} style={{ marginTop: '1.25rem' }}>
            Download {width}×{height}
          </button>

          <img src={original.src} alt="preview" style={{ marginTop: '1.25rem', maxWidth: '100%', maxHeight: 300, borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'block' }} />
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
          <ToolSeo />
    </div>
  )
}
