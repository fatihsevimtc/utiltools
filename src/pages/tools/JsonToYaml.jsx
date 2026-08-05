import { useState } from 'react'
import BackBar from '../../components/BackBar'

function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent)
  if (obj === null) return 'null'
  if (typeof obj === 'boolean') return String(obj)
  if (typeof obj === 'number') return String(obj)
  if (typeof obj === 'string') {
    if (/[:#\[\]{},|>&*!'"@%`]/.test(obj) || /^\s|\s$/.test(obj) || obj === '') {
      return '"' + obj.replace(/"/g, '\\"') + '"'
    }
    return obj
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        const inner = jsonToYaml(item, indent + 1)
        return `${pad}- ${inner.trimStart()}`
      }
      return `${pad}- ${jsonToYaml(item, indent)}`
    }).join('\n')
  }
  // Object
  const entries = Object.entries(obj)
  if (entries.length === 0) return '{}'
  return entries.map(([k, v]) => {
    if (typeof v === 'object' && v !== null) {
      if (Array.isArray(v) && v.length === 0) return `${pad}${k}: []`
      if (!Array.isArray(v) && Object.keys(v).length === 0) return `${pad}${k}: {}`
      return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`
    }
    return `${pad}${k}: ${jsonToYaml(v, indent)}`
  }).join('\n')
}

export default function JsonToYaml() {
  const [input, setInput] = useState('{"name":"Alice","age":30,"hobbies":["reading","coding"]}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function convert() {
    try {
      const parsed = JSON.parse(input.trim())
      setOutput(jsonToYaml(parsed))
      setError('')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON to YAML</h1>
      <p className="tool-description">Convert JSON to clean YAML format.</p>

      <label htmlFor="j2y-input">Input JSON</label>
      <textarea
        id="j2y-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput(''); setError('') }}
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={convert}>Convert</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>YAML output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
