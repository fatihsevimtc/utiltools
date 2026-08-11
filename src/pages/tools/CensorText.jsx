import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function censorText(text, style) {
  // Only censor non-space characters
  const markers = { block: '█', asterisk: '*', hash: '#', redact: '[REDACTED]' }
  if (style === 'redact') {
    return text.replace(/\S+/g, '[REDACTED]')
  }
  const ch = markers[style] || '█'
  return text.split('').map(c => c === ' ' || c === '\n' ? c : ch).join('')
}

export default function CensorText() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState('block')
  const [copied, setCopied] = useState(false)

  const output = text ? censorText(text, style) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const STYLES = [
    { id: 'block',    label: '█ Block' },
    { id: 'asterisk', label: '* Asterisk' },
    { id: 'hash',     label: '# Hash' },
    { id: 'redact',   label: '[REDACTED]' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Censor Text</h1>
      <p className="tool-description">
        Redact or black out text by replacing characters with blocks, asterisks, or [REDACTED] markers. Useful for screenshots, demos, and sensitive content.
      </p>

      <div className="chip-group" style={{ marginBottom: '0.75rem' }}>
        {STYLES.map(s => (
          <button key={s.id} className={`chip ${style === s.id ? 'active' : ''}`} onClick={() => setStyle(s.id)}>{s.label}</button>
        ))}
      </div>

      <label htmlFor="ct-input">Input text</label>
      <textarea
        id="ct-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type sensitive text here…"
        style={{ minHeight: 160 }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Censored output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', letterSpacing: style === 'block' ? '0.05em' : undefined }}>{output}</div>
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/censor-text" />
      <ToolSeo />
    </div>
  )
}
