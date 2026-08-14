import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function GrepTool() {
  const [text, setText]           = useState('')
  const [pattern, setPattern]     = useState('')
  const [flags, setFlags]         = useState({ i: true, m: false })
  const [mode, setMode]           = useState('match')   // match | invert | extract
  const [copied, setCopied]       = useState(false)
  const [error, setError]         = useState('')

  const result = useMemo(() => {
    setError('')
    if (!text || !pattern) return null

    let regex
    try {
      const f = (flags.i ? 'i' : '') + (flags.m ? 'm' : '') + 'g'
      regex = new RegExp(pattern, f)
    } catch (e) {
      setError(e.message)
      return null
    }

    const lines = text.split('\n')

    if (mode === 'extract') {
      // Extract all regex matches (not lines)
      const matches = []
      for (const line of lines) {
        const found = [...line.matchAll(regex)]
        found.forEach(m => matches.push(m[0]))
      }
      return { lines: matches, count: matches.length, label: 'matches extracted' }
    }

    const filtered = lines.filter(line => {
      regex.lastIndex = 0
      const match = regex.test(line)
      return mode === 'match' ? match : !match
    })

    return { lines: filtered, count: filtered.length, label: mode === 'match' ? 'lines matched' : 'lines kept' }
  }, [text, pattern, flags, mode])

  const output = result ? result.lines.join('\n') : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const FLAG_LABELS = [
    { key: 'i', label: 'Case-insensitive (-i)' },
    { key: 'm', label: 'Multiline (-m)' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Grep — Regex Line Search</h1>
      <p className="tool-description">
        Filter lines of text using a regular expression — like the classic <code>grep</code> command, running entirely in your browser.
      </p>

      <label htmlFor="grep-pattern">Pattern (regex)</label>
      <input
        id="grep-pattern"
        type="text"
        value={pattern}
        onChange={e => setPattern(e.target.value)}
        placeholder="e.g. error|warn|^\s*#"
        style={{ fontFamily: 'monospace', fontSize: '0.95rem', marginBottom: '0.5rem' }}
      />
      {error && <p style={{ color: 'var(--error, #e53e3e)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>⚠ {error}</p>}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div className="chip-group">
          <button className={`chip ${mode === 'match' ? 'active' : ''}`} onClick={() => setMode('match')}>Keep matching lines</button>
          <button className={`chip ${mode === 'invert' ? 'active' : ''}`} onClick={() => setMode('invert')}>Exclude matching lines (-v)</button>
          <button className={`chip ${mode === 'extract' ? 'active' : ''}`} onClick={() => setMode('extract')}>Extract matches only (-o)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
        {FLAG_LABELS.map(({ key, label }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={flags[key]}
              onChange={e => setFlags(f => ({ ...f, [key]: e.target.checked }))}
            />
            {label}
          </label>
        ))}
      </div>

      <label htmlFor="grep-input">Input text</label>
      <textarea
        id="grep-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'Paste your text or log file here…\nLine 2\nERROR: something went wrong\nLine 4\nWARN: low disk space'}
        rows={8}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      {result !== null && pattern && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>
              Output
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>
                ({result.count} {result.label})
              </span>
            </label>
            {output && <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>}
          </div>
          {output ? (
            <textarea
              readOnly
              value={output}
              rows={Math.min(result.lines.length + 1, 14)}
              style={{ background: 'var(--surface)', cursor: 'default', fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No {mode === 'invert' ? 'non-matching' : 'matching'} lines found.</p>
          )}
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🔍', name: 'Regex Tester',      path: '/tools/regex-tester' },
        { icon: '🔁', name: 'Regex Replacer',    path: '/tools/regex-replacer' },
        { icon: '🔎', name: 'Find & Replace',    path: '/tools/find-replace' },
        { icon: '↕️', name: 'Line Sorter',        path: '/tools/line-sort' },
      ]} />
      <ToolSeo />
    </div>
  )
}
