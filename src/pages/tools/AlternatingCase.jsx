import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function alternating(text, startUpper = true) {
  let toggle = startUpper
  return text.split('').map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const out = toggle ? c.toUpperCase() : c.toLowerCase()
      toggle = !toggle
      return out
    }
    return c
  }).join('')
}

function sarcastic(text) {
  // Based on letter position (ignores non-alpha)
  let idx = 0
  return text.split('').map(c => {
    if (/[a-zA-Z]/.test(c)) {
      return (idx++ % 2 === 0) ? c.toLowerCase() : c.toUpperCase()
    }
    return c
  }).join('')
}

export default function AlternatingCase() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('alt-upper') // alt-upper | alt-lower | sarcastic | inverse
  const [copied, setCopied] = useState(false)

  const result = (() => {
    if (!text) return ''
    switch (mode) {
      case 'alt-upper': return alternating(text, true)
      case 'alt-lower': return alternating(text, false)
      case 'sarcastic': return sarcastic(text)
      case 'inverse': return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
      default: return text
    }
  })()

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Alternating Case Converter</h1>
      <p className="tool-description">
        Convert text to AlTeRnAtInG cAsE, sarcastic case, or invert the current capitalisation of any text.
      </p>

      <label htmlFor="ac-input">Input text</label>
      <textarea
        id="ac-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text here…"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {[
          ['alt-upper', 'AlTeRnAtInG (Upper first)'],
          ['alt-lower', 'aLtErNaTiNg (Lower first)'],
          ['sarcastic', 'sArCaStIc'],
          ['inverse', 'Invert case'],
        ].map(([id, label]) => (
          <button key={id} className={`btn ${mode === id ? '' : 'btn-ghost'} btn-sm`} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Result</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 120, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/alternating-case" />
      <ToolSeo />
    </div>
  )
}
