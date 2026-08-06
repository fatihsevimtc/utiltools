import { useState } from 'react'
import BackBar from '../../components/BackBar'

// Pure-JS PEM parser — extracts fields from X.509 DER via ASN.1
// We use a simplified approach: parse what we can from the cert text
function parsePem(pem) {
  try {
    const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')
    const der = atob(b64)
    const bytes = new Uint8Array(der.length)
    for (let i = 0; i < der.length; i++) bytes[i] = der.charCodeAt(i)

    // We'll use a TextDecoder trick — extract printable strings from DER
    // This is a heuristic approach since full ASN.1 parsing is complex
    const text = der
    const printable = []
    let i = 0
    while (i < text.length) {
      if ((text.charCodeAt(i) === 0x13 || text.charCodeAt(i) === 0x0C || text.charCodeAt(i) === 0x16 || text.charCodeAt(i) === 0x1A)) {
        const len = text.charCodeAt(i + 1)
        if (len > 0 && len < 256 && i + 2 + len <= text.length) {
          const str = text.slice(i + 2, i + 2 + len)
          if (/^[\x20-\x7E]+$/.test(str) && str.length > 2) printable.push(str)
        }
      }
      i++
    }

    // Extract dates (UTCTime format: YYMMDDHHMMSSZ)
    const dates = []
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) === 0x17) { // UTCTime tag
        const len = text.charCodeAt(j + 1)
        if (len === 13) {
          const d = text.slice(j + 2, j + 2 + len)
          if (/^\d{12}Z$/.test(d)) dates.push(d)
        }
      }
    }

    function parseUtcTime(s) {
      const yr = parseInt(s.slice(0,2))
      const year = yr >= 50 ? 1900 + yr : 2000 + yr
      return new Date(`${year}-${s.slice(2,4)}-${s.slice(4,6)}T${s.slice(6,8)}:${s.slice(8,10)}:${s.slice(10,12)}Z`)
    }

    const notBefore = dates[0] ? parseUtcTime(dates[0]) : null
    const notAfter  = dates[1] ? parseUtcTime(dates[1]) : null
    const daysLeft  = notAfter ? Math.ceil((notAfter - Date.now()) / (1000*60*60*24)) : null

    return { printable, notBefore, notAfter, daysLeft }
  } catch {
    return null
  }
}

export default function SslDecoder() {
  const [pem, setPem]     = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function decode() {
    setError('')
    setResult(null)
    if (!pem.includes('CERTIFICATE')) { setError('Paste a PEM certificate (-----BEGIN CERTIFICATE-----)'); return }
    const r = parsePem(pem)
    if (!r) { setError('Could not parse certificate. Make sure it is a valid PEM-encoded X.509 certificate.'); return }
    setResult(r)
  }

  const expiredOrSoon = !!result && result.daysLeft !== null && result.daysLeft < 30

  return (
    <div className="tool-page">
      <BackBar />
      <h1>SSL Certificate Decoder</h1>
      <p className="tool-description">Paste a PEM certificate to view its expiry date, subject, and other details. Runs entirely in your browser.</p>

      <label htmlFor="ssl-pem">PEM Certificate</label>
      <textarea id="ssl-pem" value={pem} onChange={e => setPem(e.target.value)}
        style={{ minHeight: 200, fontFamily: 'monospace', fontSize: '0.8rem' }}
        placeholder={'-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----'} />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={decode}>Decode</button>

      {error && <div className="notice notice-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {result && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          {result.daysLeft !== null && (
            <div className={`notice ${expiredOrSoon ? 'notice-warning' : ''}`}
              style={{ background: expiredOrSoon ? undefined : 'rgba(46,204,113,0.1)', border: `1px solid ${expiredOrSoon ? 'var(--warning)' : 'var(--success)'}`, color: expiredOrSoon ? 'var(--warning)' : 'var(--success)' }}>
              {result.daysLeft < 0 ? `⚠️ Certificate expired ${Math.abs(result.daysLeft)} days ago`
                : result.daysLeft < 30 ? `⚠️ Expires in ${result.daysLeft} days`
                : `✓ Valid for ${result.daysLeft} more days`}
            </div>
          )}

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {[
              ['Not Before', result.notBefore?.toUTCString() || '—'],
              ['Not After',  result.notAfter?.toUTCString()  || '—'],
              ['Days Remaining', result.daysLeft !== null ? `${result.daysLeft} days` : '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', borderBottom: '1px solid var(--border)', padding: '0.6rem 1rem' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{k}</span>
                <span style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </div>

          {result.printable.length > 0 && (
            <div>
              <label style={{ marginBottom: '0.5rem' }}>Certificate fields (extracted)</label>
              <div className="code-block" style={{ fontSize: '0.8rem' }}>
                {result.printable.join('\n')}
              </div>
            </div>
          )}
        </div>
      )}
          <ToolSeo />
    </div>
  )
}
