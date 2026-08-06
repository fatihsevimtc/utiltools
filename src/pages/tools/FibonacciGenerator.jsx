import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

function fibonacci(n) {
  const seq = [BigInt(0), BigInt(1)]
  for (let i = 2; i <= n; i++) seq.push(seq[i - 1] + seq[i - 2])
  return seq.slice(0, n + 1)
}

export default function FibonacciGenerator() {
  const [count, setCount] = useState(20)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const seq = useMemo(() => fibonacci(Math.min(count, 200)), [count])

  const searchResult = useMemo(() => {
    const n = BigInt(search.trim())
    if (isNaN(Number(search.trim())) || !search.trim()) return null
    const idx = seq.findIndex(v => v === n)
    return idx === -1 ? { found: false } : { found: true, index: idx }
  }, [search, seq])

  function copy() {
    navigator.clipboard.writeText(seq.map((v, i) => `F(${i}) = ${v}`).join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Fibonacci Generator</h1>
      <p className="tool-description">Generate Fibonacci numbers and check if a number belongs to the sequence.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label>Count: {count}</label>
          <input
            type="range" min={5} max={200} value={count}
            onChange={e => setCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label htmlFor="fib-search">Check if number is in sequence</label>
          <input id="fib-search" type="number" min={0} value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g. 144" />
        </div>
      </div>

      {search.trim() && searchResult !== null && (
        <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', borderRadius: 8, background: 'var(--surface)', border: `1px solid ${searchResult.found ? 'var(--success)' : 'var(--danger)'}`, fontSize: '0.9rem' }}>
          {searchResult.found
            ? <span style={{ color: 'var(--success)' }}>✅ {search} is F({searchResult.index})</span>
            : <span style={{ color: 'var(--danger)' }}>❌ {search} is not in the first {count} Fibonacci numbers</span>
          }
        </div>
      )}

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>F(0) … F({count})</label>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
        </div>
        <div className="code-block" style={{ maxHeight: 320, overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.82rem' }}>
          {seq.map((v, i) => `F(${i.toString().padStart(3, ' ')}) = ${v}`).join('\n')}
        </div>
      </div>
      <RelatedTools category="math" exclude="/tools/fibonacci" />
    </div>
  )
}
