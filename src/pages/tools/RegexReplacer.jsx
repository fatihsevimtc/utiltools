import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function RegexReplacer() {
  const [text, setText]         = useState('')
  const [pattern, setPattern]   = useState('')
  const [replacement, setRepl]  = useState('')
  const [flags, setFlags]       = useState('g')
  const [copied, setCopied]     = useState(false)

  let error = ''
  let output = ''
  if (text && pattern) {
    try {
      const re = new RegExp(pattern, flags)
      output = text.replace(re, replacement)
    } catch (e) {
      error = e.message
    }
  }

  function toggleFlag(f) {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)
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
      <h1>Regex Replacer</h1>
      <p className="tool-description">
        Apply a regular expression find-and-replace to any text. Supports capture group references like <code>$1</code> in the replacement.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label htmlFor="rr-pattern">Find (regex)</label>
          <input
            id="rr-pattern"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="(\w+)"
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
        <div>
          <label htmlFor="rr-repl">Replace with</label>
          <input
            id="rr-repl"
            value={replacement}
            onChange={e => setRepl(e.target.value)}
            placeholder="[$1]"
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
      </div>

      <div className="chip-group" style={{ marginTop: '0.5rem' }}>
        {['g', 'i', 'm', 's'].map(f => (
          <button key={f} className={`chip ${flags.includes(f) ? 'active' : ''}`} onClick={() => toggleFlag(f)}>
            /{f}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'var(--danger, red)', fontSize: '0.83rem', marginTop: '0.4rem' }}>⚠ {error}</p>}

      <label htmlFor="rr-input" style={{ marginTop: '0.75rem' }}>Input text</label>
      <textarea
        id="rr-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 180, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 180, fontFamily: 'monospace', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/regex-replacer" />
      <ToolSeo />
    </div>
  )
}
