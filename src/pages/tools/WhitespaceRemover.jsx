import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MODES = [
  { id: 'leading',   label: 'Leading spaces',   fn: t => t.replace(/^[ \t]+/gm, '') },
  { id: 'trailing',  label: 'Trailing spaces',  fn: t => t.replace(/[ \t]+$/gm, '') },
  { id: 'both',      label: 'Both',             fn: t => t.replace(/^[ \t]+|[ \t]+$/gm, '') },
  { id: 'all',       label: 'All whitespace',   fn: t => t.replace(/\s+/g, '') },
  { id: 'collapse',  label: 'Collapse spaces',  fn: t => t.replace(/[ \t]+/g, ' ').replace(/^[ \t]+|[ \t]+$/gm, '') },
  { id: 'blank',     label: 'Empty lines',      fn: t => t.replace(/^\s*[\r\n]/gm, '') },
  { id: 'linebreak', label: 'Line breaks',      fn: t => t.replace(/[\r\n]+/g, ' ') },
]

export default function WhitespaceRemover() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('both')
  const [copied, setCopied] = useState(false)

  const fn = MODES.find(m => m.id === mode)?.fn ?? (t => t)
  const output = input ? fn(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Whitespace Remover</h1>
      <p className="tool-description">Remove or normalize whitespace and line breaks from text.</p>

      <label htmlFor="ws-input">Input text</label>
      <textarea
        id="ws-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="  paste text with   extra spaces here…  "
        style={{ minHeight: 160 }}
      />

      <div className="chip-group" style={{ marginTop: '1rem' }}>
        {MODES.map(m => (
          <button key={m.id} className={`chip ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
