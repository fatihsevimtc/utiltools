import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function EmptyLineRemover() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const lines = input.split('\n')
  const output = lines.filter(l => l.trim().length > 0).join('\n')
  const removed = lines.length - output.split('\n').filter(l => l.trim().length > 0).length

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Empty Line Remover</h1>
      <p className="tool-description">Remove all blank lines from text, keeping only lines with content.</p>

      <label htmlFor="elr-input">Input text</label>
      <textarea
        id="elr-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'Line 1\n\nLine 2\n\n\nLine 3'}
        style={{ minHeight: 160 }}
      />

      {input && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
          {lines.length} lines in → {output.split('\n').filter(l => l.trim()).length} lines out
          {removed > 0 && ` (${removed} blank line${removed !== 1 ? 's' : ''} removed)`}
        </p>
      )}

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
