import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

const CODES = [
  // 1xx
  { code: 100, name: 'Continue',                        desc: 'Server received request headers; client should proceed.' },
  { code: 101, name: 'Switching Protocols',             desc: 'Server agrees to switch protocols as requested by the client.' },
  // 2xx
  { code: 200, name: 'OK',                              desc: 'Request succeeded.' },
  { code: 201, name: 'Created',                         desc: 'Resource successfully created.' },
  { code: 202, name: 'Accepted',                        desc: 'Request accepted for processing, but not yet completed.' },
  { code: 204, name: 'No Content',                      desc: 'Request succeeded but no content to return.' },
  { code: 206, name: 'Partial Content',                 desc: 'Partial GET request fulfilled.' },
  // 3xx
  { code: 301, name: 'Moved Permanently',               desc: 'Resource has permanently moved to a new URL.' },
  { code: 302, name: 'Found',                           desc: 'Resource temporarily at a different URL.' },
  { code: 304, name: 'Not Modified',                    desc: 'Cached version is still valid.' },
  { code: 307, name: 'Temporary Redirect',              desc: 'Same as 302 but method must not change.' },
  { code: 308, name: 'Permanent Redirect',              desc: 'Same as 301 but method must not change.' },
  // 4xx
  { code: 400, name: 'Bad Request',                     desc: 'Server cannot process the request due to client error.' },
  { code: 401, name: 'Unauthorized',                    desc: 'Authentication required.' },
  { code: 403, name: 'Forbidden',                       desc: 'Server refuses to authorize the request.' },
  { code: 404, name: 'Not Found',                       desc: 'Resource not found.' },
  { code: 405, name: 'Method Not Allowed',              desc: 'HTTP method not supported for this resource.' },
  { code: 408, name: 'Request Timeout',                 desc: 'Client took too long to send the request.' },
  { code: 409, name: 'Conflict',                        desc: 'Request conflicts with the current state of the resource.' },
  { code: 410, name: 'Gone',                            desc: 'Resource permanently deleted.' },
  { code: 413, name: 'Content Too Large',               desc: 'Request body exceeds server limit.' },
  { code: 414, name: 'URI Too Long',                    desc: 'URI exceeds server limit.' },
  { code: 415, name: 'Unsupported Media Type',          desc: 'Media format not supported.' },
  { code: 422, name: 'Unprocessable Content',           desc: 'Semantic errors in the request.' },
  { code: 429, name: 'Too Many Requests',               desc: 'Rate limit exceeded.' },
  // 5xx
  { code: 500, name: 'Internal Server Error',           desc: 'Generic server-side error.' },
  { code: 501, name: 'Not Implemented',                 desc: 'Server does not support the request method.' },
  { code: 502, name: 'Bad Gateway',                     desc: 'Invalid response from upstream server.' },
  { code: 503, name: 'Service Unavailable',             desc: 'Server temporarily unable to handle request.' },
  { code: 504, name: 'Gateway Timeout',                 desc: 'Upstream server did not respond in time.' },
  { code: 505, name: 'HTTP Version Not Supported',      desc: 'HTTP version not supported.' },
]

const GROUP_COLORS = {
  1: '#6c757d', 2: '#28a745', 3: '#007bff', 4: '#ffc107', 5: '#dc3545',
}

function groupColor(code) {
  return GROUP_COLORS[Math.floor(code / 100)] || '#6c757d'
}

export default function HttpStatusCodes() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return q
      ? CODES.filter(c => c.name.toLowerCase().includes(q) || String(c.code).includes(q) || c.desc.toLowerCase().includes(q))
      : CODES
  }, [query])

  return (
    <div className="tool-page">
      <BackBar />
      <h1>HTTP Status Codes</h1>
      <p className="tool-description">Quick reference for all common HTTP status codes with descriptions.</p>

      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by code or name…"
        style={{ marginBottom: '1.25rem' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filtered.map(c => (
          <div key={c.code} style={{
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            background: 'var(--surface)', borderRadius: 8, padding: '0.6rem 0.9rem',
            border: '1px solid var(--border)',
          }}>
            <code style={{
              background: groupColor(c.code), color: '#fff', borderRadius: 6,
              padding: '0.15rem 0.55rem', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
            }}>
              {c.code}
            </code>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{c.desc}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: 'var(--muted)' }}>No codes found for "{query}"</p>}
      </div>
      <RelatedTools category="developer" exclude="/tools/http-status" />
    </div>
  )
}
