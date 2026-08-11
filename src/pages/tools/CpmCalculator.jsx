import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function CpmCalculator() {
  const [mode, setMode]         = useState('cpm')
  const [impressions, setImp]   = useState('')
  const [cost, setCost]         = useState('')
  const [cpm, setCpm]           = useState('')

  const imp  = parseFloat(impressions) || 0
  const c    = parseFloat(cost) || 0
  const cpmV = parseFloat(cpm) || 0

  const result = (() => {
    if (mode === 'cpm')  return imp > 0 && c > 0   ? { label: 'CPM', value: (c / imp * 1000) } : null
    if (mode === 'cost') return imp > 0 && cpmV > 0 ? { label: 'Total Cost', value: (imp / 1000 * cpmV) } : null
    if (mode === 'imp')  return c > 0 && cpmV > 0  ? { label: 'Impressions', value: Math.round(c / cpmV * 1000) } : null
    return null
  })()

  const fmt = n => Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="tool-page">
      <BackBar />
      <h1>CPM Calculator</h1>
      <p className="tool-description">
        Calculate Cost Per Mille (CPM), total advertising cost, or number of impressions. CPM = Cost ÷ (Impressions ÷ 1000).
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'cpm' ? 'active' : ''}`} onClick={() => setMode('cpm')}>Find CPM</button>
        <button className={`chip ${mode === 'cost' ? 'active' : ''}`} onClick={() => setMode('cost')}>Find Cost</button>
        <button className={`chip ${mode === 'imp' ? 'active' : ''}`} onClick={() => setMode('imp')}>Find Impressions</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 480 }}>
        {mode !== 'imp' && (
          <div style={{ flex: 1 }}>
            <label>Impressions</label>
            <input type="number" min="0" value={impressions} onChange={e => setImp(e.target.value)} placeholder="100000" />
          </div>
        )}
        {mode !== 'cost' && (
          <div style={{ flex: 1 }}>
            <label>Total Cost ($)</label>
            <input type="number" min="0" value={cost} onChange={e => setCost(e.target.value)} placeholder="500" />
          </div>
        )}
        {mode !== 'cpm' && (
          <div style={{ flex: 1 }}>
            <label>CPM ($)</label>
            <input type="number" min="0" value={cpm} onChange={e => setCpm(e.target.value)} placeholder="5" />
          </div>
        )}
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1.25rem', maxWidth: 260, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{fmt(result.value)}{mode === 'cpm' ? ' $' : ''}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{result.label}</div>
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/cpm-calculator" />
      <ToolSeo />
    </div>
  )
}
