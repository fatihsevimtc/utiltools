import { useState } from 'react'
import BackBar from '../../components/BackBar'

const PRESETS = [5, 10, 15, 19, 20, 21, 23, 25]

export default function VatCalculator() {
  const [amount, setAmount] = useState('')
  const [vat, setVat] = useState(20)
  const [customVat, setCustomVat] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [mode, setMode] = useState('add') // 'add' | 'remove'

  const effectiveVat = useCustom ? (parseFloat(customVat) || 0) : vat
  const base = parseFloat(amount) || 0

  let netAmount, vatAmount, grossAmount
  if (mode === 'add') {
    netAmount = base
    vatAmount = base * effectiveVat / 100
    grossAmount = base + vatAmount
  } else {
    grossAmount = base
    netAmount = base / (1 + effectiveVat / 100)
    vatAmount = grossAmount - netAmount
  }

  const fmt = n => n.toFixed(2)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>VAT Calculator</h1>
      <p className="tool-description">Add VAT to a net price or extract it from a gross price.</p>

      <div className="chip-group">
        <button className={`chip ${mode === 'add' ? 'active' : ''}`} onClick={() => setMode('add')}>Add VAT</button>
        <button className={`chip ${mode === 'remove' ? 'active' : ''}`} onClick={() => setMode('remove')}>Remove VAT</button>
      </div>

      <label htmlFor="vat-amount" style={{ marginTop: '1rem' }}>
        {mode === 'add' ? 'Net amount (excl. VAT)' : 'Gross amount (incl. VAT)'}
      </label>
      <input id="vat-amount" type="number" min={0} step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100.00" />

      <label style={{ marginTop: '1rem' }}>VAT rate</label>
      <div className="chip-group">
        {PRESETS.map(p => (
          <button key={p} className={`chip ${!useCustom && vat === p ? 'active' : ''}`} onClick={() => { setVat(p); setUseCustom(false) }}>{p}%</button>
        ))}
        <button className={`chip ${useCustom ? 'active' : ''}`} onClick={() => setUseCustom(true)}>Custom</button>
      </div>
      {useCustom && (
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="vat-custom">Custom rate (%)</label>
          <input id="vat-custom" type="number" min={0} max={100} step="0.1" value={customVat} onChange={e => setCustomVat(e.target.value)} placeholder="e.g. 17.5" />
        </div>
      )}

      {base > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '0.75rem' }}>
          {[
            ['Net (excl. VAT)', fmt(netAmount)],
            [`VAT (${effectiveVat}%)`, fmt(vatAmount)],
            ['Gross (incl. VAT)', fmt(grossAmount)],
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
