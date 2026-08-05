import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function StringReverse() {
  const [input, setInput]   = useState('')
  const [mode, setMode]     = useState('chars')
  const [copied, setCopied] = useState(false)

  function reverse(text) {
    if (mode === 'chars') return text.split('').reverse().join('')
    if (mode === 'words') return text.split(/\s+/).reverse().join(' ')
    if (mode === 'lines') return text.split('\n').reverse().join('\n')
    return text
  }

  const output = input ? reverse(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>String Reverse</h1>
      <p className="tool-description">Reverse text by characters, words, or lines.</p>

      <div className="chip-group">
        {[['chars','Characters'],['words','Words'],['lines','Lines']].map(([v,l]) => (
          <button key={v} className={`chip ${mode===v?'active':''}`} onClick={() => setMode(v)}>{l}</button>
        ))}
      </div>

      <label htmlFor="sr-input">Input</label>
      <textarea id="sr-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste text here…" />

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
