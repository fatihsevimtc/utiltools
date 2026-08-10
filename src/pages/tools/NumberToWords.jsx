import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function toWords(n) {
  if (n === 0) return 'zero'
  if (n < 0) return 'negative ' + toWords(-n)
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '')
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + toWords(n % 100) : '')
  if (n < 1_000_000) return toWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ', ' + toWords(n % 1000) : '')
  if (n < 1_000_000_000) return toWords(Math.floor(n / 1_000_000)) + ' million' + (n % 1_000_000 ? ', ' + toWords(n % 1_000_000) : '')
  if (n < 1_000_000_000_000) return toWords(Math.floor(n / 1_000_000_000)) + ' billion' + (n % 1_000_000_000 ? ', ' + toWords(n % 1_000_000_000) : '')
  return toWords(Math.floor(n / 1_000_000_000_000)) + ' trillion' + (n % 1_000_000_000_000 ? ', ' + toWords(n % 1_000_000_000_000) : '')
}

function toOrdinal(n) {
  const w = toWords(n)
  const exceptions = { one: 'first', two: 'second', three: 'third', four: 'fourth', five: 'fifth',
    eight: 'eighth', nine: 'ninth', twelve: 'twelfth' }
  const last = w.split(/[\s-]/).pop()
  if (exceptions[last]) return w.replace(new RegExp(last + '$'), exceptions[last])
  if (last.endsWith('y')) return w.replace(new RegExp(last + '$'), last.slice(0, -1) + 'ieth')
  return w + 'th'
}

export default function NumberToWords() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState('')

  const num = parseInt(input.replace(/[,\s]/g, ''), 10)
  const valid = !isNaN(num) && isFinite(num) && Math.abs(num) < 1e15

  const cardinal = valid ? toWords(num) : ''
  const ordinal  = valid && num > 0 ? toOrdinal(num) : ''

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }

  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Number to Words</h1>
      <p className="tool-description">
        Convert any number into its English word form — cardinal (forty-two) and ordinal (forty-second). Supports up to one quadrillion.
      </p>

      <label htmlFor="ntw-input">Enter a number</label>
      <input
        id="ntw-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="e.g. 42 or 1000000"
        style={{ fontSize: '1.25rem' }}
      />

      {input && !valid && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Please enter a whole number (no decimals) between -999 trillion and 999 trillion.
        </p>
      )}

      {valid && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            ['Cardinal', cardinal, 'card'],
            ['Capitalised', capitalize(cardinal), 'cap'],
            ['Upper case', cardinal.toUpperCase(), 'upper'],
            ...(ordinal ? [
              ['Ordinal', ordinal, 'ord'],
              ['Ordinal capitalised', capitalize(ordinal), 'ordcap'],
            ] : []),
          ].map(([label, value, key]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.7rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{value}</div>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={() => copy(value, key)}>{copied === key ? '✓' : 'Copy'}</button>
            </div>
          ))}
        </div>
      )}

      <RelatedTools category="math" exclude="/tools/number-to-words" />
      <ToolSeo />
    </div>
  )
}
