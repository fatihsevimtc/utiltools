import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// Matches most emoji using Unicode property escapes
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}|\u{FE0F}|\u{20E3}|\u{FE0E}/gu

export default function EmojiRemover() {
  const [text, setText] = useState('')
  const [collapseSpaces, setCollapseSpaces] = useState(true)
  const [copied, setCopied] = useState(false)

  const result = (() => {
    let out = text.replace(EMOJI_RE, '')
    if (collapseSpaces) out = out.replace(/  +/g, ' ').replace(/^ | $/gm, '')
    return out
  })()

  const removedCount = (text.match(EMOJI_RE) || []).length

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Emoji Remover</h1>
      <p className="tool-description">
        Strip all emoji characters from any text instantly. Useful for cleaning data, preparing formal documents, or pasting into systems that don't support emoji.
      </p>

      <label htmlFor="er-input">Input text</label>
      <textarea
        id="er-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text with emoji here 🎉🚀✨…"
        style={{ minHeight: 160 }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.5rem' }}>
        <input type="checkbox" checked={collapseSpaces} onChange={e => setCollapseSpaces(e.target.checked)} />
        Collapse extra spaces left behind
      </label>

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {removedCount} emoji removed
            </span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy result'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 160, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/emoji-remover" />
      <ToolSeo />
    </div>
  )
}
