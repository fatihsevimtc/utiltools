import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function WrapText() {
  const [text, setText]     = useState('')
  const [width, setWidth]   = useState(80)
  const [copied, setCopied] = useState(false)

  function wrapLine(line, maxW) {
    const words = line.split(' ')
    const lines = []
    let current = ''
    for (const word of words) {
      if (!current) { current = word; continue }
      if ((current + ' ' + word).length <= maxW) {
        current += ' ' + word
      } else {
        lines.push(current)
        current = word
      }
    }
    if (current) lines.push(current)
    return lines.join('\n')
  }

  const output = text ? text.split('\n').map(l => wrapLine(l, width)).join('\n') : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Wrap Text</h1>
      <p className="tool-description">
        Hard-wrap text at a specified column width. Useful for formatting code comments, emails, and plain-text documents.
      </p>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
        Wrap at column:
        <input
          type="number"
          value={width}
          min={10}
          max={500}
          onChange={e => setWidth(Number(e.target.value))}
          style={{ width: 70 }}
        />
      </label>

      <label htmlFor="wt-input">Input text</label>
      <textarea
        id="wt-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste long text to wrap…"
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

      <RelatedTools category="text" exclude="/tools/wrap-text" />
      <ToolSeo />
    </div>
  )
}
