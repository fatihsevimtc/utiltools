import { useState } from 'react'
import BackBar from '../../components/BackBar'

const OPS = ['+', '-', '×', '÷', 'AND', 'OR', 'XOR', 'NOT']

function parseBin(s) {
  const clean = s.replace(/\s/g, '')
  if (!/^[01]+$/.test(clean)) throw new Error(`"${s}" is not a valid binary number`)
  return parseInt(clean, 2)
}

function toBin(n) {
  if (n < 0) {
    // show two's complement (32-bit)
    return '−' + ((-n) >>> 0).toString(2)
  }
  return (n >>> 0).toString(2)
}

export default function BinaryCalculator() {
  const [a, setA] = useState('1010')
  const [b, setB] = useState('0110')
  const [op, setOp] = useState('+')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function calculate() {
    setError('')
    setResult(null)
    try {
      const na = parseBin(a)
      if (op === 'NOT') {
        const r = ~na >>> 0
        setResult({ value: r, binary: toBin(r), decimal: r, hex: r.toString(16).toUpperCase() })
        return
      }
      const nb = parseBin(b)
      let r
      switch (op) {
        case '+':   r = na + nb; break
        case '-':   r = na - nb; break
        case '×':   r = na * nb; break
        case '÷':
          if (nb === 0) throw new Error('Division by zero')
          r = Math.floor(na / nb); break
        case 'AND': r = na & nb; break
        case 'OR':  r = na | nb; break
        case 'XOR': r = na ^ nb; break
        default: return
      }
      setResult({ value: r, binary: toBin(r), decimal: r, hex: r.toString(16).toUpperCase() })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Binary Calculator</h1>
      <p className="tool-description">Perform arithmetic and bitwise operations on binary numbers.</p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label htmlFor="bca">Operand A (binary)</label>
          <input id="bca" type="text" value={a} onChange={e => setA(e.target.value)} placeholder="1010" style={{ fontFamily: 'monospace' }} />
        </div>
        <div style={{ paddingBottom: '0.5rem' }}>
          <select value={op} onChange={e => setOp(e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'monospace', fontWeight: 700 }}>
            {OPS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        {op !== 'NOT' && (
          <div style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="bcb">Operand B (binary)</label>
            <input id="bcb" type="text" value={b} onChange={e => setB(e.target.value)} placeholder="0110" style={{ fontFamily: 'monospace' }} />
          </div>
        )}
      </div>

      <button className="btn" onClick={calculate}>Calculate</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {result && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '0.75rem' }}>
          {[['Binary', result.binary], ['Decimal', result.decimal], ['Hex', result.hex]].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--surface)', borderRadius: 8, padding: '0.85rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all' }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
