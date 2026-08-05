import { useState } from 'react'
import BackBar from '../../components/BackBar'

function isPrime(n) {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

function getFactors(n) {
  const factors = []
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i)
      if (i !== n / i) factors.push(n / i)
    }
  }
  return factors.sort((a, b) => a - b)
}

function primeFactors(n) {
  const result = []
  let d = 2
  while (n > 1) {
    let count = 0
    while (n % d === 0) { n /= d; count++ }
    if (count > 0) result.push({ p: d, e: count })
    d++
  }
  return result
}

function nthPrimes(count) {
  const primes = []
  let n = 2
  while (primes.length < count) {
    if (isPrime(n)) primes.push(n)
    n++
  }
  return primes
}

export default function PrimeChecker() {
  const [input, setInput] = useState('')
  const [listCount, setListCount] = useState(20)

  const n = parseInt(input)
  const valid = !isNaN(n) && n >= 0 && n <= 1e9
  const prime = valid ? isPrime(n) : null
  const factors = valid && n > 1 ? getFactors(n) : []
  const pf = valid && n > 1 ? primeFactors(n) : []
  const primes = nthPrimes(listCount)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Prime Checker</h1>
      <p className="tool-description">Check if a number is prime, see its factors, and browse the first N prime numbers.</p>

      <label htmlFor="prime-input">Enter a number (up to 1 billion)</label>
      <input
        id="prime-input"
        type="number"
        min={0}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="17"
      />

      {valid && prime !== null && (
        <div style={{ marginTop: '1.25rem', textAlign: 'center', padding: '1.5rem', background: 'var(--surface)', borderRadius: 12, border: '2px solid', borderColor: prime ? 'var(--success)' : 'var(--muted)' }}>
          <div style={{ fontSize: '2.5rem' }}>{prime ? '✅' : '🔢'}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem', color: prime ? 'var(--success)' : 'var(--text)' }}>
            {n} is {prime ? 'a prime number' : 'not prime'}
          </div>
          {!prime && n > 1 && (
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
              Divisors: {factors.join(', ')}
            </div>
          )}
        </div>
      )}

      {pf.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>Prime factorization</label>
          <div className="code-block" style={{ fontFamily: 'inherit', fontSize: '1.1rem' }}>
            {n} = {pf.map(({ p, e }) => e > 1 ? `${p}^${e}` : `${p}`).join(' × ')}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label style={{ marginBottom: 0 }}>First {listCount} prime numbers</label>
          <select value={listCount} onChange={e => setListCount(Number(e.target.value))} style={{ width: 'auto', padding: '0.2rem 0.5rem' }}>
            {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {primes.map(p => (
            <span
              key={p}
              onClick={() => setInput(String(p))}
              style={{
                padding: '0.2rem 0.6rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem',
                background: p === n ? 'var(--accent)' : 'var(--surface)',
                color: p === n ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
