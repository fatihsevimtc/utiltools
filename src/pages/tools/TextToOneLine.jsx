import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TextToOneLine() {
  const [text, setText]           = useState('')
  const [collapseSpaces, setCs]   = useState(true)
  const [copied, setCopied]       = useState(false)

  const output = (() => {
    if (!text) return ''
    let out = text.replace(/[\r\n]+/g, ' ')
    if (collapseSpaces) out = out.replace(/ {2,}/g, ' ').trim()
    return out
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text to One Line</h1>
      <p className="tool-description">
        Collapse multi-line text into a single line by replacing all line breaks with a space. Useful for pasting multi-line content into single-line input fields.
      </p>

      <label htmlFor="tol-input">Input text</label>
      <textarea
        id="tol-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste multi-line text here…"
        style={{ minHeight: 180 }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', marginTop: '0.75rem', cursor: 'pointer' }}>
        <input type="checkbox" checked={collapseSpaces} onChange={e => setCs(e.target.checked)} />
        Collapse multiple spaces into one
      </label>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output (single line)</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{output}</div>
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/text-to-one-line" />
      <ToolSeo />
    </div>
  )
}
