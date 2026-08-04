import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'

const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  digits:  '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const WORDLIST = [
  'apple','brave','cloud','dance','eagle','frost','globe','honey','ivory','jelly',
  'knack','lemon','maple','night','ocean','piano','queen','river','stone','tiger',
  'ultra','vivid','water','xenon','yacht','zebra','blaze','crisp','dwarf','elbow',
]

function scorePassword(pwd) {
  let score = 0
  if (pwd.length >= 8)  score++
  if (pwd.length >= 12) score++
  if (pwd.length >= 16) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return Math.min(score, 5)
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
const STRENGTH_COLORS = ['', '#ff5f57', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60']

export default function PasswordGenerator() {
  const [mode, setMode] = useState('password') // 'password' | 'passphrase'
  const [length, setLength] = useState(16)
  const [wordCount, setWordCount] = useState(4)
  const [useUpper, setUseUpper]   = useState(true)
  const [useLower, setUseLower]   = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    if (mode === 'passphrase') {
      const words = Array.from({ length: wordCount }, () =>
        WORDLIST[Math.floor(Math.random() * WORDLIST.length)]
      )
      setPassword(words.join('-'))
      return
    }

    let charset = ''
    if (useUpper)   charset += CHARS.upper
    if (useLower)   charset += CHARS.lower
    if (useDigits)  charset += CHARS.digits
    if (useSymbols) charset += CHARS.symbols
    if (!charset)   charset = CHARS.lower

    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    setPassword(Array.from(arr, n => charset[n % charset.length]).join(''))
  }, [mode, length, wordCount, useUpper, useLower, useDigits, useSymbols])

  function copy() {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const score = scorePassword(password)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Password Generator</h1>
      <p className="tool-description">
        Generate secure passwords or passphrases using your browser's cryptographic random API.
      </p>

      <div className="chip-group">
        <button className={`chip ${mode === 'password' ? 'active' : ''}`} onClick={() => setMode('password')}>Password</button>
        <button className={`chip ${mode === 'passphrase' ? 'active' : ''}`} onClick={() => setMode('passphrase')}>Passphrase</button>
      </div>

      {mode === 'password' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label>Length: {length}</label>
            <input
              type="range"
              min={6} max={64}
              value={length}
              onChange={e => setLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              ['Uppercase (A–Z)', useUpper, setUseUpper],
              ['Lowercase (a–z)', useLower, setUseLower],
              ['Numbers (0–9)',   useDigits, setUseDigits],
              ['Symbols',        useSymbols, setUseSymbols],
            ].map(([label, val, setter]) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label>Number of words: {wordCount}</label>
          <input
            type="range"
            min={3} max={8}
            value={wordCount}
            onChange={e => setWordCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>
      )}

      <button className="btn" onClick={generate} style={{ marginTop: '1.25rem' }}>
        Generate
      </button>

      {password && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="code-block" style={{ flex: 1, minHeight: 'auto', padding: '0.75rem 1rem', letterSpacing: '0.04em' }}>
              {password}
            </div>
            <button className="btn btn-sm" onClick={copy} style={{ flexShrink: 0 }}>
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          {mode === 'password' && (
            <>
              <div className="strength-bar" style={{ marginTop: '0.75rem' }}>
                <div
                  className="strength-fill"
                  style={{
                    width: `${(score / 5) * 100}%`,
                    background: STRENGTH_COLORS[score],
                  }}
                />
              </div>
              <p style={{ fontSize: '0.82rem', color: STRENGTH_COLORS[score] }}>
                {STRENGTH_LABELS[score]}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
