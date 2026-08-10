import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function CommaSeparator() {
  const [text, setText]       = useState('')
  const [mode, setMode]       = useState('toComma')  // 'toComma' | 'toColumn'
  const [separator, setSep]   = useState(',')
  const [addSpace, setAddSpace] = useState(true)
  const [copied, setCopied]   = useState(false)

  const output = (() => {
    if (!text.trim()) return ''
    if (mode === 'toComma') {
      // lines → comma-separated
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      const sep = addSpace ? `${separator} ` : separator
      return lines.join(sep)
    } else {
      // comma-separated → lines
      const items = text.split(/[,;|]/).map(s => s.trim()).filter(Boolean)
      return items.join('\n')
    }
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Comma Separator / List Converter</h1>
      <p className="tool-description">
        Convert a line-by-line list into a comma-separated value, or split a comma-separated string into individual lines.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div className="chip-group">
          <button className={`chip ${mode === 'toComma' ? 'active' : ''}`} onClick={() => setMode('toComma')}>Lines → Comma list</button>
          <button className={`chip ${mode === 'toColumn' ? 'active' : ''}`} onClick={() => setMode('toColumn')}>Comma list → Lines</button>
        </div>
        {mode === 'toComma' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            Separator:
            <select value={separator} onChange={e => setSep(e.target.value)} style={{ padding: '0.25rem 0.5rem' }}>
              {[',', ';', '|', ' - '].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        )}
        {mode === 'toComma' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={addSpace} onChange={e => setAddSpace(e.target.checked)} />
            Space after separator
          </label>
        )}
      </div>

      <label htmlFor="cs-input">Input</label>
      <textarea
        id="cs-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'toComma' ? 'One item\nper line…' : 'apple, banana, cherry…'}
        style={{ minHeight: 180 }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/comma-separator" />
      <ToolSeo />
    </div>
  )
}
