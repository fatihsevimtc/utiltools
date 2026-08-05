import { useState } from 'react'
import BackBar from '../../components/BackBar'

function xmlNodeToObj(node) {
  if (node.nodeType === 3) return node.nodeValue.trim()
  const obj = {}
  // Attributes
  if (node.attributes && node.attributes.length > 0) {
    obj['@attributes'] = {}
    for (const attr of node.attributes) {
      obj['@attributes'][attr.name] = attr.value
    }
  }
  for (const child of node.childNodes) {
    if (child.nodeType === 8) continue // comment
    const val = xmlNodeToObj(child)
    if (val === '') continue
    if (child.nodeType === 3) {
      if (val) return val
      continue
    }
    const key = child.nodeName
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]]
      obj[key].push(val)
    } else {
      obj[key] = val
    }
  }
  return obj
}

export default function XmlToJson() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function convert() {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input.trim(), 'application/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) throw new Error('Invalid XML: ' + parseError.textContent.slice(0, 120))
      const root = doc.documentElement
      const result = { [root.nodeName]: xmlNodeToObj(root) }
      setOutput(JSON.stringify(result, null, 2))
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
      <h1>XML to JSON</h1>
      <p className="tool-description">Convert XML to a JSON representation in your browser.</p>

      <label htmlFor="x2j-input">Input XML</label>
      <textarea
        id="x2j-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput(''); setError('') }}
        placeholder="<person><name>Alice</name><age>30</age></person>"
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={convert}>Convert</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>JSON output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
