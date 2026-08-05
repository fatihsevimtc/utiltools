import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

const FREQ_OPTIONS = [
  { label: 'Annually', n: 1 },
  { label: 'Semi-annually', n: 2 },
  { label: 'Quarterly', n: 4 },
  { label: 'Monthly', n: 12 },
  { label: 'Daily', n: 365 },
]

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate]           = useState('7')
  const [years, setYears]         = useState('10')
  const [freq, setFreq]           = useState(12)
  const [contribution, setContribution] = useState('0') // monthly

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0
    const r = (parseFloat(rate) || 0) / 100
    const t = parseFloat(years) || 0
    const n = freq
    const c = parseFloat(contribution) || 0

    if (P <= 0 && c <= 0) return null

    // Future value of lump sum
    const lumpFV = P * Math.pow(1 + r / n, n * t)
    // Future value of monthly contributions (annuity)
    const contribPerPeriod = c * (12 / n)
    const periods = n * t
    const contribFV = contribPerPeriod * ((Math.pow(1 + r / n, periods) - 1) / (r / n || 1))

    const total = lumpFV + (r > 0 ? contribFV : c * 12 * t)
    const invested = P + c * 12 * t
    const interest = total - invested

    return { total, invested, interest }
  }, [principal, rate, years, freq, contribution])

  const fmt = n => '$' + (n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Compound Interest Calculator</h1>
      <p className="tool-description">See how your investment grows with compound interest over time.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
        <div>
          <label htmlFor="ci-p">Initial principal ($)</label>
          <input id="ci-p" type="number" min={0} value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ci-r">Annual interest rate (%)</label>
          <input id="ci-r" type="number" min={0} step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ci-y">Time (years)</label>
          <input id="ci-y" type="number" min={1} value={years} onChange={e => setYears(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ci-c">Monthly contribution ($)</label>
          <input id="ci-c" type="number" min={0} value={contribution} onChange={e => setContribution(e.target.value)} />
        </div>
      </div>

      <label style={{ marginTop: '1rem' }}>Compounding frequency</label>
      <div className="chip-group">
        {FREQ_OPTIONS.map(f => (
          <button key={f.n} className={`chip ${freq === f.n ? 'active' : ''}`} onClick={() => setFreq(f.n)}>{f.label}</button>
        ))}
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
            {[
              ['Future value', fmt(result.total)],
              ['Total invested', fmt(result.invested)],
              ['Interest earned', fmt(result.interest)],
            ].map(([label, val]) => (
              <div key={label} style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>{val}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', height: 20, borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ flex: result.invested, background: 'var(--accent)' }} />
              <div style={{ flex: result.interest, background: 'var(--success)' }} />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)' }}>■ Invested</span>
              <span style={{ color: 'var(--success)' }}>■ Interest</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
