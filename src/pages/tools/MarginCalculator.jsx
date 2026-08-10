import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function MarginCalculator() {
  const [cost, setCost]     = useState('')
  const [revenue, setRev]   = useState('')

  const c = parseFloat(cost) || 0
  const r = parseFloat(revenue) || 0

  const profit       = r - c
  const marginPct    = r > 0 ? (profit / r) * 100 : 0
  const markupPct    = c > 0 ? (profit / c) * 100 : 0

  const fmt = n => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Margin Calculator</h1>
      <p className="tool-description">
        Calculate gross profit margin and markup percentage from cost and revenue. Useful for pricing products and services.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: 420 }}>
        <div>
          <label htmlFor="mc-cost">Cost price</label>
          <input id="mc-cost" type="number" min="0" value={cost} onChange={e => setCost(e.target.value)} placeholder="50" />
        </div>
        <div>
          <label htmlFor="mc-rev">Selling price (revenue)</label>
          <input id="mc-rev" type="number" min="0" value={revenue} onChange={e => setRev(e.target.value)} placeholder="80" />
        </div>
      </div>

      {c > 0 && r > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Gross profit',   value: fmt(profit),              note: 'revenue − cost' },
            { label: 'Profit margin',  value: `${fmt(marginPct)}%`,     note: 'profit / revenue' },
            { label: 'Markup',         value: `${fmt(markupPct)}%`,     note: 'profit / cost' },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 130px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{s.note}</div>
            </div>
          ))}
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/margin-calculator" />
      <ToolSeo />
    </div>
  )
}
