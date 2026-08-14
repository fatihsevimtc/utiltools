import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function InvestmentCalculator() {
  const [initial, setInitial] = useState(10000)
  const [monthly, setMonthly] = useState(500)
  const [years, setYears] = useState(10)
  const [returnRate, setReturnRate] = useState(7)
  const [riskFactor, setRiskFactor] = useState(0)
  const [result, setResult] = useState(null)

  function calculate() {
    const principal = parseFloat(initial) || 0
    const contribution = parseFloat(monthly) || 0
    const time = parseFloat(years) || 0
    const rate = (parseFloat(returnRate) || 0) / 100
    const risk = parseFloat(riskFactor) || 0

    // Adjust rate by risk factor
    const adjustedRate = rate * (1 - risk / 100)
    const monthlyRate = adjustedRate / 12
    const months = time * 12

    // Future value with monthly contributions
    let futureValue = principal * Math.pow(1 + monthlyRate, months)
    if (contribution > 0 && monthlyRate > 0) {
      futureValue += contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    } else if (contribution > 0) {
      futureValue += contribution * months
    }

    const totalContributed = principal + (contribution * months)
    const totalGain = futureValue - totalContributed

    setResult({
      futureValue: futureValue.toFixed(2),
      totalContributed: totalContributed.toFixed(2),
      totalGain: totalGain.toFixed(2),
      adjustedRate: (adjustedRate * 100).toFixed(2),
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Investment Calculator</h1>
      <p className="tool-description">
        Estimate your investment growth over time with annual returns and optional risk adjustment.
      </p>

      <label htmlFor="ic-initial">Initial investment ($)</label>
      <input
        id="ic-initial"
        type="number"
        min={0}
        step={100}
        value={initial}
        onChange={e => setInitial(e.target.value)}
      />

      <label htmlFor="ic-monthly">Monthly contribution ($)</label>
      <input
        id="ic-monthly"
        type="number"
        min={0}
        step={50}
        value={monthly}
        onChange={e => setMonthly(e.target.value)}
      />

      <label htmlFor="ic-years">Time period (years)</label>
      <input
        id="ic-years"
        type="number"
        min={1}
        max={50}
        value={years}
        onChange={e => setYears(e.target.value)}
      />

      <label htmlFor="ic-return">Expected annual return (%)</label>
      <input
        id="ic-return"
        type="number"
        min={0}
        max={30}
        step={0.5}
        value={returnRate}
        onChange={e => setReturnRate(e.target.value)}
      />

      <label htmlFor="ic-risk">Risk adjustment factor (% reduction, 0 = no risk)</label>
      <input
        id="ic-risk"
        type="number"
        min={0}
        max={50}
        step={1}
        value={riskFactor}
        onChange={e => setRiskFactor(e.target.value)}
      />

      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={calculate}>
        📊 Calculate
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Results</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--muted)' }}>Future value</span>
              <strong style={{ fontSize: '1.3rem', color: 'var(--accent)' }}>${parseFloat(result.futureValue).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Total contributed</span>
              <strong>${parseFloat(result.totalContributed).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Total gain</span>
              <strong style={{ color: parseFloat(result.totalGain) >= 0 ? '#4ade80' : '#f87171' }}>
                ${parseFloat(result.totalGain).toLocaleString()}
              </strong>
            </div>
            {riskFactor > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Risk-adjusted return</span>
                <strong>{result.adjustedRate}%</strong>
              </div>
            )}
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--muted)' }}>
            <strong>Note:</strong> This is a projection based on consistent returns. Actual investment performance varies and is never guaranteed.
          </div>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '📈', name: 'Compound Interest',     path: '/tools/compound-interest' },
        { icon: '🏦', name: 'Loan Calculator',       path: '/tools/loan-calculator' },
        { icon: '💵', name: 'Present Value',         path: '/tools/present-value' },
        { icon: '💰', name: 'Retirement Calculator', path: '/tools/retirement-calculator' },
      ]} />
      <ToolSeo />
    </div>
  )
}
