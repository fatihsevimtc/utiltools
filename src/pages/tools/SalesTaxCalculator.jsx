import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function SalesTaxCalculator() {
  const [price, setPrice]   = useState('')
  const [rate, setRate]     = useState('10')
  const [mode, setMode]     = useState('add') // 'add' | 'extract'

  const p = parseFloat(price) || 0
  const r = parseFloat(rate) || 0

  const { taxAmount, finalPrice, basePrice } = (() => {
    if (mode === 'add') {
      const tax = p * (r / 100)
      return { taxAmount: tax, finalPrice: p + tax, basePrice: p }
    } else {
      // extract tax from gross price
      const base = p / (1 + r / 100)
      const tax  = p - base
      return { taxAmount: tax, finalPrice: p, basePrice: base }
    }
  })()

  const fmt = n => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Sales Tax Calculator</h1>
      <p className="tool-description">
        Add sales tax to a price or extract tax from a tax-inclusive amount. Works for any tax rate.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'add' ? 'active' : ''}`} onClick={() => setMode('add')}>Add tax to price</button>
        <button className={`chip ${mode === 'extract' ? 'active' : ''}`} onClick={() => setMode('extract')}>Extract tax from gross</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: 420 }}>
        <div>
          <label htmlFor="stc-price">{mode === 'add' ? 'Pre-tax price' : 'Gross (tax-inclusive) price'}</label>
          <input id="stc-price" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="100" />
        </div>
        <div>
          <label htmlFor="stc-rate">Tax rate (%)</label>
          <input id="stc-rate" type="number" min="0" max="100" value={rate} onChange={e => setRate(e.target.value)} placeholder="10" />
        </div>
      </div>

      {p > 0 && r > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Base price',  value: fmt(basePrice) },
            { label: 'Tax amount',  value: fmt(taxAmount) },
            { label: 'Final price', value: fmt(finalPrice) },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 120px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/sales-tax" />
      <ToolSeo />
    </div>
  )
}
