import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function NumberSorter() {
  const [input, setInput] = useState('')
  const [order, setOrder] = useState('asc')
  const [unique, setUnique] = useState(false)
  const [separator, setSeparator] = useState('newline')
  const [copied, setCopied] = useState(false)

  const sep = separator === 'newline' ? '\n' : separator === 'comma' ? ',' : separator === 'space' ? ' ' : ';'

  const { sorted, stats, error } = useMemo(() => {
    if (!input.trim()) return { sorted: [], stats: null, error: '' }
    const raw = input.split(/[\n,;\s]+/).map(s => s.trim()).filter(Boolean)
    const nums = []
    for (const s of raw) {
      const n = parseFloat(s.replace(/,/g, ''))
      if (isNaN(n)) return { sorted: [], stats: null, error: `"${s}" is not a valid number` }
      nums.push(n)
    }
    let result = [...nums].sort((a, b) => order === 'asc' ? a - b : b - a)
    if (unique) result = [...new Set(result)]
    const sum = result.reduce((a, b) => a + b, 0)
    return {
      sorted: result,
      stats: { count: result.length, min: result[result.length - 1 * (order === 'asc' ? 1 : 0)], max: result[result.length - 1 * (order === 'asc' ? 0 : 1)], sum, avg: sum / result.length },
      error: '',
    }
  }, [input, order, unique])

  const output = sorted.join(sep === '\n' ? '\n' : sep + ' ')

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Number Sorter</h1>
      <p className="tool-description">
        Sort a list of numbers in ascending or descending order. Supports lists separated by commas, spaces, semicolons, or new lines.
      </p>

      <label htmlFor="ns-input">Numbers (any delimiter)</label>
      <textarea
        id="ns-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="5, 2, 8, 1, 9, 3&#10;or one per line"
        style={{ minHeight: 140 }}
      />

      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.4rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label>Sort order</label>
          <select value={order} onChange={e => setOrder(e.target.value)}>
            <option value="asc">Ascending (1 → 9)</option>
            <option value="desc">Descending (9 → 1)</option>
          </select>
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label>Output separator</label>
          <select value={separator} onChange={e => setSeparator(e.target.value)}>
            <option value="newline">New line</option>
            <option value="comma">Comma</option>
            <option value="space">Space</option>
            <option value=";">Semicolon</option>
          </select>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', paddingBottom: '0.25rem' }}>
          <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} />
          Remove duplicates
        </label>
      </div>

      {sorted.length > 0 && (
        <>
          <div className="stats-row" style={{ marginTop: '1.25rem' }}>
            <div className="stat-card"><div className="stat-value">{sorted.length}</div><div className="stat-label">Count</div></div>
            <div className="stat-card"><div className="stat-value">{Math.min(...sorted)}</div><div className="stat-label">Min</div></div>
            <div className="stat-card"><div className="stat-value">{Math.max(...sorted)}</div><div className="stat-label">Max</div></div>
            <div className="stat-card"><div className="stat-value">{(sorted.reduce((a,b)=>a+b,0)/sorted.length).toFixed(2)}</div><div className="stat-label">Average</div></div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Sorted output</span>
              <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <textarea readOnly value={output} style={{ minHeight: 100, background: 'var(--surface)', cursor: 'default' }} />
          </div>
        </>
      )}

      <RelatedTools category="math" exclude="/tools/number-sorter" />
      <ToolSeo />
    </div>
  )
}
