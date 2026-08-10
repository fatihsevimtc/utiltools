import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TruncateText() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('chars') // chars | words | lines
  const [limit, setLimit] = useState(150)
  const [ellipsis, setEllipsis] = useState('…')
  const [trimFirst, setTrimFirst] = useState(true)
  const [copied, setCopied] = useState(false)

  const source = trimFirst ? text.trim() : text

  const result = (() => {
    if (!source) return ''
    const n = Math.max(1, limit)
    if (mode === 'chars') {
      if (source.length <= n) return source
      return source.slice(0, n).trimEnd() + ellipsis
    }
    if (mode === 'words') {
      const words = source.split(/\s+/)
      if (words.length <= n) return source
      return words.slice(0, n).join(' ') + ellipsis
    }
    if (mode === 'lines') {
      const lines = source.split('\n')
      if (lines.length <= n) return source
      return lines.slice(0, n).join('\n') + ellipsis
    }
    return source
  })()

  const original = mode === 'chars' ? source.length + ' chars'
    : mode === 'words' ? source.split(/\s+/).filter(Boolean).length + ' words'
    : source.split('\n').length + ' lines'

  const truncated = mode === 'chars' ? result.replace(ellipsis, '').length + ' chars'
    : mode === 'words' ? result.replace(ellipsis, '').split(/\s+/).filter(Boolean).length + ' words'
    : result.split('\n').length + ' lines'

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Truncate Text</h1>
      <p className="tool-description">
        Trim text to a maximum number of characters, words, or lines. Optionally append a custom ellipsis. All processing happens locally.
      </p>

      <label htmlFor="tt-input">Input text</label>
      <textarea
        id="tt-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 160 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label>Limit by</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="chars">Characters</option>
            <option value="words">Words</option>
            <option value="lines">Lines</option>
          </select>
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label htmlFor="tt-limit">Max {mode}</label>
          <input
            id="tt-limit"
            type="number"
            min={1}
            value={limit}
            onChange={e => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="tt-ellipsis">Ellipsis</label>
          <input id="tt-ellipsis" value={ellipsis} onChange={e => setEllipsis(e.target.value)} placeholder="… or [read more]" />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.6rem' }}>
        <input type="checkbox" checked={trimFirst} onChange={e => setTrimFirst(e.target.checked)} />
        Trim leading/trailing whitespace first
      </label>

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {original} → {truncated}
            </span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy result'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 120, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/truncate-text" />
      <ToolSeo />
    </div>
  )
}
