import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PayPalFeeCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate]     = useState('3.49')
  const [fixed, setFixed]   = useState('0.49')
  const [mode, setMode]     = useState('youSend') // 'youSend' | 'theyReceive'

  const a = parseFloat(amount) || 0
  const r = parseFloat(rate) / 100 || 0
  const f = parseFloat(fixed) || 0

  const { fee, received, toSend } = (() => {
    if (mode === 'youSend') {
      const fee = a * r + f
      return { fee, received: a - fee, toSend: a }
    } else {
      // You want recipient to receive `a` — what do you send?
      const toSend = (a + f) / (1 - r)
      const fee = toSend - a
      return { fee, received: a, toSend }
    }
  })()

  const fmt = n => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const PRESETS = [
    { label: 'PayPal Standard (US)', rate: '3.49', fixed: '0.49' },
    { label: 'PayPal Friends & Family', rate: '0', fixed: '0' },
    { label: 'PayPal International', rate: '4.99', fixed: '0.49' },
    { label: 'PayPal Micropayments', rate: '5', fixed: '0.09' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>PayPal Fee Calculator</h1>
      <p className="tool-description">
        Calculate PayPal transaction fees and find out how much to charge so the recipient gets the exact amount you intend.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button className={`chip ${mode === 'youSend' ? 'active' : ''}`} onClick={() => setMode('youSend')}>I'm sending / they pay</button>
        <button className={`chip ${mode === 'theyReceive' ? 'active' : ''}`} onClick={() => setMode('theyReceive')}>They must receive exactly</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', maxWidth: 480 }}>
        <div>
          <label htmlFor="pp-amount">{mode === 'youSend' ? 'Amount you send' : 'Amount they receive'}</label>
          <input id="pp-amount" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
        </div>
        <div>
          <label htmlFor="pp-rate">Fee rate (%)</label>
          <input id="pp-rate" type="number" min="0" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pp-fixed">Fixed fee ($)</label>
          <input id="pp-fixed" type="number" min="0" step="0.01" value={fixed} onChange={e => setFixed(e.target.value)} />
        </div>
      </div>

      <div className="chip-group" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button key={p.label} className="chip" onClick={() => { setRate(p.rate); setFixed(p.fixed) }}>{p.label}</button>
        ))}
      </div>

      {a > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Amount sent',     value: fmt(toSend) },
            { label: 'PayPal fee',      value: fmt(fee) },
            { label: 'Amount received', value: fmt(received) },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 120px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/paypal-fee" />
      <ToolSeo />
    </div>
  )
}
