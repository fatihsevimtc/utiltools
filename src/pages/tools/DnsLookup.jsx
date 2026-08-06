import { useState } from 'react'
import BackBar from '../../components/BackBar'

const TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA']

export default function DnsLookup() {
  const [domain, setDomain] = useState('')
  const [type, setType]     = useState('A')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function lookup() {
    const d = domain.trim().replace(/^https?:\/\//, '').split('/')[0]
    if (!d) return
    setLoading(true); setError(''); setResults(null)
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=${type}`)
      if (!res.ok) throw new Error('DNS query failed')
      const data = await res.json()
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const STATUS = { 0:'NOERROR', 1:'FORMERR', 2:'SERVFAIL', 3:'NXDOMAIN', 5:'REFUSED' }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>DNS Lookup</h1>
      <p className="tool-description">Query DNS records for any domain using Google's DNS-over-HTTPS API. No software needed.</p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input type="text" value={domain} onChange={e => setDomain(e.target.value)}
          placeholder="example.com" style={{ flex: 1 }}
          onKeyDown={e => e.key === 'Enter' && lookup()} />
        <select value={type} onChange={e => setType(e.target.value)} style={{ width: 100 }}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn" onClick={lookup} disabled={loading}>
          {loading ? 'Looking up…' : 'Lookup'}
        </button>
      </div>

      {error && <div className="notice notice-error">{error}</div>}

      {results && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              Status: <strong style={{ color: results.Status === 0 ? 'var(--success)' : 'var(--danger)' }}>
                {STATUS[results.Status] || results.Status}
              </strong>
            </span>
            {results.TC  && <span style={{ fontSize: '0.82rem', color: 'var(--warning)' }}>⚠ Truncated</span>}
            {results.RD  && <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Recursion desired</span>}
          </div>

          {results.Answer?.length > 0 ? (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 2fr', background: 'var(--surface2)', padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                <span>Name</span><span>Type</span><span>TTL</span><span>Data</span>
              </div>
              {results.Answer.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 2fr', padding: '0.6rem 1rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                  <span style={{ color: 'var(--muted)' }}>{r.name}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{TYPES[r.type - 1] || r.type}</span>
                  <span style={{ color: 'var(--muted)' }}>{r.TTL}s</span>
                  <span>{r.data}</span>
                </div>
              ))}
            </div>
          ) : (
            results.Status === 0
              ? <p style={{ color: 'var(--muted)' }}>No {type} records found for {domain}.</p>
              : <p style={{ color: 'var(--danger)' }}>Domain not found (NXDOMAIN).</p>
          )}
        </div>
      )}
    </div>
  )
}
