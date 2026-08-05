import { useState } from 'react'
import BackBar from '../../components/BackBar'

const BASES = [
  { id: 'dec', label: 'Decimal (base 10)', base: 10, prefix: '' },
  { id: 'bin', label: 'Binary (base 2)',   base: 2,  prefix: '0b' },
  { id: 'oct', label: 'Octal (base 8)',    base: 8,  prefix: '0o' },
  { id: 'hex', label: 'Hex (base 16)',     base: 16, prefix: '0x' },
]

export default function NumberBase() {
  const [values, setValues] = useState({ dec: '', bin: '', oct: '', hex: '' })

  function handleChange(fromId, raw) {
    const base = BASES.find(b => b.id === fromId).base
    const clean = raw.replace(/^0[boxBOX]/, '').trim()
    const decimal = parseInt(clean, base)

    if (clean === '' || isNaN(decimal)) {
      setValues({ dec: '', bin: '', oct: '', hex: '' })
      setValues(v => ({ ...v, [fromId]: raw }))
      return
    }
    setValues({
      dec: decimal.toString(10),
      bin: decimal.toString(2),
      oct: decimal.toString(8),
      hex: decimal.toString(16).toUpperCase(),
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Number Base Converter</h1>
      <p className="tool-description">Convert numbers between decimal, binary, octal, and hexadecimal.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {BASES.map(b => (
          <div key={b.id}>
            <label htmlFor={`nb-${b.id}`}>{b.label}</label>
            <input
              id={`nb-${b.id}`}
              type="text"
              value={values[b.id]}
              onChange={e => handleChange(b.id, e.target.value)}
              placeholder={b.prefix + '0'}
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
