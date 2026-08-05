import { useState } from 'react'
import BackBar from '../../components/BackBar'

function formatXML(xml) {
  const tab = '  '
  let formatted = ''
  let indent = 0
  const tokens = xml
    .replace(/>\s*</g, '><')
    .split(/(<[^>]+>)/)
    .filter(t => t.trim())

  for (const token of tokens) {
    if (token.match(/^<\/[^>]+>$/)) {
      indent = Math.max(0, indent - 1)
      formatted += tab.repeat(indent) + token + '\n'
    } else if (token.match(/^<[^/!][^>]*[^/]>$/) && !token.match(/^<[^>]+\/>$/)) {
      formatted += tab.repeat(indent) + token + '\n'
      indent++
    } else if (token.match(/^<[^>]+\/>$/) || token.match(/^<![^>]*>$/)) {
      formatted += tab.repeat(indent) + token + '\n'
    } else {
      if (token.trim()) {
        formatted += tab.repeat(indent) + token.trim() + '\n'
      }
    }
  }
  return formatted.trim()
}

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function format() {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input, 'application/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) throw new Error(parseError.textContent)
      setOutput(formatXML(input))
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
      <h1>XML Formatter</h1>
      <p className="tool-description">Validate and prettify XML with proper indentation.</p>

      <label htmlFor="xml-input">Input XML</label>
      <textarea
        id="xml-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput(''); setError('') }}
        placeholder="<root><item>value</item></root>"
        style={{ minHeight: 180, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={format}>Format XML</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Formatted output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
