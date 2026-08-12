import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'
import DeveloperPortalBanner from '../../components/DeveloperPortalBanner'

function b64Decode(str) {
  try {
    return JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState('')

  const parts = token.trim().split('.')
  const isValid = parts.length === 3
  const header  = isValid ? b64Decode(parts[0]) : null
  const payload = isValid ? b64Decode(parts[1]) : null

  function Section({ title, data, color }) {
    if (!data) return null
    return (
      <div style={{ marginTop: '1.25rem' }}>
        <label style={{ color }}>{title}</label>
        <pre className="code-block" style={{ borderColor: color, marginTop: '0.4rem' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    )
  }

  // Show expiry info if present
  const exp = payload?.exp
  const expDate = exp ? new Date(exp * 1000) : null
  const expired = expDate ? expDate < new Date() : false

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JWT Decoder</h1>
      <p className="tool-description">Paste a JWT token to decode and inspect its header and payload. Nothing is sent to any server.</p>

      <DeveloperPortalBanner packageName="JWT utilities" />

      <label htmlFor="jwt-input">JWT Token</label>
      <textarea id="jwt-input" value={token} onChange={e => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" style={{ minHeight: 100, wordBreak: 'break-all' }} />

      {token && !isValid && (
        <p style={{ color: 'var(--danger)', marginTop: '0.75rem' }}>Invalid JWT — must have 3 parts separated by dots.</p>
      )}

      {expDate && (
        <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius)', background: expired ? 'rgba(255,95,87,0.1)' : 'rgba(46,204,113,0.1)', border: `1px solid ${expired ? 'var(--danger)' : 'var(--success)'}`, fontSize: '0.875rem', color: expired ? 'var(--danger)' : 'var(--success)' }}>
          {expired ? '⚠ Token expired' : '✓ Token valid'} — expires {expDate.toLocaleString()}
        </div>
      )}

      <Section title="Header" data={header} color="var(--accent)" />
      <Section title="Payload" data={payload} color="var(--success)" />

      {isValid && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>Signature <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(not verified — verification requires the secret key)</span></label>
          <div className="code-block" style={{ color: 'var(--warning)', marginTop: '0.4rem', wordBreak: 'break-all' }}>{parts[2]}</div>
        </div>
      )}
          <ToolSeo />
    </div>
  )
}
