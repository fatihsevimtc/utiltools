import { useState } from 'react'
import BackBar from '../../components/BackBar'

function formatJs(code) {
  let result = ''
  let indent = 0
  const lines = code
    .replace(/\{/g, '{\n').replace(/\}/g, '\n}\n').replace(/;/g, ';\n')
    .split('\n').map(l => l.trim()).filter(l => l.length > 0)
  for (const line of lines) {
    if (line.startsWith('}')) indent = Math.max(0, indent - 1)
    result += '  '.repeat(indent) + line + '\n'
    if (line.endsWith('{')) indent++
  }
  return result.trim()
}

export default function JsFormatter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? formatJs(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JS Formatter</h1>
      <p className="tool-description">Beautify and format JavaScript code with proper indentation.</p>

      <label htmlFor="js-input">JavaScript input</label>
      <textarea
        id="js-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="function hello(){console.log('world');}"
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Formatted output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
