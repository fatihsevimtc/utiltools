import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function JsonKeySorter() {
  const [input, setInput]   = useState('')
  const [order, setOrder]   = useState('asc')
  const [error, setError]   = useState('')
  const [copied, setCopied] = useState(false)

  function sortKeys(obj, dir) {
    if (Array.isArray(obj)) return obj.map(v => sortKeys(v, dir))
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj).sort((a, b) =>
        dir === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      )
      return Object.fromEntries(keys.map(k => [k, sortKeys(obj[k], dir)]))
    }
    return obj
  }

  let output = ''
  if (input.trim()) {
    try {
      const parsed = JSON.parse(input)
      output = JSON.stringify(sortKeys(parsed, order), null, 2)
      if (error) setError('')
    } catch (e) {
      output = ''
      if (!error) setError(e.message)
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON Key Sorter</h1>
      <p className="tool-description">
        Alphabetically sort all keys in a JSON object — recursively through nested objects. Useful for normalising configs and making diffs cleaner.
      </p>

      <div className="chip-group" style={{ marginBottom: '0.75rem' }}>
        <button className={`chip ${order === 'asc' ? 'active' : ''}`} onClick={() => setOrder('asc')}>A → Z</button>
        <button className={`chip ${order === 'desc' ? 'active' : ''}`} onClick={() => setOrder('desc')}>Z → A</button>
      </div>

      <label htmlFor="jks-input">Input JSON</label>
      <textarea
        id="jks-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"z": 1, "a": 2, "m": 3}'
        style={{ minHeight: 200, fontFamily: 'monospace' }}
      />

      {error && <p style={{ color: 'var(--danger, #ef4444)', fontSize: '0.83rem', marginTop: '0.4rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Sorted JSON</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 200, fontFamily: 'monospace', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/json-key-sorter" />
      <ToolSeo />
    </div>
  )
}
