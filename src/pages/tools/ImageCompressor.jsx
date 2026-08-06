import { useState, useCallback, useRef } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'
import RelatedTools from '../../components/RelatedTools'

const MAX_WIDTH_OPTIONS = [
  { label: 'Original', value: 0 },
  { label: '1920 px', value: 1920 },
  { label: '1280 px', value: 1280 },
  { label: '800 px',  value: 800 },
]

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getOutputMime(file) {
  if (file.type === 'image/webp') return 'image/webp'
  if (file.type === 'image/png') return 'image/png'
  return 'image/jpeg'
}

function getOutputExt(mime) {
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/png') return 'png'
  return 'jpg'
}

function compressImage(file, quality, maxWidth) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = ev => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const mime = getOutputMime(file)
        let w = img.naturalWidth
        let h = img.naturalHeight

        if (maxWidth > 0 && w > maxWidth) {
          h = Math.round(h * maxWidth / w)
          w = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        // Fill white background for JPEG (handles transparent PNGs exported as JPEG)
        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, w, h)
        }
        ctx.drawImage(img, 0, 0, w, h)

        const q = mime === 'image/png' ? undefined : quality / 100
        canvas.toBlob(
          blob => {
            if (!blob) { reject(new Error('toBlob returned null')); return }
            resolve(blob)
          },
          mime,
          q
        )
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ImageCompressor() {
  const [files, setFiles]       = useState([])   // { id, name, originalSize, compressedBlob, compressedSize, previewUrl, error }
  const [quality, setQuality]   = useState(80)
  const [maxWidth, setMaxWidth] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)

  // Process a list of File objects
  const processFiles = useCallback(async (rawFiles) => {
    const accepted = Array.from(rawFiles).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    if (accepted.length === 0) return

    setProcessing(true)
    const results = await Promise.all(
      accepted.map(async (f, i) => {
        const id = `${Date.now()}-${i}-${f.name}`
        try {
          const blob = await compressImage(f, quality, maxWidth)
          const previewUrl = URL.createObjectURL(blob)
          return {
            id,
            name: f.name,
            originalSize: f.size,
            compressedBlob: blob,
            compressedSize: blob.size,
            previewUrl,
            error: null,
          }
        } catch {
          return {
            id,
            name: f.name,
            originalSize: f.size,
            compressedBlob: null,
            compressedSize: 0,
            previewUrl: null,
            error: 'Failed to compress',
          }
        }
      })
    )
    setFiles(prev => [...prev, ...results])
    setProcessing(false)
  }, [quality, maxWidth])

  function onFileInput(e) {
    processFiles(e.target.files)
    // reset so the same file can be re-added after settings change
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  function downloadFile(item) {
    if (!item.compressedBlob) return
    const mime = item.compressedBlob.type
    const ext  = getOutputExt(mime)
    const url  = URL.createObjectURL(item.compressedBlob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = item.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function downloadAll() {
    for (const item of files) {
      if (item.compressedBlob) downloadFile(item)
      // small stagger so browsers don't block multiple downloads
      await new Promise(r => setTimeout(r, 150))
    }
  }

  function removeFile(id) {
    setFiles(prev => {
      const item = prev.find(f => f.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter(f => f.id !== id)
    })
  }

  function clearAll() {
    files.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl) })
    setFiles([])
  }

  const successFiles = files.filter(f => f.compressedBlob)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Compressor</h1>
      <p className="tool-description">
        Compress JPG, PNG, and WebP images directly in your browser — nothing is uploaded to any server.
      </p>

      {/* Settings */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="ic-quality">Quality: {quality}%</label>
          <input
            id="ic-quality"
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="ic-maxwidth">Max width</label>
          <select
            id="ic-maxwidth"
            value={maxWidth}
            onChange={e => setMaxWidth(Number(e.target.value))}
          >
            {MAX_WIDTH_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`file-drop-zone${dragging ? ' file-drop-zone--active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Select or drop images to compress"
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <span className="file-drop-icon">🗜️</span>
        <p className="file-drop-label">
          {processing ? 'Compressing…' : 'Drop images here or click to browse'}
        </p>
        <p className="file-drop-meta">JPG, PNG, WebP — multiple files supported</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {/* Actions row */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem', alignItems: 'center' }}>
          {successFiles.length > 1 && (
            <button className="btn" onClick={downloadAll}>
              ⬇ Download all ({successFiles.length})
            </button>
          )}
          <button
            className="btn"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
            onClick={clearAll}
          >
            Clear all
          </button>
        </div>
      )}

      {/* File cards */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          {files.map(item => {
            const reduction = item.originalSize > 0
              ? Math.round((1 - item.compressedSize / item.originalSize) * 100)
              : 0
            const saved = item.originalSize - item.compressedSize

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }}
              >
                {/* Thumbnail */}
                {item.previewUrl && (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 'calc(var(--radius) - 2px)',
                      border: '1px solid var(--border)',
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.35rem', wordBreak: 'break-all' }}>
                    {item.name}
                  </p>

                  {item.error ? (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{item.error}</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--muted)' }}>
                        <span>Original: <strong style={{ color: 'var(--text)' }}>{formatBytes(item.originalSize)}</strong></span>
                        <span>Compressed: <strong style={{ color: 'var(--text)' }}>{formatBytes(item.compressedSize)}</strong></span>
                        {saved > 0 && (
                          <span style={{ color: '#10b981', fontWeight: 600 }}>
                            −{reduction}% ({formatBytes(saved)} saved)
                          </span>
                        )}
                        {saved <= 0 && item.compressedSize > 0 && (
                          <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                            Already optimised
                          </span>
                        )}
                      </div>

                      {/* Size bar */}
                      {item.originalSize > 0 && (
                        <div style={{ marginTop: '0.6rem', height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.max(4, 100 - reduction)}%`,
                              background: reduction >= 30 ? '#10b981' : reduction >= 10 ? '#f59e0b' : 'var(--accent)',
                              borderRadius: 3,
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Card actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                  {item.compressedBlob && (
                    <button className="btn" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }} onClick={() => downloadFile(item)}>
                      ⬇ Download
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(item.id)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      padding: '0.4rem 0.8rem',
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
        All processing happens locally in your browser. No images are sent to any server.
      </p>

      <RelatedTools category="files" exclude="/tools/image-compressor" />
      <ToolSeo />
    </div>
  )
}
