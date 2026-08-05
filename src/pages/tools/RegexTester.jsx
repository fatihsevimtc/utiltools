import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags]     = useState('g')
  const [text, setText]       = useState('The quick brown fox jumps over the lazy dog.')
  const [error, setError]     = useState('')

  const { highlighted, matches } = useMemo(() => {
    if (!pattern) return { highlighted: text, matches: [] }
    try {
      const re = new RegExp(pattern, flags)
      setError('')
      const found = []
      let m
      const gRe = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      while ((m = gRe.exec(text)) !== null) {
        found.push({ index: m.index, length: m[0].length, value: m[0] })
        if (!flags.includes('g')) break
      }
      // Build highlighted HTML safely
      let result = ''
      let last = 0
      for (const match of found) {
        result += text.slice(last, match.index).replace(/</g,'&lt;').replace(/>/g,'&gt;')
        result += `<mark class="regex-match">${match.value.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</mark>`
        last = match.index + match.length
      }
      result += text.slice(last).replace(/</g,'&lt;').replace(/>/g,'&gt;')
      return { highlighted: result, matches: found }
    } catch (e) {
      setError(e.message)
      return { highlighted: text.replace(/</g,'&lt;').replace(/>/g,'&gt;'), matches: [] }
    }
  }, [pattern, flags, text])

  const flagOptions = ['g','i','m','s']

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Regex Tester</h1>
      <p className="tool-description">Test regular expressions against sample text with live match highlighting.</p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="rx-pattern">Pattern</label>
          <input id="rx-pattern" type="text" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="\b\w+\b" style={{ fontFamily: 'monospace' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingBottom: '0.1rem' }}>
          {flagOptions.map(f => (
            <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text)' }}>
              <input type="checkbox" checked={flags.includes(f)} style={{ width: 'auto', accentColor: 'var(--accent)' }}
                onChange={e => setFlags(prev => e.target.checked ? prev+f : prev.replace(f,''))} />
              {f}
            </label>
          ))}
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>⚠ {error}</p>}

      <label htmlFor="rx-text" style={{ marginTop: '1rem' }}>Test string</label>
      <textarea id="rx-text" value={text} onChange={e => setText(e.target.value)} style={{ minHeight: 140 }} />

      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: matches.length > 0 ? 'var(--success)' : 'var(--muted)' }}>
            {matches.length} match{matches.length !== 1 ? 'es' : ''}
          </span>
        </div>
        <div className="code-block" style={{ fontFamily: 'var(--font)', whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  )
}
