import { useState } from 'react'
import BackBar from '../../components/BackBar'

function fmt(n) {
  if (isNaN(n) || !isFinite(n)) return '—'
  return Number(n.toFixed(6)).toLocaleString()
}

export default function PercentageCalc() {
  const [mode, setMode] = useState('of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  let result = ''
  let label  = ''
  const na = Number(a), nb = Number(b)

  if (a !== '' && b !== '') {
    if (mode === 'of')        { result = fmt(na/100 * nb);         label = `${a}% of ${b}` }
    if (mode === 'what')      { result = fmt(na/nb*100) + '%';     label = `${a} is what % of ${b}` }
    if (mode === 'increase')  { result = fmt(nb + nb*(na/100));    label = `${b} increased by ${a}%` }
    if (mode === 'decrease')  { result = fmt(nb - nb*(na/100));    label = `${b} decreased by ${a}%` }
    if (mode === 'change')    { result = fmt((nb-na)/na*100) + '%';label = `% change from ${a} to ${b}` }
  }

  const configs = {
    of:       { aLabel: 'Percentage (%)', bLabel: 'Of what number' },
    what:     { aLabel: 'Number',         bLabel: 'Of total' },
    increase: { aLabel: 'Increase by (%)',bLabel: 'Starting value' },
    decrease: { aLabel: 'Decrease by (%)',bLabel: 'Starting value' },
    change:   { aLabel: 'From',           bLabel: 'To' },
  }
  const cfg = configs[mode]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Percentage Calculator</h1>
      <p className="tool-description">Calculate percentages, increases, decreases, and changes.</p>

      <div className="chip-group">
        {[['of','X% of Y'],['what','X is what % of Y'],['increase','Increase by %'],['decrease','Decrease by %'],['change','% change']].map(([v,l]) => (
          <button key={v} className={`chip ${mode===v?'active':''}`} onClick={() => { setMode(v); setA(''); setB('') }}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="pct-a">{cfg.aLabel}</label>
          <input id="pct-a" type="number" value={a} onChange={e => setA(e.target.value)} placeholder="0" />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="pct-b">{cfg.bLabel}</label>
          <input id="pct-b" type="number" value={b} onChange={e => setB(e.target.value)} placeholder="0" />
        </div>
      </div>

      {result && (
        <div className="stat-card" style={{ display: 'inline-block' }}>
          <div className="stat-value">{result}</div>
          <div className="stat-label">{label}</div>
        </div>
      )}
    </div>
  )
}
