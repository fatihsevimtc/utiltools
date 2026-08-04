import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  let output = ''
  let isError = false
  let isValid = false

  if (input.trim()) {
    try {
      const parsed = JSON.parse(input)
      output = JSON.stringify(parsed, null, Number(indent))
      isValid = true
    } catch (e) {
      output = e.message
      isError = true
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function minify() {
    try {
      setInput(JSON.stringify(JSON.parse(input)))
    } catch (_) {}
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON Formatter &amp; Validator</h1>
      <p className="tool-description">
        Paste JSON to pretty-print and validate it. Errors are shown inline.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <label style={{ marginBottom: 0 }}>Paste JSON</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <select
            value={indent}
            onChange={e => setIndent(e.target.value)}
            style={{ width: 'auto' }}
            aria-label="Indentation"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={'\t'}>Tab</option>
          </select>
          {isValid && (
            <button className="btn btn-ghost btn-sm" onClick={minify}>Minify</button>
          )}
        </div>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        style={{ minHeight: 200, fontFamily: 'monospace' }}
      />

      {input.trim() && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0, color: isError ? 'var(--danger)' : isValid ? 'var(--success)' : 'var(--muted)' }}>
              {isError ? '✗ Invalid JSON' : '✓ Valid JSON'}
            </label>
            {isValid && (
              <button className="btn btn-sm" onClick={copy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className={`code-block ${isError ? 'error' : isValid ? 'success' : ''}`}>
            {output}
          </div>
        </div>
      )}
    </div>
  )
}
