import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [currentSavings, setCurrentSavings] = useState(20000)
  const [monthlyContrib, setMonthlyContrib] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [annualInflation, setAnnualInflation] = useState(2.5)
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000)
  const [lifeExpectancy, setLifeExpectancy] = useState(85)

  const result = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge)
    const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge)
    const monthlyRate = annualReturn / 100 / 12
    const months = yearsToRetire * 12

    // Future value of current savings
    const fvSavings = currentSavings * Math.pow(1 + annualReturn / 100, yearsToRetire)

    // Future value of monthly contributions (annuity)
    const fvContribs = monthlyRate === 0
      ? monthlyContrib * months
      : monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

    const totalAtRetirement = fvSavings + fvContribs

    // Inflation-adjusted monthly expenses at retirement
    const inflatedExpenses = monthlyExpenses * Math.pow(1 + annualInflation / 100, yearsToRetire)
    const annualExpensesAtRetirement = inflatedExpenses * 12

    // How long the nest egg lasts (drawdown with returns)
    // Monthly draw = annualExpensesAtRetirement / 12
    // Using present value of annuity: PV = PMT * (1-(1+r)^-n)/r
    const drawMonthlyRate = annualReturn / 100 / 12
    const drawMonths = yearsInRetirement * 12
    const neededNestEgg = drawMonthlyRate === 0
      ? inflatedExpenses * drawMonths
      : inflatedExpenses * ((1 - Math.pow(1 + drawMonthlyRate, -drawMonths)) / drawMonthlyRate)

    const surplusOrShortfall = totalAtRetirement - neededNestEgg
    const onTrack = surplusOrShortfall >= 0

    // Monthly contribution needed to reach target
    const needed = neededNestEgg - fvSavings
    const monthlyNeeded = needed <= 0
      ? 0
      : monthlyRate === 0
        ? needed / months
        : needed * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)

    // Build year-by-year projection
    const projection = []
    let balance = currentSavings
    for (let y = 0; y <= yearsToRetire; y++) {
      projection.push({ age: currentAge + y, balance: Math.round(balance) })
      balance = balance * (1 + annualReturn / 100) + monthlyContrib * 12
    }

    return {
      yearsToRetire,
      yearsInRetirement,
      totalAtRetirement,
      neededNestEgg,
      surplusOrShortfall,
      onTrack,
      monthlyNeeded: Math.max(0, monthlyNeeded),
      inflatedExpenses,
      annualExpensesAtRetirement,
      projection,
    }
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, annualReturn, annualInflation, monthlyExpenses, lifeExpectancy])

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem' }
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.25rem' }

  return (
    <div className="tool-page">
      <BackBar />
      <ToolSeo />
      <h1>Retirement Planning Calculator</h1>
      <p className="tool-description">
        Estimate how much you'll have at retirement, whether you're on track, and how much to save each month to reach your goal — all in your browser, no data sent anywhere.
      </p>

      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label htmlFor="rc-age">Current age</label>
          <input id="rc-age" type="number" min={18} max={80} value={currentAge}
            onChange={e => setCurrentAge(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-ret-age">Retirement age</label>
          <input id="rc-ret-age" type="number" min={currentAge + 1} max={90} value={retirementAge}
            onChange={e => setRetirementAge(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-life">Life expectancy</label>
          <input id="rc-life" type="number" min={retirementAge + 1} max={120} value={lifeExpectancy}
            onChange={e => setLifeExpectancy(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-savings">Current savings ($)</label>
          <input id="rc-savings" type="number" min={0} value={currentSavings}
            onChange={e => setCurrentSavings(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-contrib">Monthly contribution ($)</label>
          <input id="rc-contrib" type="number" min={0} value={monthlyContrib}
            onChange={e => setMonthlyContrib(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-return">Annual return (%)</label>
          <input id="rc-return" type="number" min={0} max={30} step={0.1} value={annualReturn}
            onChange={e => setAnnualReturn(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-inflation">Annual inflation (%)</label>
          <input id="rc-inflation" type="number" min={0} max={20} step={0.1} value={annualInflation}
            onChange={e => setAnnualInflation(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="rc-expenses">Monthly expenses in today's $ ($)</label>
          <input id="rc-expenses" type="number" min={0} value={monthlyExpenses}
            onChange={e => setMonthlyExpenses(Number(e.target.value))} />
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Projected nest egg', value: fmt(result.totalAtRetirement), accent: true },
          { label: 'Needed nest egg', value: fmt(result.neededNestEgg) },
          { label: result.onTrack ? '🟢 Surplus' : '🔴 Shortfall', value: fmt(Math.abs(result.surplusOrShortfall)), ok: result.onTrack },
          { label: 'Monthly needed (to be on track)', value: fmt(result.monthlyNeeded) },
          { label: `Expenses at retirement (inflated)`, value: `${fmt(result.inflatedExpenses)}/mo` },
          { label: 'Years to retirement', value: `${result.yearsToRetire} yrs` },
        ].map(c => (
          <div key={c.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '0.85rem 1rem',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: c.accent ? 'var(--accent)' : c.ok === true ? 'var(--success, #22c55e)' : c.ok === false ? 'var(--error, #ef4444)' : 'var(--text)' }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Projection table (last 10 rows + first few) */}
      <details style={{ marginBottom: '1.5rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '0.6rem' }}>
          Year-by-year projection
        </summary>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Age</th>
                <th style={{ padding: '0.4rem 0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>Projected Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.projection.map(row => (
                <tr key={row.age} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.35rem 0.75rem' }}>{row.age}</td>
                  <td style={{ padding: '0.35rem 0.75rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
        Figures are estimates based on constant annual return and inflation. Actual returns vary. This tool is for planning purposes only and is not financial advice.
      </p>

      <RelatedTools tools={[
        { icon: '📈', name: 'Compound Interest',  path: '/tools/compound-interest' },
        { icon: '🏦', name: 'Loan Calculator',    path: '/tools/loan-calculator' },
        { icon: '💵', name: 'Present Value',      path: '/tools/present-value' },
        { icon: '💰', name: 'VAT Calculator',     path: '/tools/vat-calculator' },
      ]} />
    </div>
  )
}
