import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

const CDN = 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js'

function loadBcrypt() {
  return new Promise((resolve, reject) => {
    if (window.dcodeIO && window.dcodeIO.bcrypt) { resolve(window.dcodeIO.bcrypt); return }
    if (window.bcrypt) { resolve(window.bcrypt); return }
    const script = document.createElement('script')
    script.src = CDN
    script.onload = () => resolve(window.dcodeIO?.bcrypt || window.bcrypt)
    script.onerror = () => reject(new Error('Failed to load bcryptjs'))
    document.head.appendChild(script)
  })
}

export default function BcryptTool() {
  const [tab, setTab] = useState('hash')
  const [bcrypt, setBcrypt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState('')

  // Hash tab
  const [hashInput, setHashInput] = useState('')
  const [rounds, setRounds] = useState(10)
  const [hashing, setHashing] = useState(false)
  const [hashResult, setHashResult] = useState('')
  const [copiedHash, setCopiedHash] = useState(false)

  // Verify tab
  const [verifyText, setVerifyText] = useState('')
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    loadBcrypt()
      .then(b => { setBcrypt(b); setLoading(false) })
      .catch(e => { setLoadErr(e.message); setLoading(false) })
  }, [])

  async function doHash() {
    if (!bcrypt || !hashInput) return
    setHashing(true)
    setHashResult('')
    try {
      const h = await bcrypt.hash(hashInput, rounds)
      setHashResult(h)
    } catch (e) {
      setHashResult('Error: ' + e.message)
    }
    setHashing(false)
  }

  async function doVerify() {
    if (!bcrypt || !verifyText || !verifyHash) return
    setVerifying(true)
    setVerifyResult(null)
    try {
      const ok = await bcrypt.compare(verifyText, verifyHash)
      setVerifyResult(ok)
    } catch {
      setVerifyResult(false)
    }
    setVerifying(false)
  }

  function copyHash() {
    navigator.clipboard.writeText(hashResult).then(() => {
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Bcrypt Hash &amp; Verify</h1>
      <p className="tool-description">Hash and verify passwords using the bcrypt algorithm — runs securely in your browser.</p>

      {loading && <p style={{ opacity: 0.6 }}>Loading bcryptjs…</p>}
      {loadErr && <p style={{ color: 'var(--danger, #ef4444)' }}>Failed to load bcryptjs: {loadErr}</p>}

      {!loading && !loadErr && (
        <>
          <div className="chip-group" style={{ marginBottom: '1.25rem' }}>
            <button className={`chip ${tab === 'hash' ? 'active' : ''}`} onClick={() => setTab('hash')}>Hash</button>
            <button className={`chip ${tab === 'verify' ? 'active' : ''}`} onClick={() => setTab('verify')}>Verify</button>
          </div>

          {tab === 'hash' && (
            <>
              <label htmlFor="bcrypt-text">Text to hash</label>
              <input
                id="bcrypt-text"
                type="text"
                value={hashInput}
                onChange={e => setHashInput(e.target.value)}
                placeholder="my-secret-password"
                style={{ fontSize: '0.95rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', marginBottom: '0.75rem' }}
              />
              <label>Salt rounds: {rounds}</label>
              <input type="range" min={4} max={12} value={rounds} onChange={e => setRounds(+e.target.value)} style={{ width: '100%', marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.75rem' }}>
                Higher rounds = more secure but slower. Rounds {rounds} ≈ {Math.round(2 ** rounds / 1000)}ms.
              </p>
              <button className="btn" onClick={doHash} disabled={hashing || !hashInput}>
                {hashing ? 'Hashing…' : 'Generate Hash'}
              </button>

              {hashResult && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ marginBottom: 0 }}>Bcrypt hash</label>
                    <button className="btn btn-sm" onClick={copyHash}>{copiedHash ? '✓ Copied' : 'Copy'}</button>
                  </div>
                  <div className="code-block" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{hashResult}</div>
                </div>
              )}
            </>
          )}

          {tab === 'verify' && (
            <>
              <label htmlFor="verify-text">Plain text</label>
              <input
                id="verify-text"
                type="text"
                value={verifyText}
                onChange={e => setVerifyText(e.target.value)}
                placeholder="my-secret-password"
                style={{ fontSize: '0.95rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', marginBottom: '0.75rem' }}
              />
              <label htmlFor="verify-hash">Bcrypt hash</label>
              <input
                id="verify-hash"
                type="text"
                value={verifyHash}
                onChange={e => setVerifyHash(e.target.value)}
                placeholder="$2a$10$…"
                style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace', marginBottom: '0.75rem' }}
              />
              <button className="btn" onClick={doVerify} disabled={verifying || !verifyText || !verifyHash}>
                {verifying ? 'Verifying…' : 'Verify'}
              </button>

              {verifyResult !== null && (
                <div style={{
                  marginTop: '1rem', padding: '0.75rem 1.25rem', borderRadius: 8, fontWeight: 700, fontSize: '1.1rem',
                  background: verifyResult ? 'var(--success-bg, #dcfce7)' : 'var(--danger-bg, #fee2e2)',
                  color: verifyResult ? 'var(--success, #16a34a)' : 'var(--danger, #dc2626)',
                }}>
                  {verifyResult ? '✓ Match — password is correct' : '✗ No match — password is incorrect'}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
