import { useState } from 'react'
import BackBar from '../../components/BackBar'

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b)
  while (b) { [a, b] = [b, a % b] }
  return a
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b)
}

function gcdSteps(a, b) {
  const steps = []
  a = Math.abs(a); b = Math.abs(b)
  while (b) {
    const q = Math.floor(a / b), r = a % b
    steps.push({ a, b, q, r })
    ;[a, b] = [b, r]
  }
  steps.push({ a, b: 0, q: null, r: null, final: true })
  return steps
}

export default function GcdLcm() {
  const [a, setA] = useState('48')
  const [b, setB] = useState('18')
  const [showSteps, setShowSteps] = useState(false)

  const na = parseInt(a), nb = parseInt(b)
  const valid = !isNaN(na) && !isNaN(nb) && na > 0 && nb > 0

  const g = valid ? gcd(na, nb) : null
  const l = valid ? lcm(na, nb) : null
  const steps = valid && showSteps ? gcdSteps(na, nb) : []

  return (
    <div className="tool-page">
      <BackBar />
      <h1>GCD / LCM Calculator</h1>
      <p className="tool-description">Find the Greatest Common Divisor and Least Common Multiple of two integers.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label htmlFor="gcd-a">First number</label>
          <input id="gcd-a" type="number" min={1} value={a} onChange={e => setA(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label htmlFor="gcd-b">Second number</label>
          <input id="gcd-b" type="number" min={1} value={b} onChange={e => setB(e.target.value)} />
        </div>
      </div>

      {valid && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>GCD (Greatest Common Divisor)</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>{g}</div>
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>LCM (Least Common Multiple)</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>{l}</div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', cursor: 'pointer', color: 'var(--text)' }}>
            <input type="checkbox" checked={showSteps} onChange={e => setShowSteps(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
            Show Euclidean algorithm steps
          </label>

          {showSteps && steps.length > 0 && (
            <div className="code-block" style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {steps.map((s, i) =>
                s.final
                  ? `GCD = ${s.a}`
                  : `${s.a} = ${s.q} × ${s.b} + ${s.r}`
              ).join('\n')}
            </div>
          )}
        </>
      )}
    </div>
  )
}
