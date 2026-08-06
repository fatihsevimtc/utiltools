import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

function luhn(num) {
  const digits = num.replace(/\D/g, '').split('').reverse().map(Number)
  const sum = digits.reduce((acc, d, i) => {
    if (i % 2 !== 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    return acc + d
  }, 0)
  return sum % 10 === 0
}

function detectNetwork(num) {
  const n = num.replace(/\D/g, '')
  if (/^4/.test(n)) return { name: 'Visa', icon: '💳', color: '#1a1f71' }
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return { name: 'Mastercard', icon: '💳', color: '#eb001b' }
  if (/^3[47]/.test(n)) return { name: 'American Express', icon: '💳', color: '#007bc1' }
  if (/^6(?:011|5)/.test(n)) return { name: 'Discover', icon: '💳', color: '#ff6600' }
  if (/^35(?:2[89]|[3-8])/.test(n)) return { name: 'JCB', icon: '💳', color: '#003087' }
  if (/^3(?:0[0-5]|[68])/.test(n)) return { name: "Diners Club", icon: '💳', color: '#004a97' }
  return null
}

function formatCard(raw) {
  const n = raw.replace(/\D/g, '').slice(0, 16)
  return n.replace(/(.{4})/g, '$1 ').trim()
}

export default function CreditCardValidator() {
  const [input, setInput] = useState('')

  const raw = input.replace(/\D/g, '')
  const formatted = formatCard(raw)
  const network = raw.length >= 4 ? detectNetwork(raw) : null
  const valid = raw.length >= 13 ? luhn(raw) : null

  function handleChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 16)
    setInput(v)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Credit Card Validator</h1>
      <p className="tool-description">
        Validate credit card numbers using the Luhn algorithm and detect the card network. No real card data is sent anywhere.
      </p>

      <label htmlFor="cc-num">Card number</label>
      <input
        id="cc-num"
        type="text"
        inputMode="numeric"
        value={formatted}
        onChange={handleChange}
        placeholder="4111 1111 1111 1111"
        style={{ fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '0.12em' }}
        maxLength={19}
      />

      {raw.length > 0 && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {network && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.5rem' }}>{network.icon}</span>
              <span style={{ fontWeight: 600 }}>{network.name}</span>
            </div>
          )}

          {valid !== null && (
            <div style={{
              textAlign: 'center', padding: '1.25rem', borderRadius: 12, border: '2px solid',
              borderColor: valid ? 'var(--success)' : 'var(--danger)',
              background: 'var(--surface)',
            }}>
              <div style={{ fontSize: '2rem' }}>{valid ? '✅' : '❌'}</div>
              <div style={{ fontWeight: 700, marginTop: '0.4rem', color: valid ? 'var(--success)' : 'var(--danger)', fontSize: '1.05rem' }}>
                {valid ? 'Valid card number' : 'Invalid card number'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Luhn check</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        <strong>Test numbers:</strong> Visa 4111 1111 1111 1111 · Mastercard 5500 0000 0000 0004 · Amex 3714 496353 98431
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
        ⚠ Never enter real card numbers into any online tool.
      </p>
      <RelatedTools category="developer" exclude="/tools/credit-card-validator" />
    </div>
  )
}
