import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function IndentText() {
  const [text, setText]     = useState('')
  const [mode, setMode]     = useState('indent')
  const [amount, setAmount] = useState(2)
  const [useTab, setUseTab] = useState(false)
  const [copied, setCopied] = useState(false)

  const indent = useTab ? '\t' : ' '.repeat(amount)

  const output = (() => {
    if (!text) return ''
    if (mode === 'indent') {
      return text.split('\n').map(line => indent + line).join('\n')
    }
    // unindent: strip up to `amount` leading spaces (or one tab)
    return text.split('\n').map(line => {
      if (useTab) return line.startsWith('\t') ? line.slice(1) : line
      let stripped = 0
      let i = 0
      while (i < line.length && line[i] === ' ' && stripped < amount) { i++; stripped++ }
      return line.slice(i)
    }).join('\n')
  })()

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = text.slice(0, start) + indent + text.slice(end)
    setText(next)
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + indent.length })
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Indent / Unindent Text</h1>
      <p className="tool-description">
        Add or remove indentation from every line of text. Supports spaces or tab characters with a configurable indent width.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
        <div className="chip-group">
          <button className={`chip ${mode === 'indent' ? 'active' : ''}`} onClick={() => setMode('indent')}>Indent →</button>
          <button className={`chip ${mode === 'unindent' ? 'active' : ''}`} onClick={() => setMode('unindent')}>← Unindent</button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={useTab} onChange={e => setUseTab(e.target.checked)} />
          Use tab
        </label>
        {!useTab && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            Spaces:
            <select value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ padding: '0.25rem 0.5rem' }}>
              {[1, 2, 4, 8].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
      </div>

      <label htmlFor="it-input">Input</label>
      <textarea
        id="it-input"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste your text or code here…"
        style={{ minHeight: 200, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 200, fontFamily: 'monospace', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/indent-text" />
      <ToolSeo />
    </div>
  )
}
