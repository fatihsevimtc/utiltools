import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MODES = [
  { id: 'kebab-to-camel',  label: 'kebab → camelCase',  fn: s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) },
  { id: 'camel-to-kebab',  label: 'camelCase → kebab',  fn: s => s.replace(/([A-Z])/g, c => '-' + c.toLowerCase()).replace(/^-/, '') },
  { id: 'snake-to-camel',  label: 'snake → camelCase',  fn: s => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase()) },
  { id: 'camel-to-snake',  label: 'camelCase → snake',  fn: s => s.replace(/([A-Z])/g, c => '_' + c.toLowerCase()).replace(/^_/, '') },
]

export default function KebabCamel() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('kebab-to-camel')
  const [copied, setCopied] = useState(false)

  const fn = MODES.find(m => m.id === mode)?.fn ?? (s => s)
  const output = input ? input.split('\n').map(fn).join('\n') : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Kebab ↔ camelCase</h1>
      <p className="tool-description">Convert between kebab-case, camelCase, and snake_case naming conventions.</p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        {MODES.map(m => (
          <button key={m.id} className={`chip ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <label htmlFor="kc-input">Input (one identifier per line)</label>
      <textarea
        id="kc-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="my-variable-name"
        style={{ minHeight: 140, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
