import { useState } from 'react'
import BackBar from '../../components/BackBar'

function parseUrl(raw) {
  try {
    const u = new URL(raw)
    const params = []
    u.searchParams.forEach((v, k) => params.push({ key: k, value: v }))
    return {
      protocol: u.protocol.replace(':', ''),
      hostname: u.hostname,
      port: u.port || '(default)',
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      params,
      error: null,
    }
  } catch (e) {
    return { error: e.message }
  }
}

function Row({ label, value }) {
  if (!value || value === '(default)' || value === '' || value === '#') return null
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--muted)', minWidth: 110, fontSize: '0.85rem' }}>{label}</span>
      <code style={{ wordBreak: 'break-all', color: 'var(--text)' }}>{value}</code>
    </div>
  )
}

export default function UrlParser() {
  const [input, setInput] = useState('https://example.com:8080/path/page?name=Alice&age=30#section')
  const result = input.trim() ? parseUrl(input.trim()) : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>URL Parser</h1>
      <p className="tool-description">Break a URL into its component parts — protocol, host, path, query params, and fragment.</p>

      <label htmlFor="url-input">URL</label>
      <input
        id="url-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="https://example.com/path?key=value#hash"
      />

      {result && (
        result.error
          ? <p style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.875rem' }}>⚠ {result.error}</p>
          : (
            <div style={{ marginTop: '1.5rem' }}>
              <div className="code-block" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', fontFamily: 'inherit' }}>
                <Row label="Protocol"  value={result.protocol} />
                <Row label="Host"      value={result.hostname} />
                <Row label="Port"      value={result.port} />
                <Row label="Path"      value={result.pathname} />
                <Row label="Search"    value={result.search} />
                <Row label="Hash"      value={result.hash} />
                <Row label="Origin"    value={result.origin} />
              </div>

              {result.params.length > 0 && (
                <>
                  <label>Query parameters</label>
                  <div className="code-block" style={{ padding: '0.75rem 1rem' }}>
                    {result.params.map(p => (
                      <div key={p.key} style={{ display: 'flex', gap: '1rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                        <code style={{ color: 'var(--accent)', minWidth: 100 }}>{p.key}</code>
                        <code style={{ wordBreak: 'break-all' }}>{p.value}</code>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
      )}
    </div>
  )
}
