import { useState } from 'react'
import BackBar from '../../components/BackBar'

function validateIsbn10(raw) {
  const s = raw.replace(/[-\s]/g, '')
  if (s.length !== 10) return { valid: false, type: 'ISBN-10', reason: 'Must be 10 characters' }
  let sum = 0
  for (let i = 0; i < 9; i++) {
    if (!/\d/.test(s[i])) return { valid: false, type: 'ISBN-10', reason: 'Non-digit in positions 1-9' }
    sum += parseInt(s[i]) * (10 - i)
  }
  const last = s[9].toUpperCase()
  sum += last === 'X' ? 10 : parseInt(last)
  return { valid: sum % 11 === 0, type: 'ISBN-10', reason: sum % 11 === 0 ? '' : 'Checksum mismatch' }
}

function validateIsbn13(raw) {
  const s = raw.replace(/[-\s]/g, '')
  if (s.length !== 13) return { valid: false, type: 'ISBN-13', reason: 'Must be 13 digits' }
  if (!/^\d{13}$/.test(s)) return { valid: false, type: 'ISBN-13', reason: 'Must contain only digits' }
  let sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(s[i]) * (i % 2 === 0 ? 1 : 3)
  return { valid: sum % 10 === 0, type: 'ISBN-13', reason: sum % 10 === 0 ? '' : 'Checksum mismatch' }
}

function validate(raw) {
  const s = raw.replace(/[-\s]/g, '')
  if (s.length === 10) return validateIsbn10(raw)
  if (s.length === 13) return validateIsbn13(raw)
  return { valid: false, type: 'Unknown', reason: `Length ${s.length} — must be 10 or 13 digits` }
}

export default function IsbnValidator() {
  const [input, setInput] = useState('')

  const result = input.trim() ? validate(input.trim()) : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>ISBN Validator</h1>
      <p className="tool-description">Validate ISBN-10 and ISBN-13 book identifiers using standard checksum algorithms.</p>

      <label htmlFor="isbn-input">ISBN number</label>
      <input
        id="isbn-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="978-3-16-148410-0"
        style={{ fontSize: '1.1rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' }}
      />

      {result && (
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            padding: '0.35rem 1rem', borderRadius: '999px', fontWeight: 700, fontSize: '1rem',
            background: result.valid ? 'var(--success-bg, #dcfce7)' : 'var(--danger-bg, #fee2e2)',
            color: result.valid ? 'var(--success, #16a34a)' : 'var(--danger, #dc2626)',
          }}>
            {result.valid ? '✓ Valid' : '✗ Invalid'}
          </span>
          <span style={{ fontWeight: 600 }}>{result.type}</span>
          {result.reason && <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>{result.reason}</span>}
        </div>
      )}
    </div>
  )
}
