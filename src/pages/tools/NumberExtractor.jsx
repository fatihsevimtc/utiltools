import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function NumberExtractor() {
  const [input, setInput] = useState('')
  const [includeDecimals, setIncludeDecimals] = useState(true)
  const [includeNegative, setIncludeNegative] = useState(true)
  const [unique, setUnique] = useState(false)
  const [copied, setCopied] = useState(false)

  const pattern = includeDecimals
    ? includeNegative ? /-?\d+(?:\.\d+)?/g : /\d+(?:\.\d+)?/g
    : includeNegative ? /-?\d+/g : /\d+/g

  const matches = (input.match(pattern) || []).map(Number)
  const results = unique ? [...new Set(matches)] : matches

  const sum = results.reduce((a, b) => a + b, 0)
  const avg = results.length ? sum / results.length : 0
  const min = results.length ? Math.min(...results) : null
  const max = results.length ? Math.max(...results) : null

  function copy() {
    navigator.clipboard.writeText(results.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Number Extractor</h1>
      <p className="tool-description">Extract all numbers from text and get quick statistics.</p>

      <label htmlFor="ne-input">Input text</label>
      <textarea
        id="ne-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="The temperature was -3.5°C, humidity 72%, wind speed 18 km/h"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {[
          ['Include decimals', includeDecimals, setIncludeDecimals],
          ['Include negatives', includeNegative, setIncludeNegative],
          ['Unique only', unique, setUnique],
        ].map(([label, val, set]) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', marginBottom: 0 }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
            {label}
          </label>
        ))}
      </div>

      {results.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
            {[
              ['Count', results.length],
              ['Sum', sum.toFixed(2)],
              ['Average', avg.toFixed(2)],
              ['Min', min],
              ['Max', max],
            ].map(([label, value]) => (
              <div key={label} style={{ background: 'var(--surface)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ marginBottom: 0 }}>Extracted numbers</label>
              <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
            </div>
            <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{results.join('\n')}</div>
          </div>
        </>
      )}
      {input && results.length === 0 && (
        <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>No numbers found.</p>
      )}
    </div>
  )
}
