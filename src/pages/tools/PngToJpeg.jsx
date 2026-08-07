import { useState, useRef } from 'react'
import BackBar from '../../components/BackBar'

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

export default function PngToJpeg() {
  const [quality, setQuality] = useState(0.85)
  const [original, setOriginal] = useState(null)
  const [output, setOutput] = useState(null)
  const canvasRef = useRef(null)

  function onFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setOriginal({ name: file.name, size: file.size })
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      convert(quality)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  function convert(q) {
    const canvas = canvasRef.current
    if (!canvas || !original) return
    const dataUrl = canvas.toDataURL('image/jpeg', q)
    const approxSize = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 3 / 4)
    setOutput({ dataUrl, size: approxSize })
  }

  function handleQuality(e) {
    const q = parseFloat(e.target.value)
    setQuality(q)
    if (original) convert(q)
  }

  function download() {
    if (!output) return
    const a = document.createElement('a')
    a.href = output.dataUrl
    a.download = (original?.name || 'image').replace(/\.[^.]+$/, '') + '.jpg'
    a.click()
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>PNG to JPEG</h1>
      <p className="tool-description">Convert PNG images to JPEG with adjustable quality — all processing in your browser.</p>

      <input type="file" accept="image/png,image/*" onChange={onFile} style={{ marginBottom: '1rem' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <label>Quality: {Math.round(quality * 100)}%</label>
      <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={handleQuality} style={{ width: '100%', marginBottom: '1rem' }} />

      {original && output && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--surface2, #f5f5f5)', padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Original PNG</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{fmtSize(original.size)}</div>
          </div>
          <div style={{ background: 'var(--surface2, #f5f5f5)', padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Output JPEG (~)</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: output.size < original.size ? 'var(--success, #16a34a)' : undefined }}>{fmtSize(output.size)}</div>
          </div>
        </div>
      )}

      {output && (
        <>
          <img src={output.dataUrl} alt="JPEG preview" style={{ maxWidth: '100%', borderRadius: 4, border: '1px solid var(--border, #ddd)', marginBottom: '0.75rem' }} />
          <br />
          <button className="btn btn-sm" onClick={download}>⬇ Download JPEG</button>
        </>
      )}
    </div>
  )
}
