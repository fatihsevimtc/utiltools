import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function CharacterRemover() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('remove') // 'remove' | 'replace'
  const [target, setTarget] = useState('')
  const [replacement, setReplacement] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [copied, setCopied] = useState(false)

  const result = (() => {
    if (!text || !target) return text
    const flags = caseSensitive ? 'g' : 'gi'
    try {
      const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return text.replace(new RegExp(escaped, flags), mode === 'replace' ? replacement : '')
    } catch {
      return text
    }
  })()

  const removedCount = text.length - result.length + (mode === 'replace' ? replacement.length * (text.split(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? 'g' : 'gi')).length - 1) : 0)

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Character Remover / Replacer</h1>
      <p className="tool-description">
        Remove or replace any character or substring from your text instantly. Everything stays in your browser.
      </p>

      <label htmlFor="cr-input">Input text</label>
      <textarea
        id="cr-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '0.5rem' }}>
        <div style={{ flex: '1 1 100px' }}>
          <label>Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="remove">Remove</option>
            <option value="replace">Replace</option>
          </select>
        </div>
        <div style={{ flex: '2 1 180px' }}>
          <label htmlFor="cr-target">{mode === 'remove' ? 'Character / string to remove' : 'Find'}</label>
          <input id="cr-target" value={target} onChange={e => setTarget(e.target.value)} placeholder={mode === 'remove' ? 'e.g. @ or hello' : 'Find this…'} />
        </div>
        {mode === 'replace' && (
          <div style={{ flex: '2 1 180px' }}>
            <label htmlFor="cr-repl">Replace with</label>
            <input id="cr-repl" value={replacement} onChange={e => setReplacement(e.target.value)} placeholder="Replacement text" />
          </div>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', paddingBottom: '0.25rem' }}>
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
          Case sensitive
        </label>
      </div>

      {text && target && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {result === text ? 'No matches found' : `${text.length - result.replace(/./g, '').length !== undefined ? '' : ''}Result`}
            </span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 140, background: 'var(--surface)', cursor: 'default' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/character-remover" />
      <ToolSeo />
    </div>
  )
}
