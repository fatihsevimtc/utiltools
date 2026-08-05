import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate]           = useState('5')     // annual %
  const [years, setYears]         = useState('5')

  const result = useMemo(() => {
    const P = parseFloat(principal)
    const r = parseFloat(rate) / 100 / 12
    const n = parseFloat(years) * 12
    if (!P || !r || !n || P <= 0 || n <= 0) return null
    if (r === 0) {
      const monthly = P / n
      return { monthly, totalPayment: P, totalInterest: 0 }
    }
    const monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = monthly * n
    const totalInterest = totalPayment - P
    return { monthly, totalPayment, totalInterest }
  }, [principal, rate, years])

  const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Loan Calculator</h1>
      <p className="tool-description">Calculate monthly payments and total interest for any loan.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
        <div>
          <label htmlFor="loan-p">Loan amount ($)</label>
          <input id="loan-p" type="number" min={1} value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label htmlFor="loan-r">Annual interest rate (%)</label>
          <input id="loan-r" type="number" min={0} step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="loan-y">Loan term (years)</label>
          <input id="loan-y" type="number" min={1} value={years} onChange={e => setYears(e.target.value)} />
        </div>
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
            {[
              ['Monthly payment', fmt(result.monthly)],
              ['Total payment', fmt(result.totalPayment)],
              ['Total interest', fmt(result.totalInterest)],
            ].map(([label, val]) => (
              <div key={label} style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>{val}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Simple bar showing principal vs interest */}
          <div style={{ marginTop: '1.5rem' }}>
            <label>Principal vs interest breakdown</label>
            <div style={{ display: 'flex', height: 20, borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ flex: parseFloat(principal), background: 'var(--accent)' }} />
              <div style={{ flex: result.totalInterest, background: 'var(--danger)' }} />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)' }}>■ Principal</span>
              <span style={{ color: 'var(--danger)' }}>■ Interest</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
