import { useState } from 'react'
import BackBar from '../../components/BackBar'

function objToXml(obj, rootKey = 'root', indent = 0) {
  const tab = '  '.repeat(indent)
  if (typeof obj !== 'object' || obj === null) {
    return `${tab}<${rootKey}>${String(obj)}</${rootKey}>`
  }
  if (Array.isArray(obj)) {
    return obj.map(item => objToXml(item, rootKey, indent)).join('\n')
  }
  const children = Object.entries(obj)
    .map(([k, v]) => objToXml(v, k, indent + 1))
    .join('\n')
  return `${tab}<${rootKey}>\n${children}\n${tab}</${rootKey}>`
}

export default function JsonToXml() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function convert() {
    try {
      const parsed = JSON.parse(input.trim())
      const keys = typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed) : null
      let xml
      if (keys && keys.length === 1) {
        xml = objToXml(parsed[keys[0]], keys[0])
      } else {
        xml = objToXml(parsed, 'root')
      }
      setOutput('<?xml version="1.0" encoding="UTF-8"?>\n' + xml)
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
      <h1>JSON to XML</h1>
      <p className="tool-description">Convert a JSON object to formatted XML markup.</p>

      <label htmlFor="j2x-input">Input JSON</label>
      <textarea
        id="j2x-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput(''); setError('') }}
        placeholder='{"person":{"name":"Alice","age":30}}'
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={convert}>Convert</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>XML output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
