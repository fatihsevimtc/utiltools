import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

export default function Base64ToImage() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  // Allow either full data URI or raw base64
  function buildDataUrl(raw) {
    const s = raw.trim()
    if (s.startsWith('data:image/')) return s
    // Try to detect type from base64 magic bytes
    try {
      const binary = atob(s.slice(0, 8))
      if (binary.startsWith('\xFF\xD8')) return `data:image/jpeg;base64,${s}`
      if (binary.startsWith('\x89PNG')) return `data:image/png;base64,${s}`
      if (binary.startsWith('GIF')) return `data:image/gif;base64,${s}`
      if (binary.startsWith('RIFF')) return `data:image/webp;base64,${s}`
    } catch { /* fall through */ }
    return `data:image/png;base64,${s}`
  }

  function dataUrl() {
    if (!input.trim()) return null
    try {
      return buildDataUrl(input)
    } catch {
      return null
    }
  }

  const url = dataUrl()

  function download() {
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = 'image'
    a.click()
  }

  function handleChange(e) {
    setInput(e.target.value)
    setError('')
    try {
      buildDataUrl(e.target.value)
    } catch {
      setError('Invalid Base64 string')
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Base64 to Image</h1>
      <p className="tool-description">Paste a Base64 string or data URI to preview and download the image.</p>

      <label htmlFor="b642img-input">Base64 or data URI</label>
      <textarea
        id="b642img-input"
        value={input}
        onChange={handleChange}
        placeholder="data:image/png;base64,iVBORw0KGgo… or raw base64"
        style={{ minHeight: 120, fontFamily: 'monospace', fontSize: '0.8rem' }}
      />

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {url && !error && (
        <div style={{ marginTop: '1.5rem' }}>
          <img
            src={url}
            alt="decoded"
            onError={() => setError('Could not render image — check your Base64 string')}
            style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', display: 'block' }}
          />
          <button className="btn" style={{ marginTop: '0.75rem' }} onClick={download}>⬇ Download image</button>
        </div>
      )}
      <RelatedTools category="files" exclude="/tools/base64-to-image" />
    </div>
  )
}
