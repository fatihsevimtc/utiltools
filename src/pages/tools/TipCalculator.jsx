import { useState } from 'react'
import BackBar from '../../components/BackBar'

const TIP_PRESETS = [10, 15, 18, 20, 25]

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPct, setTipPct] = useState(18)
  const [people, setPeople] = useState(1)
  const [custom, setCustom] = useState(false)

  const b = parseFloat(bill) || 0
  const tip = b * (tipPct / 100)
  const total = b + tip
  const perPerson = people > 0 ? total / people : total
  const tipPerPerson = people > 0 ? tip / people : tip

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Tip Calculator</h1>
      <p className="tool-description">Calculate tip and split the bill among any number of people.</p>

      <label htmlFor="tip-bill">Bill amount ($)</label>
      <input id="tip-bill" type="number" min={0} step="0.01" value={bill} onChange={e => setBill(e.target.value)} placeholder="0.00" />

      <label style={{ marginTop: '1rem' }}>Tip percentage</label>
      <div className="chip-group">
        {TIP_PRESETS.map(p => (
          <button key={p} className={`chip ${!custom && tipPct === p ? 'active' : ''}`} onClick={() => { setTipPct(p); setCustom(false) }}>
            {p}%
          </button>
        ))}
        <button className={`chip ${custom ? 'active' : ''}`} onClick={() => setCustom(true)}>Custom</button>
      </div>

      {custom && (
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="tip-custom">Custom tip %</label>
          <input id="tip-custom" type="number" min={0} max={100} value={tipPct} onChange={e => setTipPct(Number(e.target.value))} />
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <label>Split between: {people} {people === 1 ? 'person' : 'people'}</label>
        <input
          type="range" min={1} max={20} value={people}
          onChange={e => setPeople(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
      </div>

      {b > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: '0.75rem' }}>
          {[
            ['Tip amount', `$${tip.toFixed(2)}`],
            ['Total', `$${total.toFixed(2)}`],
            ...(people > 1 ? [
              ['Tip / person', `$${tipPerPerson.toFixed(2)}`],
              ['Total / person', `$${perPerson.toFixed(2)}`],
            ] : []),
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
