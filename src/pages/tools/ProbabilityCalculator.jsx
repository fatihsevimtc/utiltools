import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ProbabilityCalculator() {
  const [mode, setMode] = useState('single')
  const [pA, setPA] = useState('')
  const [pB, setPB] = useState('')

  const a = parseFloat(pA) / 100 || 0
  const b = parseFloat(pB) / 100 || 0

  const results = (() => {
    if (mode === 'single') {
      const p = a
      return [
        { label: 'P(A)',           value: p },
        { label: 'P(not A)',       value: 1 - p },
        { label: 'P(A) as odds',  value: p > 0 ? `${(p / (1 - p)).toFixed(4)} to 1` : '—' },
      ]
    }
    return [
      { label: 'P(A)',            value: a },
      { label: 'P(B)',            value: b },
      { label: 'P(A and B) — independent', value: a * b },
      { label: 'P(A or B)',       value: a + b - a * b },
      { label: 'P(A | B) — A given B', value: b > 0 ? a * b / b : '—' },
      { label: 'P(not A and not B)', value: (1 - a) * (1 - b) },
    ]
  })()

  const fmt = v => typeof v === 'number' ? `${(v * 100).toFixed(4)}%` : v

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Probability Calculator</h1>
      <p className="tool-description">
        Calculate probability for single or two independent events — including complement, union, intersection, and conditional probability.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'single' ? 'active' : ''}`} onClick={() => setMode('single')}>Single event</button>
        <button className={`chip ${mode === 'two' ? 'active' : ''}`} onClick={() => setMode('two')}>Two events</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 420 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="pc-a">P(A) — probability of A (%)</label>
          <input id="pc-a" type="number" min="0" max="100" value={pA} onChange={e => setPA(e.target.value)} placeholder="50" />
        </div>
        {mode === 'two' && (
          <div style={{ flex: 1 }}>
            <label htmlFor="pc-b">P(B) — probability of B (%)</label>
            <input id="pc-b" type="number" min="0" max="100" value={pB} onChange={e => setPB(e.target.value)} placeholder="30" />
          </div>
        )}
      </div>

      {pA && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <tbody>
            {results.map(r => (
              <tr key={r.label} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem 0.6rem', color: 'var(--muted)' }}>{r.label}</td>
                <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <RelatedTools category="math" exclude="/tools/probability" />
      <ToolSeo />
    </div>
  )
}
