import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ImageEnlarger() {
  const [imageSrc, setImageSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [scaleFactor, setScaleFactor] = useState(2)
  const [smoothing, setSmoothing] = useState(true)
  const [enlarged, setEnlarged] = useState(false)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setEnlarged(false)
    const reader = new FileReader()
    reader.onload = (ev) => setImageSrc(ev.target.result)
    reader.readAsDataURL(file)
  }, [])

  function enlarge() {
    if (!imageSrc || !canvasRef.current) return

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const newWidth = img.width * scaleFactor
      const newHeight = img.height * scaleFactor

      canvas.width = newWidth
      canvas.height = newHeight

      ctx.imageSmoothingEnabled = smoothing
      ctx.imageSmoothingQuality = smoothing ? 'high' : 'low'

      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      setEnlarged(true)
    }
    img.src = imageSrc
  }

  function download() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `enlarged-${scaleFactor}x.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  function reset() {
    setImageSrc(null)
    setFileName('')
    setScaleFactor(2)
    setSmoothing(true)
    setEnlarged(false)
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      canvasRef.current.width = 0
      canvasRef.current.height = 0
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Enlarger</h1>
      <p className="tool-description">
        Scale up images to a larger size — choose scale factor and smoothing method.
      </p>

      <label className="file-upload-label" style={{ marginBottom: '1rem' }}>
        📁 {fileName || 'Choose image…'}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {imageSrc && (
        <>
          <label htmlFor="ie-scale">Scale factor (1× – 8×)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <button
              className="btn"
              onClick={() => setScaleFactor(prev => Math.max(1, prev - 0.5))}
              style={{ padding: '0.5rem 0.75rem', minWidth: 'auto' }}
              title="Decrease scale"
            >
              −
            </button>
            <input
              id="ie-scale"
              type="number"
              min={1}
              max={8}
              step={0.5}
              value={scaleFactor}
              onChange={e => {
                const v = parseFloat(e.target.value)
                if (!isNaN(v)) setScaleFactor(v)
              }}
              style={{ flex: 1, textAlign: 'center' }}
            />
            <button
              className="btn"
              onClick={() => setScaleFactor(prev => Math.min(8, prev + 0.5))}
              style={{ padding: '0.5rem 0.75rem', minWidth: 'auto' }}
              title="Increase scale"
            >
              +
            </button>
          </div>
          {(scaleFactor < 1 || scaleFactor > 8) && (
            <p style={{ fontSize: '0.82rem', color: '#f87171', marginBottom: '0.75rem' }}>
              ⚠ Scale factor must be between 1 and 8.
            </p>
          )}
          {scaleFactor > 4 && scaleFactor <= 8 && (
            <p style={{ fontSize: '0.82rem', color: '#fbbf24', marginBottom: '0.75rem' }}>
              ⚠ Scales above 4× can produce very large images and may be slow in-browser.
            </p>
          )}
          {scaleFactor >= 1 && scaleFactor <= 8 && scaleFactor <= 4 && (
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
              Supported range: 1× to 8×. Use 0.5 steps (e.g. 1.5, 2, 2.5…).
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              id="ie-smoothing"
              type="checkbox"
              checked={smoothing}
              onChange={e => setSmoothing(e.target.checked)}
            />
            <label htmlFor="ie-smoothing" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Enable smoothing (better for photos, off for pixel art)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={enlarge}
              disabled={scaleFactor < 1 || scaleFactor > 8}
              title={scaleFactor < 1 || scaleFactor > 8 ? 'Scale factor must be between 1 and 8' : ''}
            >
              🔍 Enlarge Image
            </button>
            {enlarged && (
              <>
                <button className="btn" onClick={download}>
                  ⬇ Download
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  ↻ Reset
                </button>
              </>
            )}
          </div>
        </>
      )}

      <canvas
        ref={canvasRef}
        style={{
          marginTop: '1.25rem',
          maxWidth: '100%',
          border: '1px solid var(--border)',
          borderRadius: 8,
          display: enlarged ? 'block' : 'none',
        }}
      />

      <RelatedTools tools={[
        { icon: '🖼️', name: 'Image Resizer',      path: '/tools/image-resizer' },
        { icon: '🗜️', name: 'Image Compressor',   path: '/tools/image-compressor' },
        { icon: '✂️', name: 'Image Cropper',       path: '/tools/image-cropper' },
        { icon: '🔄', name: 'Flip & Rotate',       path: '/tools/flip-rotate-image' },
      ]} />
      <ToolSeo />
    </div>
  )
}
