import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TextSplitter() {
  const [text, setText] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [custom, setCustom] = useState('')
  const [trimParts, setTrimParts] = useState(true)
  const [skipEmpty, setSkipEmpty] = useState(true)
  const [copied, setCopied] = useState(false)

  const sep = delimiter === 'custom' ? custom : delimiter

  const parts = (() => {
    if (!text.trim() || !sep) return []
    let result = text.split(sep)
    if (trimParts) result = result.map(p => p.trim())
    if (skipEmpty) result = result.filter(p => p.length > 0)
    return result
  })()

  function copy() {
    navigator.clipboard.writeText(parts.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text Splitter</h1>
      <p className="tool-description">
        Split any text or list into separate parts using a delimiter of your choice. Runs entirely in your browser.
      </p>

      <label htmlFor="ts-input">Input text</label>
      <textarea
        id="ts-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="apple, banana, cherry&#10;or paste any text here"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '0.5rem' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="ts-delim">Split by</label>
          <select id="ts-delim" value={delimiter} onChange={e => setDelimiter(e.target.value)}>
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\n">New line</option>
            <option value="|">Pipe (|)</option>
            <option value="\t">Tab</option>
            <option value=" ">Space</option>
            <option value="custom">Custom…</option>
          </select>
        </div>
        {delimiter === 'custom' && (
          <div style={{ flex: '1 1 180px' }}>
            <label htmlFor="ts-custom">Custom delimiter</label>
            <input id="ts-custom" value={custom} onChange={e => setCustom(e.target.value)} placeholder="e.g. :: or ---" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={trimParts} onChange={e => setTrimParts(e.target.checked)} />
          Trim whitespace
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={skipEmpty} onChange={e => setSkipEmpty(e.target.checked)} />
          Skip empty parts
        </label>
      </div>

      {parts.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{parts.length} part{parts.length !== 1 ? 's' : ''}</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {parts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.7rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 7 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', minWidth: 22, textAlign: 'right' }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: '0.9rem', wordBreak: 'break-all' }}>{p}</span>
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => navigator.clipboard.writeText(p)}
                >Copy</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/text-splitter" />
      <ToolSeo />
    </div>
  )
}
