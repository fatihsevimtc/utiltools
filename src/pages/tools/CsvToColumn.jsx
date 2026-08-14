import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function CsvToColumn() {
  const [input, setInput]         = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [custom, setCustom]       = useState('')
  const [trim, setTrim]           = useState(true)
  const [dedup, setDedup]         = useState(false)
  const [copied, setCopied]       = useState(false)

  const sep = delimiter === 'custom' ? custom : delimiter

  const output = (() => {
    if (!input.trim() || !sep) return ''
    let items = input.split(sep)
    if (trim) items = items.map(s => s.trim())
    items = items.filter(s => s !== '')
    if (dedup) items = [...new Set(items)]
    return items.join('\n')
  })()

  // Reverse: column → CSV
  const [reverseInput, setReverseInput] = useState('')
  const reverseOutput = (() => {
    if (!reverseInput.trim() || !sep) return ''
    const lines = reverseInput.split('\n').map(l => trim ? l.trim() : l).filter(l => l !== '')
    return lines.join(sep === ',' ? ', ' : sep)
  })()

  const [mode, setMode] = useState('to-column')

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const DELIMITERS = [
    { label: 'Comma (,)',     value: ',' },
    { label: 'Semicolon (;)', value: ';' },
    { label: 'Pipe (|)',      value: '|' },
    { label: 'Tab',           value: '\t' },
    { label: 'Custom',        value: 'custom' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>CSV List ↔ Column</h1>
      <p className="tool-description">
        Convert a comma-separated (or any delimiter) list into a one-item-per-line column, or convert a column back to a delimited list.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'to-column' ? 'active' : ''}`} onClick={() => setMode('to-column')}>List → Column</button>
        <button className={`chip ${mode === 'to-list' ? 'active' : ''}`} onClick={() => setMode('to-list')}>Column → List</button>
      </div>

      {/* Delimiter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Delimiter:</span>
        {DELIMITERS.map(d => (
          <button
            key={d.value}
            className={`chip ${delimiter === d.value ? 'active' : ''}`}
            onClick={() => setDelimiter(d.value)}
          >
            {d.label}
          </button>
        ))}
        {delimiter === 'custom' && (
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="e.g. ::"
            style={{ width: 80, padding: '0.3rem 0.5rem', fontSize: '0.875rem' }}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: 0 }}>
          <input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)} />
          Trim whitespace
        </label>
        {mode === 'to-column' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: 0 }}>
            <input type="checkbox" checked={dedup} onChange={e => setDedup(e.target.checked)} />
            Remove duplicates
          </label>
        )}
      </div>

      {mode === 'to-column' ? (
        <>
          <label htmlFor="csv-input">Delimited list</label>
          <textarea
            id="csv-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="apple, banana, cherry, date…"
            rows={4}
          />
          {output && (
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ marginBottom: 0 }}>Column ({output.split('\n').length} items)</label>
                <button className="btn btn-sm" onClick={() => copy(output)}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
              <textarea readOnly value={output} rows={Math.min(output.split('\n').length + 1, 15)} style={{ background: 'var(--surface)', cursor: 'default', fontFamily: 'monospace' }} />
            </div>
          )}
        </>
      ) : (
        <>
          <label htmlFor="col-input">Column (one item per line)</label>
          <textarea
            id="col-input"
            value={reverseInput}
            onChange={e => setReverseInput(e.target.value)}
            placeholder={'apple\nbanana\ncherry\ndate'}
            rows={6}
            style={{ fontFamily: 'monospace' }}
          />
          {reverseOutput && (
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ marginBottom: 0 }}>Delimited list</label>
                <button className="btn btn-sm" onClick={() => copy(reverseOutput)}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
              <div className="code-block" style={{ wordBreak: 'break-word', fontSize: '0.95rem' }}>{reverseOutput}</div>
            </div>
          )}
        </>
      )}

      <RelatedTools tools={[
        { icon: '📊', name: 'CSV → JSON',        path: '/tools/csv-to-json' },
        { icon: '📊', name: 'JSON → CSV',        path: '/tools/json-to-csv' },
        { icon: '🧹', name: 'Duplicate Remover', path: '/tools/duplicate-remover' },
        { icon: '🔗', name: 'Text Joiner',       path: '/tools/text-joiner' },
      ]} />
      <ToolSeo />
    </div>
  )
}
