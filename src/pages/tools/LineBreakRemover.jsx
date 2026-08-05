import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MODES = [
  { id: 'all',       label: 'All line breaks',       fn: t => t.replace(/[\r\n]+/g, ' ').trim() },
  { id: 'empty',     label: 'Empty lines only',       fn: t => t.replace(/^\s*[\r\n]/gm, '').trim() },
  { id: 'extra',     label: 'Extra blank lines',      fn: t => t.replace(/\n{3,}/g, '\n\n').trim() },
  { id: 'windows',   label: 'Windows (CRLF→LF)',     fn: t => t.replace(/\r\n/g, '\n') },
  { id: 'join',      label: 'Join with comma',        fn: t => t.split(/\n+/).map(l => l.trim()).filter(Boolean).join(', ') },
  { id: 'joinspace', label: 'Join with space',        fn: t => t.split(/\n+/).map(l => l.trim()).filter(Boolean).join(' ') },
]

export default function LineBreakRemover() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('empty')
  const [copied, setCopied] = useState(false)

  const fn = MODES.find(m => m.id === mode)?.fn ?? (t => t)
  const output = input ? fn(input) : ''

  const savedLines = input.split('\n').length - output.split('\n').length

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Line Break Remover</h1>
      <p className="tool-description">Remove or clean up line breaks and blank lines from text.</p>

      <label htmlFor="lbr-input">Input text</label>
      <textarea
        id="lbr-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste text with unwanted line breaks…"
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>
              Output
              {savedLines > 0 && <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--success)' }}>−{savedLines} line{savedLines !== 1 ? 's' : ''}</span>}
            </label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
