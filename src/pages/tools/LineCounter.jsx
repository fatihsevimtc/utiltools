import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function LineCounter() {
  const [text, setText] = useState('')
  const [countBlank, setCountBlank] = useState(true)

  const lines = text === '' ? [] : text.split('\n')
  const total      = lines.length
  const blankLines = lines.filter(l => l.trim() === '').length
  const filled     = total - blankLines
  const displayed  = countBlank ? total : filled

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Line Counter</h1>
      <p className="tool-description">
        Count the number of lines in any text. Optionally exclude blank lines from the count.
      </p>

      <label htmlFor="lc-input">Your text</label>
      <textarea
        id="lc-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 200 }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', marginTop: '0.75rem', cursor: 'pointer' }}>
        <input type="checkbox" checked={countBlank} onChange={e => setCountBlank(e.target.checked)} />
        Include blank lines
      </label>

      {text && (
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: countBlank ? 'Total lines' : 'Non-blank lines', value: displayed },
            { label: 'Blank lines', value: blankLines },
            { label: 'Non-blank lines', value: filled },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: '1 1 120px', textAlign: 'center', padding: '1rem', background: 'var(--surface)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/line-counter" />
      <ToolSeo />
    </div>
  )
}
