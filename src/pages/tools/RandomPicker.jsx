import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function RandomPicker() {
  const [items, setItems] = useState('')
  const [pickCount, setPickCount] = useState(1)
  const [allowDupes, setAllowDupes] = useState(false)
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)

  const list = items.split('\n').map(l => l.trim()).filter(Boolean)

  const pick = useCallback(() => {
    if (list.length === 0) return
    const n = Math.min(pickCount, allowDupes ? Infinity : list.length)
    const picked = []
    const pool = [...list]
    for (let i = 0; i < n; i++) {
      if (pool.length === 0) break
      const idx = Math.floor(Math.random() * pool.length)
      picked.push(pool[idx])
      if (!allowDupes) pool.splice(idx, 1)
    }
    setResults(picked)
    setHistory(prev => [picked, ...prev].slice(0, 10))
  }, [list, pickCount, allowDupes])

  function copy() {
    navigator.clipboard.writeText(results.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Random Picker</h1>
      <p className="tool-description">
        Pick one or more random items from any list. Great for raffles, team selections, random assignments, and decision-making.
      </p>

      <label htmlFor="rp-items">Your list (one item per line)</label>
      <textarea
        id="rp-items"
        value={items}
        onChange={e => setItems(e.target.value)}
        placeholder="Alice&#10;Bob&#10;Carol&#10;Dave&#10;Eve"
        style={{ minHeight: 160 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="rp-count" style={{ marginBottom: 0, fontSize: '0.875rem' }}>Pick</label>
          <input
            id="rp-count"
            type="number"
            min={1}
            max={allowDupes ? 1000 : list.length || 1}
            value={pickCount}
            onChange={e => setPickCount(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: 70 }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>of {list.length} items</span>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={allowDupes} onChange={e => setAllowDupes(e.target.checked)} />
          Allow duplicates
        </label>
      </div>

      <button
        className="btn"
        onClick={pick}
        disabled={list.length === 0}
        style={{ marginTop: '1rem', fontSize: '1.05rem', padding: '0.65rem 2rem' }}
      >
        🎲 Pick randomly
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontWeight: 600, fontSize: '1rem' }}>Result{results.length > 1 ? 's' : ''}</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {results.map((r, i) => (
              <span key={i} style={{ padding: '0.5rem 1rem', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem' }}>{r}</span>
            ))}
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Recent picks</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {history.slice(1).map((h, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '0.3rem 0.6rem', background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
                {h.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools category="generators" exclude="/tools/random-picker" />
      <ToolSeo />
    </div>
  )
}
