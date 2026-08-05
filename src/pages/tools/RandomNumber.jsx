import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function RandomNumber() {
  const [min, setMin]       = useState(1)
  const [max, setMax]       = useState(100)
  const [count, setCount]   = useState(1)
  const [unique, setUnique] = useState(false)
  const [results, setResults] = useState([])

  function generate() {
    const lo = Number(min), hi = Number(max), n = Math.min(Number(count), 1000)
    if (lo >= hi) return
    if (unique) {
      const pool = []
      for (let i = lo; i <= hi; i++) pool.push(i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
      }
      setResults(pool.slice(0, Math.min(n, pool.length)))
    } else {
      setResults(Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo))
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Random Number Generator</h1>
      <p className="tool-description">Generate random numbers within a range. Optionally unique (no repeats).</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        {[['Min', min, setMin], ['Max', max, setMax], ['Count', count, setCount]].map(([label, val, setter]) => (
          <div key={label} style={{ flex: '1 1 90px' }}>
            <label>{label}</label>
            <input type="number" value={val} onChange={e => setter(Number(e.target.value))} />
          </div>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', cursor: 'pointer', paddingBottom: '0.65rem' }}>
          <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
          Unique
        </label>
        <button className="btn" onClick={generate} style={{ flexShrink: 0 }}>Generate</button>
      </div>

      {results.length > 0 && (
        <>
          {results.length === 1
            ? <div className="stat-card" style={{ display: 'inline-block' }}>
                <div className="stat-value" style={{ fontSize: '3rem' }}>{results[0]}</div>
                <div className="stat-label">Random number</div>
              </div>
            : <div className="code-block">{results.join(', ')}</div>
          }
        </>
      )}
    </div>
  )
}
