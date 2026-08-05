import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

function factorial(n) {
  if (n < 0) return null
  let result = BigInt(1)
  for (let i = 2; i <= n; i++) result *= BigInt(i)
  return result
}

function permutations(n, r) {
  if (r > n) return BigInt(0)
  return factorial(n) / factorial(n - r)
}

function combinations(n, r) {
  if (r > n) return BigInt(0)
  return factorial(n) / (factorial(r) * factorial(n - r))
}

export default function FactorialCalculator() {
  const [n, setN] = useState('10')
  const [r, setR] = useState('3')

  const nVal = parseInt(n)
  const rVal = parseInt(r)
  const validN = !isNaN(nVal) && nVal >= 0 && nVal <= 170
  const validR = !isNaN(rVal) && rVal >= 0

  const result = useMemo(() => {
    if (!validN) return null
    return factorial(nVal)
  }, [nVal, validN])

  const perm = useMemo(() => {
    if (!validN || !validR) return null
    return permutations(nVal, rVal)
  }, [nVal, rVal, validN, validR])

  const comb = useMemo(() => {
    if (!validN || !validR) return null
    return combinations(nVal, rVal)
  }, [nVal, rVal, validN, validR])

  // Steps for small n
  const steps = validN && nVal <= 15
    ? Array.from({ length: nVal }, (_, i) => i + 1).join(' × ') + (nVal === 0 ? '1' : '') + ' = ' + (result?.toString() ?? '')
    : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Factorial Calculator</h1>
      <p className="tool-description">Calculate factorials, permutations, and combinations.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label htmlFor="fact-n">n (0–170)</label>
          <input id="fact-n" type="number" min={0} max={170} value={n} onChange={e => setN(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label htmlFor="fact-r">r (for P/C)</label>
          <input id="fact-r" type="number" min={0} value={r} onChange={e => setR(e.target.value)} />
        </div>
      </div>

      {!validN && n && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.875rem' }}>n must be between 0 and 170</p>}

      {result !== null && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>{nVal}! (factorial)</div>
            <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.95rem', color: 'var(--accent)' }}>{result.toString()}</div>
            {steps && <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{steps}</div>}
          </div>

          {perm !== null && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>P({nVal},{rVal}) — Permutations</div>
                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '1rem', fontWeight: 700 }}>{perm.toString()}</div>
              </div>
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>C({nVal},{rVal}) — Combinations</div>
                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '1rem', fontWeight: 700 }}>{comb?.toString()}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
