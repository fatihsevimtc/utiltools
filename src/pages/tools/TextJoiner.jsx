import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TextJoiner() {
  const [text, setText] = useState('')
  const [separator, setSeparator] = useState(', ')
  const [custom, setCustom] = useState('')
  const [skipEmpty, setSkipEmpty] = useState(true)
  const [trimLines, setTrimLines] = useState(true)
  const [wrapWith, setWrapWith] = useState('')
  const [copied, setCopied] = useState(false)

  const sep = separator === 'custom' ? custom : separator

  const result = (() => {
    let lines = text.split('\n')
    if (trimLines) lines = lines.map(l => l.trim())
    if (skipEmpty) lines = lines.filter(l => l.length > 0)
    if (wrapWith) {
      const [open, close] = wrapWith.length === 2 ? [wrapWith[0], wrapWith[1]] : [wrapWith, wrapWith]
      lines = lines.map(l => `${open}${l}${close}`)
    }
    return lines.join(sep)
  })()

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const lineCount = text.split('\n').filter(l => !skipEmpty || l.trim()).length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text Joiner</h1>
      <p className="tool-description">
        Join multiple lines into a single line using a separator of your choice. Perfect for building comma-separated lists, SQL IN clauses, and more.
      </p>

      <label htmlFor="tj-input">Lines to join (one per line)</label>
      <textarea
        id="tj-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="apple&#10;banana&#10;cherry"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="tj-sep">Separator</label>
          <select id="tj-sep" value={separator} onChange={e => setSeparator(e.target.value)}>
            <option value=", ">Comma + space (, )</option>
            <option value=",">Comma (,)</option>
            <option value=" | ">Pipe ( | )</option>
            <option value=" ">Space</option>
            <option value="\t">Tab</option>
            <option value=" + ">Plus ( + )</option>
            <option value=" & ">Ampersand ( & )</option>
            <option value="">No separator</option>
            <option value="custom">Custom…</option>
          </select>
        </div>
        {separator === 'custom' && (
          <div style={{ flex: '1 1 160px' }}>
            <label>Custom separator</label>
            <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="e.g. :: or ---" />
          </div>
        )}
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="tj-wrap">Wrap each item with</label>
          <input id="tj-wrap" value={wrapWith} onChange={e => setWrapWith(e.target.value)} placeholder={'e.g. \' or "'} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} />
          Trim whitespace
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={skipEmpty} onChange={e => setSkipEmpty(e.target.checked)} />
          Skip empty lines
        </label>
      </div>

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{lineCount} line{lineCount !== 1 ? 's' : ''} joined</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy result'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 80, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/text-joiner" />
      <ToolSeo />
    </div>
  )
}
