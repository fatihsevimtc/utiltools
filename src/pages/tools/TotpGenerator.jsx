import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

/* ── Tiny TOTP implementation using Web Crypto ── */

function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s/g, '')
  let bits = 0, value = 0
  const output = []
  for (const char of clean) {
    const idx = alphabet.indexOf(char)
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return new Uint8Array(output)
}

async function hotp(key, counter) {
  const keyBytes = base32Decode(key)
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const counterBuf = new ArrayBuffer(8)
  const view = new DataView(counterBuf)
  // Write 8-byte big-endian counter
  view.setUint32(4, counter & 0xffffffff)
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, counterBuf)
  const arr = new Uint8Array(sig)
  const offset = arr[19] & 0x0f
  const code = ((arr[offset] & 0x7f) << 24 | arr[offset + 1] << 16 | arr[offset + 2] << 8 | arr[offset + 3]) % 1000000
  return String(code).padStart(6, '0')
}

async function totp(secret, period = 30) {
  const counter = Math.floor(Date.now() / 1000 / period)
  return hotp(secret, counter)
}

const DEMO_SECRET = 'JBSWY3DPEHPK3PXP'

export default function TotpGenerator() {
  const [secret, setSecret] = useState(DEMO_SECRET)
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [error, setError] = useState('')

  async function refresh(sec) {
    if (!sec.trim()) { setCode(''); return }
    try {
      const c = await totp(sec.trim())
      setCode(c)
      setError('')
    } catch (e) {
      setError('Invalid secret key')
      setCode('')
    }
  }

  useEffect(() => {
    let id
    function tick() {
      const now = Math.floor(Date.now() / 1000)
      const left = 30 - (now % 30)
      setSecondsLeft(left)
      if (left === 30) refresh(secret)
    }
    refresh(secret)
    tick()
    id = setInterval(tick, 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret])

  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const pct = (secondsLeft / 30) * 100
  const barColor = secondsLeft <= 5 ? 'var(--danger)' : secondsLeft <= 10 ? '#f59e0b' : 'var(--success)'

  return (
    <div className="tool-page">
      <BackBar />
      <h1>TOTP / OTP Generator</h1>
      <p className="tool-description">
        Generate time-based one-time passwords (RFC 6238) from a Base32 secret. Works with Google Authenticator-compatible apps.
      </p>

      <label htmlFor="totp-secret">Base32 secret key</label>
      <input
        id="totp-secret"
        type="text"
        value={secret}
        onChange={e => setSecret(e.target.value.toUpperCase().replace(/\s/g, ''))}
        placeholder="JBSWY3DPEHPK3PXP"
        style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
      />

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>⚠ {error}</p>}

      {code && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--accent)' }}>
            {code.slice(0, 3)} {code.slice(3)}
          </div>
          <button className="btn btn-sm" onClick={copy} style={{ marginTop: '0.5rem' }}>{copied ? '✓ Copied' : 'Copy'}</button>

          {/* Countdown bar */}
          <div style={{ marginTop: '1rem', height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 3, transition: 'width 0.8s linear, background 0.3s' }} />
          </div>
          <p style={{ fontSize: '0.82rem', color: barColor, marginTop: '0.3rem' }}>Refreshes in {secondsLeft}s</p>
        </div>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        🔒 Your secret never leaves your browser. Use only test/demo secrets here — keep production secrets safe.
      </p>
    </div>
  )
}
