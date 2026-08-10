import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function GstCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate]     = useState('10')
  const [mode, setMode]     = useState('add') // 'add' | 'extract'

  const a = parseFloat(amount) || 0
  const r = parseFloat(rate) || 0

  const { gstAmount, totalAmount, netAmount } = (() => {
    if (mode === 'add') {
      const gst = a * (r / 100)
      return { gstAmount: gst, totalAmount: a + gst, netAmount: a }
    } else {
      const net = a / (1 + r / 100)
      const gst = a - net
      return { gstAmount: gst, totalAmount: a, netAmount: net }
    }
  })()

  const fmt = n => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const commonRates = [5, 10, 12, 15, 18, 20, 25]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>GST Calculator</h1>
      <p className="tool-description">
        Calculate Goods and Services Tax (GST) — add GST to a price or extract it from a GST-inclusive amount.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'add' ? 'active' : ''}`} onClick={() => setMode('add')}>Add GST</button>
        <button className={`chip ${mode === 'extract' ? 'active' : ''}`} onClick={() => setMode('extract')}>Remove GST from gross</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: 420 }}>
        <div>
          <label htmlFor="gst-amt">{mode === 'add' ? 'Price (excl. GST)' : 'Gross price (incl. GST)'}</label>
          <input id="gst-amt" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
        </div>
        <div>
          <label htmlFor="gst-rate">GST rate (%)</label>
          <input id="gst-rate" type="number" min="0" max="100" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
      </div>

      <div className="chip-group" style={{ marginTop: '0.5rem' }}>
        {commonRates.map(n => (
          <button key={n} className={`chip ${rate === String(n) ? 'active' : ''}`} onClick={() => setRate(String(n))}>{n}%</button>
        ))}
      </div>

      {a > 0 && r > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Net amount (excl. GST)', value: fmt(netAmount) },
            { label: 'GST amount',             value: fmt(gstAmount) },
            { label: 'Total (incl. GST)',       value: fmt(totalAmount) },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 130px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/gst-calculator" />
      <ToolSeo />
    </div>
  )
}
