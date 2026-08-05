import { useState, useRef } from 'react'
import BackBar from '../../components/BackBar'

const TEXT_TYPES = [
  { label: 'CSS', mime: 'text/css' },
  { label: 'HTML', mime: 'text/html' },
  { label: 'JavaScript', mime: 'application/javascript' },
  { label: 'SVG', mime: 'image/svg+xml' },
  { label: 'JSON', mime: 'application/json' },
  { label: 'Plain text', mime: 'text/plain' },
]

export default function DataUriEncoder() {
  const [tab, setTab] = useState('file')
  const [textInput, setTextInput] = useState('')
  const [mime, setMime] = useState('text/css')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState('')
  const fileRef = useRef()

  function processFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setResult({ dataUri: e.target.result, name: file.name, size: file.size, type: file.type })
    }
    reader.readAsDataURL(file)
  }

  function encodeText() {
    if (!textInput.trim()) return
    const encoded = btoa(unescape(encodeURIComponent(textInput)))
    setResult({ dataUri: `data:${mime};base64,${encoded}`, name: null, size: textInput.length, type: mime })
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Data URI Encoder</h1>
      <p className="tool-description">Convert files or text into Base64 data URIs for embedding directly in HTML or CSS.</p>

      <div className="chip-group">
        <button className={`chip ${tab === 'file' ? 'active' : ''}`} onClick={() => { setTab('file'); setResult(null) }}>File upload</button>
        <button className={`chip ${tab === 'text' ? 'active' : ''}`} onClick={() => { setTab('text'); setResult(null) }}>Text / code</button>
      </div>

      {tab === 'file' ? (
        <div
          onClick={() => fileRef.current.click()}
          style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--surface)', marginTop: '1rem' }}
        >
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
          <p style={{ margin: 0, color: 'var(--muted)' }}>📁 Click to select any file</p>
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <label>MIME type</label>
          <div className="chip-group">
            {TEXT_TYPES.map(t => (
              <button key={t.mime} className={`chip ${mime === t.mime ? 'active' : ''}`} onClick={() => setMime(t.mime)}>{t.label}</button>
            ))}
          </div>
          <label htmlFor="du-text" style={{ marginTop: '0.75rem' }}>Content</label>
          <textarea
            id="du-text"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Paste your CSS, SVG, HTML, etc."
            style={{ minHeight: 140, fontFamily: 'monospace', fontSize: '0.85rem' }}
          />
          <button className="btn" style={{ marginTop: '0.75rem' }} onClick={encodeText}>Encode</button>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
            {result.name && <>{result.name} — </>}{result.type} — {(result.size / 1024).toFixed(1)} KB input
          </p>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ marginBottom: 0 }}>Data URI</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-sm" onClick={() => copy(result.dataUri, 'uri')}>{copied === 'uri' ? '✓ Copied' : 'Copy'}</button>
              </div>
            </div>
            <div className="code-block" style={{ maxHeight: 140, overflow: 'auto', wordBreak: 'break-all', fontSize: '0.75rem' }}>{result.dataUri}</div>
          </div>

          {result.type.startsWith('image/') && (
            <div>
              <label>Preview</label>
              <img src={result.dataUri} alt="preview" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', border: '1px solid var(--border)', borderRadius: 8 }} />
            </div>
          )}

          <div>
            <label>CSS usage example</label>
            <div className="code-block" style={{ fontSize: '0.82rem', wordBreak: 'break-all' }}>
              {`background-image: url('${result.dataUri.slice(0, 60)}…');`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
