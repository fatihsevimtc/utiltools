import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

// Pure-JS HMAC-SHA256 via Web Crypto (browser native)
async function hmacSha256(key, data) {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64url(obj) {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export default function JwtEncoder() {
  const [header, setHeader]   = useState(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2))
  const [payload, setPayload] = useState(JSON.stringify({
    sub: '1234567890', name: 'John Doe', iat: Math.floor(Date.now()/1000)
  }, null, 2))
  const [secret, setSecret]   = useState('your-256-bit-secret')
  const [token, setToken]     = useState('')
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState(false)

  async function encode() {
    setError('')
    try {
      const h = JSON.parse(header)
      const p = JSON.parse(payload)
      const headerB64 = b64url(h)
      const payloadB64 = b64url(p)
      const sig = await hmacSha256(secret, `${headerB64}.${payloadB64}`)
      setToken(`${headerB64}.${payloadB64}.${sig}`)
    } catch (e) {
      setError(e.message)
    }
  }

  function copy() {
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JWT Encoder</h1>
      <p className="tool-description">Build and sign a JWT token with a custom header, payload, and HS256 secret. Runs entirely in your browser.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label htmlFor="jwte-header">Header (JSON)</label>
          <textarea id="jwte-header" value={header} onChange={e => setHeader(e.target.value)}
            style={{ minHeight: 80, fontFamily: 'monospace' }} />
        </div>
        <div>
          <label htmlFor="jwte-payload">Payload (JSON)</label>
          <textarea id="jwte-payload" value={payload} onChange={e => setPayload(e.target.value)}
            style={{ minHeight: 140, fontFamily: 'monospace' }} />
        </div>
        <div>
          <label htmlFor="jwte-secret">Secret (for HS256)</label>
          <input id="jwte-secret" type="text" value={secret} onChange={e => setSecret(e.target.value)} />
        </div>
      </div>

      <button className="btn" style={{ marginTop: '1rem' }} onClick={encode}>Sign & Encode</button>

      {error && <div className="notice notice-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {token && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>JWT Token</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ wordBreak: 'break-all', fontSize: '0.82rem' }}>
            {token.split('.').map((part, i) => (
              <span key={i} style={{ color: ['var(--danger)', 'var(--accent)', 'var(--success)'][i] }}>
                {part}{i < 2 ? '.' : ''}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            🔴 Header &nbsp; 🟣 Payload &nbsp; 🟢 Signature
          </p>
        </div>
      )}
    </div>
  )
}
