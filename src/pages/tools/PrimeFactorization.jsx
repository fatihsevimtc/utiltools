import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PrimeFactor() {
  const [input, setInput] = useState('')

  function primeFactors(n) {
    if (n < 2) return []
    const factors = []
    let d = 2
    while (d * d <= n) {
      while (n % d === 0) { factors.push(d); n = Math.floor(n / d) }
      d++
    }
    if (n > 1) factors.push(n)
    return factors
  }

  const n = parseInt(input)
  const valid = !isNaN(n) && n >= 2 && n <= 1e12
  const factors = valid ? primeFactors(n) : []

  // Group for display: 12 = 2² × 3
  const grouped = factors.reduce((acc, f) => {
    acc[f] = (acc[f] || 0) + 1
    return acc
  }, {})

  const expr = Object.entries(grouped).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ')

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Prime Factorization</h1>
      <p className="tool-description">
        Find all prime factors of any integer. See each prime factor with its exponent and the full factorization expression.
      </p>

      <label htmlFor="pf-input">Enter a number (2 – 1,000,000,000,000)</label>
      <input
        id="pf-input"
        type="number"
        min="2"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="360"
        style={{ maxWidth: 260 }}
      />

      {input && !valid && (
        <p style={{ color: 'var(--danger, #ef4444)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Please enter an integer between 2 and 1,000,000,000,000.</p>
      )}

      {valid && factors.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'monospace' }}>
            {n} = {expr}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(grouped).map(([p, e]) => (
              <div key={p} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.6rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{p}</div>
                {e > 1 && <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>exponent {e}</div>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
            {factors.length} prime factors ({Object.keys(grouped).length} unique)
          </p>
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/prime-factorization" />
      <ToolSeo />
    </div>
  )
}
