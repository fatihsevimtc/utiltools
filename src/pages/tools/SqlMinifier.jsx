import { useState } from 'react'
import BackBar from '../../components/BackBar'

function minifySql(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--[^\n]*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function SqlMinifier() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? minifySql(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>SQL Minifier</h1>
      <p className="tool-description">Minify SQL queries by removing comments and extra whitespace.</p>

      <label htmlFor="sql-input">SQL input</label>
      <textarea
        id="sql-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'-- Select all users\nSELECT *\n  FROM users\n  WHERE active = 1; /* filter active */'}
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Minified output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
