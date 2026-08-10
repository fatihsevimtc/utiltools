import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// Remove all non-letter, non-digit, non-space, non-newline characters
const SPECIAL_RE = /[^a-zA-Z0-9\s]/g

export default function SpecialCharRemover() {
  const [text, setText]       = useState('')
  const [keepNewlines, setKn] = useState(true)
  const [keepSpaces, setKs]   = useState(true)
  const [copied, setCopied]   = useState(false)

  const output = (() => {
    if (!text) return ''
    let out = text.replace(SPECIAL_RE, '')
    if (!keepSpaces) out = out.replace(/ /g, '')
    if (!keepNewlines) out = out.replace(/\n/g, '')
    return out
  })()

  const removed = (text.match(SPECIAL_RE) || []).length

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Special Character Remover</h1>
      <p className="tool-description">
        Strip all special characters (punctuation, symbols) from text, keeping only letters, digits, and optionally spaces and newlines.
      </p>

      <label htmlFor="scr-input">Input text</label>
      <textarea
        id="scr-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Hello, World! @2024 — remove the special chars…"
        style={{ minHeight: 180 }}
      />

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={keepSpaces} onChange={e => setKs(e.target.checked)} />
          Keep spaces
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={keepNewlines} onChange={e => setKn(e.target.checked)} />
          Keep newlines
        </label>
      </div>

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{removed} special characters removed</span>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy result'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 180, background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/special-char-remover" />
      <ToolSeo />
    </div>
  )
}
