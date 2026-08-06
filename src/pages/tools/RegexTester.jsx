import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags]     = useState('g')
  const [text, setText]       = useState('The quick brown fox jumps over the lazy dog.')

  // Derive everything from state — no setError inside useMemo
  const { highlighted, matches, error } = useMemo(() => {
    if (!pattern) {
      return { highlighted: escapeHtml(text), matches: [], error: '' }
    }
    try {
      // Always add 'g' internally so we can collect all matches,
      // but respect whether the user has 'g' to decide how many to show.
      const safeFlags = flags.includes('g') ? flags : flags.replace(/[^gimsuy]/g, '')
      const re = new RegExp(pattern, safeFlags.includes('g') ? safeFlags : safeFlags + 'g')

      const found = []
      let m
      let lastIndex = 0

      while ((m = re.exec(text)) !== null) {
        // Guard against infinite loops from zero-length matches
        if (m.index === re.lastIndex) {
          re.lastIndex++
          continue
        }
        found.push({ index: m.index, length: m[0].length, value: m[0] })
        lastIndex = re.lastIndex
        // If user didn't set 'g', stop after first match
        if (!flags.includes('g')) break
      }

      // Build highlighted HTML
      let html = ''
      let cursor = 0
      for (const match of found) {
        html += escapeHtml(text.slice(cursor, match.index))
        html += `<mark class="regex-match">${escapeHtml(match.value)}</mark>`
        cursor = match.index + match.length
      }
      html += escapeHtml(text.slice(cursor))

      return { highlighted: html, matches: found, error: '' }
    } catch (e) {
      return { highlighted: escapeHtml(text), matches: [], error: e.message }
    }
  }, [pattern, flags, text])

  const flagOptions = [
    { f: 'g', label: 'g', title: 'Global — find all matches' },
    { f: 'i', label: 'i', title: 'Case insensitive' },
    { f: 'm', label: 'm', title: 'Multiline — ^ and $ match line boundaries' },
    { f: 's', label: 's', title: 'Dot-all — . matches newline' },
  ]

  function toggleFlag(f) {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)
  }

  // Match detail table
  const showGroups = matches.length > 0 && matches[0].groups

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Regex Tester</h1>
      <p className="tool-description">Test regular expressions against sample text with live match highlighting.</p>

      {/* Pattern + flags */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="rx-pattern">Pattern</label>
          <input
            id="rx-pattern"
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="\b\w+\b"
            style={{ fontFamily: 'monospace' }}
            spellCheck={false}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingBottom: '0.65rem' }}>
          {flagOptions.map(({ f, label, title }) => (
            <label key={f} title={title} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text)', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={flags.includes(f)}
                onChange={() => toggleFlag(f)}
                style={{ width: 'auto', accentColor: 'var(--accent)' }}
              />
              <code style={{ fontSize: '0.9rem' }}>{label}</code>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>⚠ {error}</p>
      )}

      {/* Test string */}
      <label htmlFor="rx-text" style={{ marginTop: '1rem' }}>Test string</label>
      <textarea
        id="rx-text"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ minHeight: 140, fontFamily: 'monospace', fontSize: '0.9rem' }}
        spellCheck={false}
      />

      {/* Match count */}
      <div style={{ display: 'flex', gap: '1rem', margin: '0.75rem 0 0.5rem', fontSize: '0.875rem', alignItems: 'center' }}>
        <span style={{ color: matches.length > 0 ? 'var(--success)' : 'var(--muted)' }}>
          {pattern
            ? error
              ? '—'
              : `${matches.length} match${matches.length !== 1 ? 'es' : ''}`
            : 'Enter a pattern above'}
        </span>
        {matches.length > 0 && !flags.includes('g') && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            (add <code>g</code> flag to find all)
          </span>
        )}
      </div>

      {/* Highlighted output */}
      <div
        className="code-block"
        style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
      />

      {/* Match list */}
      {matches.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <label>Matches</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: 200, overflowY: 'auto' }}>
            {matches.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', background: 'var(--surface)', borderRadius: 6, padding: '0.35rem 0.75rem', fontSize: '0.82rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)', minWidth: 24 }}>#{i + 1}</span>
                <code style={{ color: 'var(--warning)', flex: 1 }}>{m.value || '(empty)'}</code>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>index {m.index}–{m.index + m.length}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <details style={{ marginTop: '1.5rem' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '0.82rem', userSelect: 'none' }}>Quick reference</summary>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
          {[
            ['.', 'Any character except newline'],
            ['\\d', 'Digit [0-9]'],
            ['\\w', 'Word char [a-zA-Z0-9_]'],
            ['\\s', 'Whitespace'],
            ['\\b', 'Word boundary'],
            ['^', 'Start of string / line'],
            ['$', 'End of string / line'],
            ['*', '0 or more (greedy)'],
            ['+', '1 or more (greedy)'],
            ['?', '0 or 1 / non-greedy'],
            ['{n,m}', 'Between n and m times'],
            ['[abc]', 'Character class'],
            ['[^abc]', 'Negated class'],
            ['(abc)', 'Capture group'],
            ['(?:abc)', 'Non-capture group'],
            ['a|b', 'a or b'],
          ].map(([sym, desc]) => (
            <div key={sym} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', background: 'var(--surface)', borderRadius: 6, padding: '0.3rem 0.6rem' }}>
              <code style={{ color: 'var(--warning)', minWidth: 60, flexShrink: 0 }}>{sym}</code>
              <span style={{ color: 'var(--muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </details>
          <ToolSeo />
    </div>
  )
}
