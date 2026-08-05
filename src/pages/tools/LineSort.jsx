import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MODES = [
  { id: 'az',     label: 'A → Z' },
  { id: 'za',     label: 'Z → A' },
  { id: 'len-asc',label: 'Shortest first' },
  { id: 'len-desc',label: 'Longest first' },
  { id: 'random', label: 'Shuffle' },
]

export default function LineSort() {
  const [input, setInput]   = useState('')
  const [mode, setMode]     = useState('az')
  const [copied, setCopied] = useState(false)

  function sort(text) {
    const lines = text.split('\n')
    if (mode === 'az')       return [...lines].sort((a,b) => a.localeCompare(b)).join('\n')
    if (mode === 'za')       return [...lines].sort((a,b) => b.localeCompare(a)).join('\n')
    if (mode === 'len-asc')  return [...lines].sort((a,b) => a.length - b.length).join('\n')
    if (mode === 'len-desc') return [...lines].sort((a,b) => b.length - a.length).join('\n')
    if (mode === 'random')   return [...lines].sort(() => Math.random() - 0.5).join('\n')
    return text
  }

  const output = input ? sort(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Line Sorter</h1>
      <p className="tool-description">Sort lines alphabetically, by length, or shuffle them randomly.</p>

      <div className="chip-group">
        {MODES.map(m => (
          <button key={m.id} className={`chip ${mode===m.id?'active':''}`} onClick={() => setMode(m.id)}>{m.label}</button>
        ))}
      </div>

      <label htmlFor="ls-input">Input (one item per line)</label>
      <textarea id="ls-input" value={input} onChange={e => setInput(e.target.value)} placeholder={'banana\napple\ncherry'} style={{ minHeight: 180 }} />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block">{output}</div>
        </div>
      )}
    </div>
  )
}
