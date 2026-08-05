import { useState } from 'react'
import BackBar from '../../components/BackBar'

const EMAIL_RE = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g

export default function EmailExtractor() {
  const [input, setInput] = useState('')
  const [unique, setUnique] = useState(true)
  const [copied, setCopied] = useState(false)

  const matches = input.match(EMAIL_RE) || []
  const results = unique ? [...new Set(matches)] : matches

  function copy() {
    navigator.clipboard.writeText(results.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Email Extractor</h1>
      <p className="tool-description">Pull all email addresses out of a block of text.</p>

      <label htmlFor="ee-input">Input text</label>
      <textarea
        id="ee-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste any text containing email addresses…"
        style={{ minHeight: 180 }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', cursor: 'pointer', color: 'var(--text)' }}>
        <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
        Remove duplicates
      </label>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>{results.length} email{results.length !== 1 ? 's' : ''} found</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{results.join('\n')}</div>
        </div>
      )}
      {input && results.length === 0 && (
        <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>No email addresses found.</p>
      )}
    </div>
  )
}
