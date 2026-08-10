import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function FindReplace() {
  const [text, setText] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [copied, setCopied] = useState(false)
  const [regexError, setRegexError] = useState('')

  const { result, matchCount } = useMemo(() => {
    if (!text || !find) return { result: text, matchCount: 0 }
    setRegexError('')
    try {
      let pattern = find
      if (!useRegex) pattern = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (wholeWord && !useRegex) pattern = `\\b${pattern}\\b`
      const flags = 'g' + (caseSensitive ? '' : 'i')
      const re = new RegExp(pattern, flags)
      const matches = text.match(re)
      return { result: text.replace(re, replace), matchCount: matches ? matches.length : 0 }
    } catch (e) {
      setRegexError(e.message)
      return { result: text, matchCount: 0 }
    }
  }, [text, find, replace, useRegex, caseSensitive, wholeWord])

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Find &amp; Replace</h1>
      <p className="tool-description">
        Find text and replace it — supports plain text, whole-word matching, and regular expressions. Nothing leaves your browser.
      </p>

      <label htmlFor="fr-input">Input text</label>
      <textarea
        id="fr-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 160 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="fr-find">Find</label>
          <input id="fr-find" value={find} onChange={e => setFind(e.target.value)} placeholder="Text to find…" />
          {regexError && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{regexError}</span>}
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="fr-replace">Replace with</label>
          <input id="fr-replace" value={replace} onChange={e => setReplace(e.target.value)} placeholder="Replacement (leave blank to delete)" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {[
          ['useRegex', 'Regex', useRegex, setUseRegex],
          ['caseSensitive', 'Case sensitive', caseSensitive, setCaseSensitive],
          ['wholeWord', 'Whole word', wholeWord, setWholeWord],
        ].map(([id, label, val, setter]) => (
          <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      {text && find && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {matchCount} replacement{matchCount !== 1 ? 's' : ''} made
            </span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy result'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 160, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/find-replace" />
      <ToolSeo />
    </div>
  )
}
