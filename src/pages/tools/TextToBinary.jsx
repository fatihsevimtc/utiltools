import { useState } from 'react'
import BackBar from '../../components/BackBar'

function textToBin(text) {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
}

function binToText(bin) {
  const parts = bin.trim().split(/\s+/)
  return parts.map(b => String.fromCharCode(parseInt(b, 2))).join('')
}

export default function TextToBinary() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  let output = ''
  let error = ''
  try {
    output = mode === 'encode' ? textToBin(input) : binToText(input)
  } catch (e) {
    error = 'Invalid binary input'
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text ↔ Binary</h1>
      <p className="tool-description">Convert text to binary (8-bit per character) and back.</p>

      <div className="chip-group">
        <button className={`chip ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>Text → Binary</button>
        <button className={`chip ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>Binary → Text</button>
      </div>

      <label htmlFor="t2b-input" style={{ marginTop: '1rem' }}>
        {mode === 'encode' ? 'Input text' : 'Binary input (space-separated bytes)'}
      </label>
      <textarea
        id="t2b-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Hello' : '01001000 01100101 01101100 01101100 01101111'}
        style={{ minHeight: 120, fontFamily: 'monospace' }}
      />

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && !error && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
