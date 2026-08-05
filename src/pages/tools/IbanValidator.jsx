import { useState } from 'react'
import BackBar from '../../components/BackBar'

const COUNTRY_LENGTHS = {
  AL:28,AD:24,AT:20,AZ:28,BH:22,BY:28,BE:16,BA:20,BR:29,BG:22,CR:22,HR:21,CY:28,
  CZ:24,DK:18,DO:28,EG:29,SV:28,EE:20,FO:18,FI:18,FR:27,GE:22,DE:22,GI:23,GR:27,
  GL:18,GT:28,HU:28,IS:26,IQ:23,IE:22,IL:23,IT:27,JO:30,KZ:20,XK:20,KW:30,LV:21,
  LB:28,LY:25,LI:21,LT:20,LU:20,MT:31,MR:27,MU:30,MD:24,MC:27,ME:22,NL:18,MK:19,
  NO:15,PK:24,PS:29,PL:28,PT:25,QA:29,RO:24,LC:32,SM:27,SA:24,RS:22,SC:31,SK:24,
  SI:19,ES:24,SE:24,CH:21,TL:23,TN:24,TR:26,UA:29,AE:23,GB:22,VA:22,VG:24,
}

function mod97(str) {
  let remainder = 0
  for (const ch of str) {
    remainder = (remainder * 10 + parseInt(ch)) % 97
  }
  return remainder
}

function validateIBAN(iban) {
  const clean = iban.replace(/\s/g, '').toUpperCase()
  if (clean.length < 4) return { valid: false, message: 'Too short' }

  const country = clean.slice(0, 2)
  const expected = COUNTRY_LENGTHS[country]
  if (!expected) return { valid: false, message: `Unknown country code: ${country}` }
  if (clean.length !== expected) return { valid: false, message: `Expected ${expected} characters for ${country}, got ${clean.length}` }

  // Move first 4 chars to end, convert letters to numbers
  const rearranged = clean.slice(4) + clean.slice(0, 4)
  const numeric = rearranged.replace(/[A-Z]/g, ch => ch.charCodeAt(0) - 55)

  const remainder = mod97(numeric)
  return remainder === 1
    ? { valid: true, message: 'Valid IBAN', country, length: clean.length }
    : { valid: false, message: 'Checksum failed' }
}

function formatIBAN(raw) {
  return raw.replace(/\s/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim()
}

export default function IbanValidator() {
  const [input, setInput] = useState('')

  const result = input.trim() ? validateIBAN(input) : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>IBAN Validator</h1>
      <p className="tool-description">Validate International Bank Account Numbers using the MOD-97 checksum algorithm.</p>

      <label htmlFor="iban-input">IBAN</label>
      <input
        id="iban-input"
        type="text"
        value={formatIBAN(input)}
        onChange={e => setInput(e.target.value.replace(/\s/g, ''))}
        placeholder="GB29 NWBK 6016 1331 9268 19"
        style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
        maxLength={40}
      />

      {result && (
        <div style={{
          marginTop: '1.25rem', textAlign: 'center', padding: '1.25rem', borderRadius: 12,
          border: '2px solid', borderColor: result.valid ? 'var(--success)' : 'var(--danger)',
          background: 'var(--surface)',
        }}>
          <div style={{ fontSize: '2rem' }}>{result.valid ? '✅' : '❌'}</div>
          <div style={{ fontWeight: 700, marginTop: '0.4rem', color: result.valid ? 'var(--success)' : 'var(--danger)' }}>
            {result.message}
          </div>
          {result.valid && (
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
              Country: {result.country} · Length: {result.length}
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        Test IBAN: <code>GB29 NWBK 6016 1331 9268 19</code>
      </p>
    </div>
  )
}
