import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function DiscountCalculator() {
  const [mode, setMode] = useState('pct') // 'pct' | 'amount' | 'reverse'
  const [original, setOriginal] = useState('')
  const [discount, setDiscount] = useState('')
  const [final, setFinal] = useState('')

  const orig = parseFloat(original)
  const disc = parseFloat(discount)
  const fin  = parseFloat(final)

  // Mode: pct — original price + discount %
  const pctResult = (() => {
    if (isNaN(orig) || isNaN(disc) || orig <= 0 || disc < 0 || disc > 100) return null
    const saved = orig * (disc / 100)
    return { finalPrice: orig - saved, saved, pct: disc }
  })()

  // Mode: amount — original price + discount amount
  const amtResult = (() => {
    if (isNaN(orig) || isNaN(disc) || orig <= 0 || disc < 0 || disc > orig) return null
    const saved = disc
    return { finalPrice: orig - saved, saved, pct: (saved / orig) * 100 }
  })()

  // Mode: reverse — original + final to find discount
  const revResult = (() => {
    if (isNaN(orig) || isNaN(fin) || orig <= 0 || fin < 0 || fin > orig) return null
    const saved = orig - fin
    return { saved, pct: (saved / orig) * 100 }
  })()

  const res = mode === 'pct' ? pctResult : mode === 'amount' ? amtResult : revResult

  function fmt(n) {
    return typeof n === 'number' && !isNaN(n) ? n.toFixed(2) : '—'
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Discount Calculator</h1>
      <p className="tool-description">
        Calculate sale prices, savings amounts, and discount percentages. Three modes for every scenario.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          ['pct', '% Discount → Final price'],
          ['amount', 'Amount off → Final price'],
          ['reverse', 'Original + Final → Discount %'],
        ].map(([id, label]) => (
          <button key={id} className={`btn ${mode === id ? '' : 'btn-ghost'} btn-sm`} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="dc-orig">Original price</label>
          <input id="dc-orig" type="number" min={0} step="0.01" value={original} onChange={e => setOriginal(e.target.value)} placeholder="100.00" />
        </div>
        {mode === 'pct' && (
          <div style={{ flex: '1 1 140px' }}>
            <label htmlFor="dc-disc">Discount (%)</label>
            <input id="dc-disc" type="number" min={0} max={100} step="0.01" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="20" />
          </div>
        )}
        {mode === 'amount' && (
          <div style={{ flex: '1 1 140px' }}>
            <label htmlFor="dc-disc-amt">Discount amount</label>
            <input id="dc-disc-amt" type="number" min={0} step="0.01" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="20.00" />
          </div>
        )}
        {mode === 'reverse' && (
          <div style={{ flex: '1 1 140px' }}>
            <label htmlFor="dc-final">Final price paid</label>
            <input id="dc-final" type="number" min={0} step="0.01" value={final} onChange={e => setFinal(e.target.value)} placeholder="80.00" />
          </div>
        )}
      </div>

      {res && (
        <div className="stats-row" style={{ marginTop: '1.25rem' }}>
          {mode !== 'reverse' && (
            <div className="stat-card">
              <div className="stat-value">{fmt(res.finalPrice)}</div>
              <div className="stat-label">Final Price</div>
            </div>
          )}
          <div className="stat-card">
            <div className="stat-value">{fmt(res.saved)}</div>
            <div className="stat-label">You Save</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{fmt(res.pct)}%</div>
            <div className="stat-label">Discount %</div>
          </div>
          {mode !== 'reverse' && (
            <div className="stat-card">
              <div className="stat-value">{fmt((res.saved / orig) * 100)}%</div>
              <div className="stat-label">Savings Rate</div>
            </div>
          )}
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/discount-calculator" />
      <ToolSeo />
    </div>
  )
}
