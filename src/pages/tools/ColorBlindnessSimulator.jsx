import { useState, useRef, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'

// Color blindness simulation matrices
const MATRICES = {
  normal:        [[1,0,0],[0,1,0],[0,0,1]],
  protanopia:    [[0.567,0.433,0],[0.558,0.442,0],[0,0.242,0.758]],
  deuteranopia:  [[0.625,0.375,0],[0.7,0.3,0],[0,0.3,0.7]],
  tritanopia:    [[0.95,0.05,0],[0,0.433,0.567],[0,0.475,0.525]],
  achromatopsia: [[0.299,0.587,0.114],[0.299,0.587,0.114],[0.299,0.587,0.114]],
  protanomaly:   [[0.817,0.183,0],[0.333,0.667,0],[0,0.125,0.875]],
  deuteranomaly: [[0.8,0.2,0],[0.258,0.742,0],[0,0.142,0.858]],
}

const LABELS = {
  normal: 'Normal Vision',
  protanopia: 'Protanopia (red-blind)',
  deuteranopia: 'Deuteranopia (green-blind)',
  tritanopia: 'Tritanopia (blue-blind)',
  achromatopsia: 'Achromatopsia (no color)',
  protanomaly: 'Protanomaly (red-weak)',
  deuteranomaly: 'Deuteranomaly (green-weak)',
}

function applyMatrix(imageData, matrix) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2]
    d[i]   = matrix[0][0]*r + matrix[0][1]*g + matrix[0][2]*b
    d[i+1] = matrix[1][0]*r + matrix[1][1]*g + matrix[1][2]*b
    d[i+2] = matrix[2][0]*r + matrix[2][1]*g + matrix[2][2]*b
  }
  return imageData
}

export default function ColorBlindnessSimulator() {
  const [src, setSrc]         = useState(null)
  const [type, setType]       = useState('protanopia')
  const originalRef           = useRef(null)
  const simulatedRef          = useRef(null)
  const [imgEl, setImgEl]     = useState(null)

  function onFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  function onDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const renderSimulated = useCallback(() => {
    if (!imgEl || !simulatedRef.current) return
    const canvas = simulatedRef.current
    canvas.width  = imgEl.naturalWidth
    canvas.height = imgEl.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imgEl, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    applyMatrix(imageData, MATRICES[type])
    ctx.putImageData(imageData, 0, 0)
  }, [imgEl, type])

  useEffect(() => { renderSimulated() }, [renderSimulated])

  function onImgLoad(e) {
    const img = e.target
    setImgEl(img)
    // Draw original
    const orig = originalRef.current
    orig.width  = img.naturalWidth
    orig.height = img.naturalHeight
    orig.getContext('2d').drawImage(img, 0, 0)
  }

  function download() {
    const a = document.createElement('a')
    a.href = simulatedRef.current.toDataURL('image/png')
    a.download = `${type}-simulation.png`
    a.click()
  }

  return (
    <div className="tool-page" style={{ maxWidth: 900 }}>
      <BackBar />
      <h1>Color Blindness Simulator</h1>
      <p className="tool-description">Upload an image and preview how it looks with different types of color blindness.</p>

      {!src ? (
        <div className="file-drop-zone" onDrop={onDrop} onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('cb-file').click()}>
          <div className="file-drop-icon">🎨</div>
          <p className="file-drop-label">Drop an image or click to upload</p>
          <p className="file-drop-meta">PNG, JPEG, WebP supported</p>
          <input id="cb-file" type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
        </div>
      ) : (
        <>
          <div className="chip-group" style={{ marginBottom: '1rem' }}>
            {Object.entries(LABELS).map(([k, v]) => (
              <button key={k} className={`chip ${type === k ? 'active' : ''}`} onClick={() => setType(k)}>{v}</button>
            ))}
          </div>

          {/* Hidden img to drive canvas drawing */}
          <img src={src} onLoad={onImgLoad} style={{ display: 'none' }} alt="" crossOrigin="anonymous" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>Original</p>
              <canvas ref={originalRef} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>{LABELS[type]}</p>
              <canvas ref={simulatedRef} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn btn-sm" onClick={download}>Download simulated</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setSrc(null)}>Upload different image</button>
          </div>
        </>
      )}
    </div>
  )
}
