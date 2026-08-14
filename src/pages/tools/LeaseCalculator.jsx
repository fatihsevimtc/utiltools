import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function fmt(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function LeaseCalculator() {
  const [vehiclePrice, setVehiclePrice]   = useState(35000)
  const [residual, setResidual]           = useState(18000)  // residual / buyout value
  const [downPayment, setDownPayment]     = useState(3000)
  const [tradeIn, setTradeIn]             = useState(0)
  const [moneyFactor, setMoneyFactor]     = useState(0.00125) // equivalent APR / 2400
  const [termMonths, setTermMonths]       = useState(36)
  const [salesTax, setSalesTax]           = useState(10)

  // Money factor ↔ APR helper
  const apr = (moneyFactor * 2400).toFixed(2)

  const netCapCost  = vehiclePrice - downPayment - tradeIn
  const depreciation = (netCapCost - residual) / termMonths
  const financeCharge = (netCapCost + residual) * moneyFactor
  const baseMonthly   = depreciation + financeCharge
  const taxAmount     = baseMonthly * (salesTax / 100)
  const totalMonthly  = baseMonthly + taxAmount
  const totalCost     = totalMonthly * termMonths + downPayment + tradeIn

  const rows = [
    ['Vehicle price',          `$${fmt(vehiclePrice)}`],
    ['Down payment',           `−$${fmt(downPayment)}`],
    ['Trade-in value',         `−$${fmt(tradeIn)}`],
    ['Net capitalised cost',   `$${fmt(netCapCost)}`],
    ['Residual value',         `$${fmt(residual)}`],
    ['Monthly depreciation',   `$${fmt(depreciation)}`],
    ['Monthly finance charge', `$${fmt(financeCharge)}`],
    ['Base monthly payment',   `$${fmt(baseMonthly)}`],
    [`Sales tax (${salesTax}%)`, `$${fmt(taxAmount)}`],
    ['Monthly payment (incl. tax)', `$${fmt(totalMonthly)}`],
    ['Total lease cost',       `$${fmt(totalCost)}`],
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Lease Calculator</h1>
      <p className="tool-description">
        Calculate your monthly car lease payment using the standard money-factor formula. All calculations run in your browser.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Vehicle price ($)', value: vehiclePrice, set: setVehiclePrice, min: 0 },
          { label: 'Residual / buyout value ($)', value: residual, set: setResidual, min: 0 },
          { label: 'Down payment ($)', value: downPayment, set: setDownPayment, min: 0 },
          { label: 'Trade-in value ($)', value: tradeIn, set: setTradeIn, min: 0 },
          { label: 'Sales tax (%)', value: salesTax, set: setSalesTax, min: 0, max: 30, step: 0.1 },
          { label: 'Lease term (months)', value: termMonths, set: setTermMonths, min: 12, max: 84, step: 12 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label}>
            <label style={{ fontSize: '0.875rem' }}>{label}</label>
            <input
              type="number"
              min={min}
              max={max}
              step={step ?? 100}
              value={value}
              onChange={e => set(Number(e.target.value) || 0)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }}
            />
          </div>
        ))}

        <div>
          <label style={{ fontSize: '0.875rem' }}>
            Money factor
            <span style={{ color: 'var(--muted)', marginLeft: '0.4rem', fontSize: '0.8rem' }}>≈ {apr}% APR</span>
          </label>
          <input
            type="number"
            min={0}
            step={0.00001}
            value={moneyFactor}
            onChange={e => setMoneyFactor(Number(e.target.value) || 0)}
            style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.95rem' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            Convert APR → money factor: APR ÷ 2400
          </p>
        </div>
      </div>

      {/* Result highlight */}
      <div style={{
        background: 'var(--surface)',
        border: '2px solid var(--primary)',
        borderRadius: 10,
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Monthly payment (incl. tax)</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>${fmt(totalMonthly)}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
          Total lease cost: ${fmt(totalCost)} over {termMonths} months
        </div>
      </div>

      {/* Breakdown table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-alt, var(--surface))' }}>
              <td style={{ padding: '0.5rem 0.75rem', color: 'var(--muted)' }}>{label}</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: label.includes('Monthly payment') || label.includes('Total') ? 600 : 400 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '1rem' }}>
        This calculator uses the standard automotive lease formula. Results are estimates — actual lease payments may vary based on fees, incentives, and dealer terms.
      </p>

      <RelatedTools tools={[
        { icon: '🏦', name: 'Loan Calculator',     path: '/tools/loan-calculator' },
        { icon: '📈', name: 'Compound Interest',   path: '/tools/compound-interest' },
        { icon: '💰', name: 'VAT Calculator',      path: '/tools/vat-calculator' },
        { icon: '🧾', name: 'Sales Tax',           path: '/tools/sales-tax' },
      ]} />
      <ToolSeo />
    </div>
  )
}
