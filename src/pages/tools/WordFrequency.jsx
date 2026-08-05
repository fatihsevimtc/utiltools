import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

export default function WordFrequency() {
  const [input, setInput] = useState('')
  const [sort, setSort] = useState('freq')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [limit, setLimit] = useState(20)

  const words = useMemo(() => {
    const text = caseSensitive ? input : input.toLowerCase()
    const tokens = text.match(/[a-z''-]+/gi) || []
    const freq = {}
    for (const w of tokens) {
      freq[w] = (freq[w] || 0) + 1
    }
    const entries = Object.entries(freq)
    if (sort === 'freq') entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    else entries.sort((a, b) => a[0].localeCompare(b[0]))
    return entries.slice(0, limit)
  }, [input, sort, caseSensitive, limit])

  const maxFreq = words[0]?.[1] ?? 1

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Word Frequency Counter</h1>
      <p className="tool-description">Count how often each word appears in a block of text.</p>

      <label htmlFor="wf-input">Input text</label>
      <textarea
        id="wf-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 160 }}
      />

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="chip-group" style={{ margin: 0 }}>
          <button className={`chip ${sort === 'freq' ? 'active' : ''}`} onClick={() => setSort('freq')}>By frequency</button>
          <button className={`chip ${sort === 'alpha' ? 'active' : ''}`} onClick={() => setSort('alpha')}>Alphabetical</button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', cursor: 'pointer', marginBottom: 0 }}>
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
          Case sensitive
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', marginBottom: 0 }}>
          Show top
          <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={{ width: 'auto', padding: '0.2rem 0.5rem' }}>
            {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {words.length > 0 && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {words.map(([word, count]) => (
            <div key={word} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <code style={{ minWidth: 120, color: 'var(--text)' }}>{word}</code>
              <div style={{ flex: 1, background: 'var(--border)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${(count / maxFreq) * 100}%`, background: 'var(--accent)', height: '100%', borderRadius: 4 }} />
              </div>
              <span style={{ minWidth: 30, textAlign: 'right', fontSize: '0.85rem', color: 'var(--muted)' }}>{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
