import { useState } from 'react'
import BackBar from '../../components/BackBar'

function parseQueryString(input) {
  let qs = input.trim()
  try {
    const url = new URL(qs)
    qs = url.search
  } catch {
    if (!qs.startsWith('?')) qs = '?' + qs
  }
  const params = new URLSearchParams(qs)
  const entries = []
  for (const [k, v] of params.entries()) entries.push({ key: k, value: v })
  return entries
}

export default function QueryStringParser() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const entries = input.trim() ? parseQueryString(input) : []
  const json = entries.length ? JSON.stringify(Object.fromEntries(entries.map(e => [e.key, e.value])), null, 2) : ''

  function copy() {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Query String Parser</h1>
      <p className="tool-description">Parse URL query strings into key-value pairs with a clean JSON view.</p>

      <label htmlFor="qs-input">URL or query string</label>
      <input
        id="qs-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="https://example.com/search?q=hello&page=2&sort=asc"
        style={{ fontSize: '0.95rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box' }}
      />

      {entries.length > 0 && (
        <>
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <label>Parsed parameters</label>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface2, #f0f0f0)' }}>
                  <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>Key</th>
                  <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)', color: 'var(--accent, #6366f1)' }}>{e.key}</td>
                    <td style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>{e.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ marginBottom: 0 }}>JSON output</label>
              <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy JSON'}</button>
            </div>
            <div className="code-block" style={{ whiteSpace: 'pre' }}>{json}</div>
          </div>
        </>
      )}
    </div>
  )
}
