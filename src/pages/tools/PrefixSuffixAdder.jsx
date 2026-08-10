import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PrefixSuffixAdder() {
  const [text, setText] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [skipEmpty, setSkipEmpty] = useState(true)
  const [copied, setCopied] = useState(false)

  const lines = text.split('\n')
  const result = lines
    .map(line => {
      if (skipEmpty && line.trim() === '') return line
      return `${prefix}${line}${suffix}`
    })
    .join('\n')

  const changedCount = lines.filter(l => !skipEmpty || l.trim() !== '').length

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Prefix / Suffix Adder</h1>
      <p className="tool-description">
        Add text before (prefix) or after (suffix) every line. Great for bulk quoting, wrapping items in tags, or building SQL lists.
      </p>

      <label htmlFor="psa-input">Lines of text</label>
      <textarea
        id="psa-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="apple&#10;banana&#10;cherry"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="psa-prefix">Prefix (added before each line)</label>
          <input id="psa-prefix" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. &quot; or - or SELECT " />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="psa-suffix">Suffix (added after each line)</label>
          <input id="psa-suffix" value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="e.g. , or &quot; or ;" />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.6rem' }}>
        <input type="checkbox" checked={skipEmpty} onChange={e => setSkipEmpty(e.target.checked)} />
        Skip blank lines
      </label>

      {text && (prefix || suffix) && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{changedCount} line{changedCount !== 1 ? 's' : ''} modified</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy result'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 140, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/prefix-suffix" />
      <ToolSeo />
    </div>
  )
}
