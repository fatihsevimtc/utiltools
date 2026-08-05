import { useState, useRef } from 'react'
import BackBar from '../../components/BackBar'

export default function ImageToBase64() {
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState('')
  const inputRef = useRef()

  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setResult({ dataUrl: e.target.result, name: file.name, size: file.size, type: file.type })
    }
    reader.readAsDataURL(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  const base64Only = result ? result.dataUrl.split(',')[1] : ''

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image to Base64</h1>
      <p className="tool-description">Convert any image to a Base64 data URI — everything runs in your browser.</p>

      <div
        onClick={() => inputRef.current.click()}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 12, padding: '2rem', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(var(--accent-rgb,99,102,241),0.05)' : 'var(--surface)',
          transition: 'border-color 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
        <p style={{ margin: 0, color: 'var(--muted)' }}>🖼️ Drop an image here or click to browse</p>
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img src={result.dataUrl} alt={result.name} style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
            {result.name} — {result.type} — {(result.size / 1024).toFixed(1)} KB
          </p>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ marginBottom: 0 }}>Data URI (img src)</label>
              <button className="btn btn-sm" onClick={() => copy(result.dataUrl, 'uri')}>{copied === 'uri' ? '✓ Copied' : 'Copy'}</button>
            </div>
            <div className="code-block" style={{ maxHeight: 120, overflow: 'auto', wordBreak: 'break-all', fontSize: '0.75rem' }}>{result.dataUrl}</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ marginBottom: 0 }}>Base64 only (no prefix)</label>
              <button className="btn btn-sm" onClick={() => copy(base64Only, 'b64')}>{copied === 'b64' ? '✓ Copied' : 'Copy'}</button>
            </div>
            <div className="code-block" style={{ maxHeight: 120, overflow: 'auto', wordBreak: 'break-all', fontSize: '0.75rem' }}>{base64Only}</div>
          </div>
        </div>
      )}
    </div>
  )
}
