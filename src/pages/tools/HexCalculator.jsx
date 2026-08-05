import { useState } from 'react'
import BackBar from '../../components/BackBar'

const OPS = ['+', '-', '×', '÷', 'AND', 'OR', 'XOR', 'NOT']

function parseHex(s) {
  const clean = s.replace(/^0x/i, '').replace(/\s/g, '')
  if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error(`"${s}" is not a valid hex number`)
  return parseInt(clean, 16)
}

function toHex(n) {
  if (n < 0) return '-0x' + (-n).toString(16).toUpperCase()
  return '0x' + (n >>> 0).toString(16).toUpperCase()
}

export default function HexCalculator() {
  const [a, setA] = useState('FF')
  const [b, setB] = useState('0A')
  const [op, setOp] = useState('+')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function calculate() {
    setError('')
    setResult(null)
    try {
      const na = parseHex(a)
      if (op === 'NOT') {
        const r = ~na >>> 0
        setResult({ hex: toHex(r), decimal: r, binary: r.toString(2).padStart(8, '0') })
        return
      }
      const nb = parseHex(b)
      let r
      switch (op) {
        case '+':   r = na + nb; break
        case '-':   r = na - nb; break
        case '×':   r = na * nb; break
        case '÷':
          if (nb === 0) throw new Error('Division by zero')
          r = Math.floor(na / nb); break
        case 'AND': r = (na & nb) >>> 0; break
        case 'OR':  r = (na | nb) >>> 0; break
        case 'XOR': r = (na ^ nb) >>> 0; break
        default: return
      }
      setResult({ hex: toHex(r), decimal: r, binary: (r >>> 0).toString(2).padStart(8, '0') })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Hex Calculator</h1>
      <p className="tool-description">Perform arithmetic and bitwise operations on hexadecimal numbers.</p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label htmlFor="hca">Operand A (hex)</label>
          <input id="hca" type="text" value={a} onChange={e => setA(e.target.value)} placeholder="FF" style={{ fontFamily: 'monospace' }} />
        </div>
        <div style={{ paddingBottom: '0.5rem' }}>
          <select value={op} onChange={e => setOp(e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'monospace', fontWeight: 700 }}>
            {OPS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        {op !== 'NOT' && (
          <div style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="hcb">Operand B (hex)</label>
            <input id="hcb" type="text" value={b} onChange={e => setB(e.target.value)} placeholder="0A" style={{ fontFamily: 'monospace' }} />
          </div>
        )}
      </div>

      <button className="btn" onClick={calculate}>Calculate</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {result && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '0.75rem' }}>
          {[['Hex', result.hex], ['Decimal', result.decimal], ['Binary', result.binary]].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--surface)', borderRadius: 8, padding: '0.85rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all' }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        You can enter hex with or without the <code>0x</code> prefix.
      </p>
    </div>
  )
}
