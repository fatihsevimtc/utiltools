import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TabsToSpaces() {
  const [text, setText]     = useState('')
  const [tabSize, setTabSize] = useState(4)
  const [mode, setMode]     = useState('toSpaces') // 'toSpaces' | 'toTabs'
  const [copied, setCopied] = useState(false)
  const [showInvisibles, setShowInvisibles] = useState(false)

  function handleInputKeyDown(e) {
    if (e.key !== 'Tab') return
    e.preventDefault()

    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const indent = mode === 'toSpaces' ? ' '.repeat(tabSize) : '\t'
    const next = text.slice(0, start) + indent + text.slice(end)

    setText(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + indent.length
    })
  }

  const output = (() => {
    if (!text) return ''
    if (mode === 'toSpaces') return text.replace(/\t/g, ' '.repeat(tabSize))
    return text.replace(new RegExp(' '.repeat(tabSize), 'g'), '\t')
  })()

  function visibleWhitespace(s) {
    return s.replace(/\t/g, '→\t').replace(/ /g, '·')
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
      <h1>Tabs ↔ Spaces Converter</h1>
      <p className="tool-description">
        Convert tab characters to spaces or spaces back to tabs. Set the tab size to match your project's style guide.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div className="chip-group">
          <button className={`chip ${mode === 'toSpaces' ? 'active' : ''}`} onClick={() => setMode('toSpaces')}>Tabs → Spaces</button>
          <button className={`chip ${mode === 'toTabs' ? 'active' : ''}`} onClick={() => setMode('toTabs')}>Spaces → Tabs</button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          Tab size:
          <select value={tabSize} onChange={e => setTabSize(Number(e.target.value))} style={{ padding: '0.25rem 0.5rem' }}>
            {[2, 4, 8].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showInvisibles} onChange={e => setShowInvisibles(e.target.checked)} />
          Show invisibles
        </label>
      </div>

      <label htmlFor="ts-input">Input</label>
      <textarea
        id="ts-input"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Paste your code or text here…"
        style={{ minHeight: 200, fontFamily: 'monospace' }}
      />

      {showInvisibles && text && (
        <div style={{ marginTop: '0.5rem' }}>
          <label style={{ marginBottom: '0.35rem', display: 'block' }}>Input preview (visible whitespace)</label>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{visibleWhitespace(text)}</div>
        </div>
      )}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 200, fontFamily: 'monospace', background: 'var(--surface)', cursor: 'default' }} />

          {showInvisibles && (
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ marginBottom: '0.35rem', display: 'block' }}>Output preview (visible whitespace)</label>
              <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{visibleWhitespace(output)}</div>
            </div>
          )}
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/tabs-to-spaces" />
      <ToolSeo />
    </div>
  )
}
