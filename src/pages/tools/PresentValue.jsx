import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function fmt(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function PresentValue() {
  const [mode, setMode]           = useState('lump')   // lump | annuity
  const [futureValue, setFV]      = useState(10000)
  const [rate, setRate]           = useState(5)        // % per period
  const [periods, setPeriods]     = useState(10)
  const [payment, setPayment]     = useState(1000)     // for annuity
  const [annuityType, setAType]   = useState('end')    // end | begin
  const [compounding, setComp]    = useState('annual') // annual | monthly

  // Effective rate per period
  const r = compounding === 'monthly' ? (rate / 100) / 12 : rate / 100
  const n = compounding === 'monthly' ? periods * 12 : periods

  // Lump sum PV: PV = FV / (1 + r)^n
  const pvLump = futureValue / Math.pow(1 + r, n)

  // Annuity PV
  const pvAnnuityFactor = r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r
  const pvAnnuity = payment * pvAnnuityFactor * (annuityType === 'begin' ? (1 + r) : 1)

  const pv = mode === 'lump' ? pvLump : pvAnnuity

  // Discount (time value of money lost)
  const discount = mode === 'lump' ? futureValue - pvLump : payment * n - pvAnnuity

  // Build schedule
  const schedule = []
  if (mode === 'lump') {
    let remaining = futureValue
    for (let i = n; i >= 1; i--) {
      const prev = remaining
      remaining = remaining / (1 + r)
      schedule.push({ period: n - i + 1, value: remaining, discount: prev - remaining })
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Present Value Calculator</h1>
      <p className="tool-description">
        Find the present value of a future lump sum or an annuity stream, accounting for the time value of money.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'lump' ? 'active' : ''}`} onClick={() => setMode('lump')}>Lump sum</button>
        <button className={`chip ${mode === 'annuity' ? 'active' : ''}`} onClick={() => setMode('annuity')}>Annuity</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {mode === 'lump' && (
          <div>
            <label style={{ fontSize: '0.875rem' }}>Future value ($)</label>
            <input type="number" min={0} step={100} value={futureValue}
              onChange={e => setFV(Number(e.target.value) || 0)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }} />
          </div>
        )}
        {mode === 'annuity' && (
          <div>
            <label style={{ fontSize: '0.875rem' }}>Payment per period ($)</label>
            <input type="number" min={0} step={100} value={payment}
              onChange={e => setPayment(Number(e.target.value) || 0)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }} />
          </div>
        )}
        <div>
          <label style={{ fontSize: '0.875rem' }}>Discount rate (% per year)</label>
          <input type="number" min={0} max={100} step={0.1} value={rate}
            onChange={e => setRate(Number(e.target.value) || 0)}
            style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem' }}>{compounding === 'monthly' ? 'Term (years)' : 'Number of periods'}</label>
          <input type="number" min={1} max={100} step={1} value={periods}
            onChange={e => setPeriods(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem' }}>Compounding</label>
          <select value={compounding} onChange={e => setComp(e.target.value)}
            style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }}>
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {mode === 'annuity' && (
          <div>
            <label style={{ fontSize: '0.875rem' }}>Payment timing</label>
            <select value={annuityType} onChange={e => setAType(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }}>
              <option value="end">End of period (ordinary)</option>
              <option value="begin">Beginning of period (due)</option>
            </select>
          </div>
        )}
      </div>

      {/* Result */}
      <div style={{
        background: 'var(--surface)',
        border: '2px solid var(--primary)',
        borderRadius: 10,
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Present Value</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>${fmt(pv)}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
          {mode === 'lump'
            ? `$${fmt(futureValue)} in ${n} period${n !== 1 ? 's' : ''} is worth $${fmt(pv)} today (discount: $${fmt(discount)})`
            : `Total payments: $${fmt(payment * n)} — time-value discount: $${fmt(Math.abs(discount))}`
          }
        </div>
      </div>

      {/* Summary rows */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
        <tbody>
          {[
            ['Discount rate (r)', `${rate}% / year`],
            ['Periods (n)', `${n} ${compounding === 'monthly' ? 'months' : 'periods'}`],
            ['Effective rate per period', `${(r * 100).toFixed(4)}%`],
            mode === 'lump'
              ? ['Future value', `$${fmt(futureValue)}`]
              : ['Payment per period', `$${fmt(payment)}`],
            ['Present Value', `$${fmt(pv)}`],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.5rem 0.75rem', color: 'var(--muted)' }}>{label}</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: label === 'Present Value' ? 600 : 400 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
        Formula — Lump sum: PV = FV ÷ (1 + r)ⁿ &nbsp;|&nbsp; Ordinary annuity: PV = PMT × [1 − (1 + r)^(−n)] ÷ r
      </p>

      <RelatedTools tools={[
        { icon: '📈', name: 'Compound Interest',  path: '/tools/compound-interest' },
        { icon: '🏦', name: 'Loan Calculator',    path: '/tools/loan-calculator' },
        { icon: '🚗', name: 'Lease Calculator',   path: '/tools/lease-calculator' },
        { icon: '📐', name: 'Confidence Interval',path: '/tools/confidence-interval' },
      ]} />
      <ToolSeo />
    </div>
  )
}
