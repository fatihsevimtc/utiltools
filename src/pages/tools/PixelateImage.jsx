import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PixelateImage() {
  const [imageSrc, setImageSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [blockSize, setBlockSize] = useState(10)
  const [pixelated, setPixelated] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      setImageSrc(e.target.result)
      setPixelated(null)
    }
    reader.readAsDataURL(file)
  }

  function onFileChange(e) {
    loadFile(e.target.files[0])
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    loadFile(e.dataTransfer.files[0])
  }

  const pixelate = useCallback(() => {
    if (!imageSrc) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      const bs = Math.max(1, Math.min(blockSize, Math.min(img.width, img.height)))

      // Draw scaled-down then scale back up (pixelation trick)
      const w = Math.ceil(img.width / bs)
      const h = Math.ceil(img.height / bs)

      // Draw small
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, w, h)
      // Scale back up
      ctx.drawImage(canvas, 0, 0, w, h, 0, 0, img.width, img.height)

      setPixelated(canvas.toDataURL('image/png'))
    }
    img.src = imageSrc
  }, [imageSrc, blockSize])

  function download() {
    if (!pixelated) return
    const a = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '')
    a.download = `${base}-pixelated.png`
    a.href = pixelated
    a.click()
  }

  function reset() {
    setImageSrc(null)
    setFileName('')
    setPixelated(null)
    setBlockSize(10)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="tool-page">
      <BackBar />
      <ToolSeo />
      <h1>Pixelate Image</h1>
      <p className="tool-description">
        Apply a pixelation / mosaic effect to any image, entirely in your browser. Choose your block size and download the result.
      </p>

      {/* Drop zone */}
      <div
        className={`file-drop-zone${dragging ? ' file-drop-zone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Select or drop an image to pixelate"
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        style={{ marginBottom: '1.25rem' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
          aria-label="File input"
        />
        {imageSrc
          ? <img src={imageSrc} alt="Original preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, pointerEvents: 'none' }} />
          : <>
              <span className="file-drop-icon">🟦</span>
              <p className="file-drop-label">Drop an image here or click to browse</p>
              <p className="file-drop-meta">PNG, JPEG, WebP supported</p>
            </>
        }
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label htmlFor="px-block" style={{ marginBottom: 0 }}>
            Block size: <strong>{blockSize}px</strong>
          </label>
          <input
            id="px-block"
            type="range"
            min={2}
            max={80}
            value={blockSize}
            onChange={e => setBlockSize(Number(e.target.value))}
            style={{ width: 220 }}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            Larger = more pixelated
          </span>
        </div>

        <button className="btn" onClick={pixelate} disabled={!imageSrc}>
          🟦 Pixelate
        </button>

        {imageSrc && (
          <button className="btn btn-outline" onClick={reset}>
            🔄 Use New Image
          </button>
        )}
      </div>

      {pixelated && (
        <div style={{ marginTop: '1rem' }}>
          <label>Result</label>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '0.75rem', display: 'inline-block',
            marginBottom: '0.75rem',
          }}>
            <img
              src={pixelated}
              alt="Pixelated result"
              style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 6, display: 'block' }}
            />
          </div>
          <br />
          <button className="btn" onClick={download}>
            ⬇ Download PNG
          </button>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🖼️', name: 'Image Resizer',      path: '/tools/image-resizer' },
        { icon: '🔄', name: 'Flip & Rotate',      path: '/tools/flip-rotate-image' },
        { icon: '✂️', name: 'Image Cropper',       path: '/tools/image-cropper' },
        { icon: '🗜️', name: 'Image Compressor',   path: '/tools/image-compressor' },
      ]} />
    </div>
  )
}
