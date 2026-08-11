import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function JsonUnescape() {
  const [input, setInput]   = useState('')
  const [mode, setMode]     = useState('unescape')
  const [copied, setCopied] = useState(false)

  let output = ''
  let error = ''
  if (input.trim()) {
    try {
      if (mode === 'unescape') {
        // Parse the JSON string value (handles \\n, \", etc.)
        output = JSON.parse(input.startsWith('"') ? input : `"${input.replace(/^"|"$/g, '')}"`)
      } else {
        // Escape a plain string into a JSON-safe value
        output = JSON.stringify(input)
      }
    } catch (e) {
      error = e.message
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON Unescape / Escape</h1>
      <p className="tool-description">
        Unescape a JSON-encoded string (turn <code>\\n</code>, <code>\"</code> etc. into real characters) or escape plain text into a JSON-safe string.
      </p>

      <div className="chip-group" style={{ marginBottom: '0.75rem' }}>
        <button className={`chip ${mode === 'unescape' ? 'active' : ''}`} onClick={() => setMode('unescape')}>Unescape JSON string</button>
        <button className={`chip ${mode === 'escape' ? 'active' : ''}`} onClick={() => setMode('escape')}>Escape plain text</button>
      </div>

      <label htmlFor="ju-input">Input</label>
      <textarea
        id="ju-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'unescape' ? '"Hello\\nWorld\\"test\\""' : 'Hello\nWorld "test"'}
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {error && <p style={{ color: 'var(--danger, #ef4444)', fontSize: '0.83rem', marginTop: '0.4rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 160, fontFamily: 'monospace', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/json-unescape" />
      <ToolSeo />
    </div>
  )
}
