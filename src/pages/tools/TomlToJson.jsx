import { useState } from 'react'
import BackBar from '../../components/BackBar'

function parseToml(src) {
  const obj = {}
  let current = obj
  let currentKey = null

  const lines = src.split('\n')
  for (let raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue

    // Table header [section]
    if (line.startsWith('[') && line.endsWith(']')) {
      const key = line.slice(1, -1).trim()
      obj[key] = obj[key] || {}
      current = obj[key]
      currentKey = key
      continue
    }

    // Key = value
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    const rawVal = line.slice(eqIdx + 1).trim()

    let val
    if (rawVal.startsWith('"') || rawVal.startsWith("'")) {
      val = rawVal.slice(1, -1)
    } else if (rawVal === 'true') {
      val = true
    } else if (rawVal === 'false') {
      val = false
    } else if (rawVal.startsWith('[')) {
      try {
        val = JSON.parse(rawVal.replace(/'/g, '"'))
      } catch {
        val = rawVal
      }
    } else if (!isNaN(rawVal)) {
      val = rawVal.includes('.') ? parseFloat(rawVal) : parseInt(rawVal, 10)
    } else {
      val = rawVal
    }
    current[key] = val
  }
  return obj
}

export default function TomlToJson() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  let output = ''
  if (input) {
    try {
      output = JSON.stringify(parseToml(input), null, 2)
      if (error) setError('')
    } catch (e) {
      output = ''
      setError(e.message)
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
      <h1>TOML to JSON</h1>
      <p className="tool-description">Convert TOML configuration files to JSON format in your browser.</p>

      <label htmlFor="toml-input">TOML input</label>
      <textarea
        id="toml-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'title = "My App"\nversion = 1\n\n[database]\nhost = "localhost"\nport = 5432'}
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {error && <p style={{ color: 'var(--danger, #ef4444)', marginTop: '0.5rem' }}>{error}</p>}

      {output && !error && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>JSON output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
