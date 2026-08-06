import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

export default function DuplicateRemover() {
  const [input, setInput]         = useState('')
  const [caseSensitive, setCase]  = useState(false)
  const [trimLines, setTrim]      = useState(true)
  const [copied, setCopied]       = useState(false)

  function process(text) {
    let lines = text.split('\n')
    if (trimLines) lines = lines.map(l => l.trim())
    const seen = new Set()
    return lines.filter(line => {
      const key = caseSensitive ? line : line.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).join('\n')
  }

  const output = input ? process(input) : ''
  const removed = input ? input.split('\n').length - output.split('\n').length : 0

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Duplicate Line Remover</h1>
      <p className="tool-description">Paste text and remove all duplicate lines instantly.</p>

      <label htmlFor="dr-input">Input (one item per line)</label>
      <textarea id="dr-input" value={input} onChange={e => setInput(e.target.value)} placeholder={'apple\nbanana\napple\norange\nbanana'} style={{ minHeight: 180 }} />

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
        {[[caseSensitive, setCase, 'Case sensitive'],[trimLines, setTrim, 'Trim whitespace']].map(([val, setter, label]) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', cursor: 'pointer' }}>
            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
            {label}
          </label>
        ))}
      </div>

      {output && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0, color: removed > 0 ? 'var(--success)' : 'var(--muted)' }}>
              {removed > 0 ? `${removed} duplicate${removed>1?'s':''} removed` : 'No duplicates found'}
            </label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block">{output}</div>
        </div>
      )}
      <RelatedTools category="text" exclude="/tools/duplicate-remover" />
    </div>
  )
}
