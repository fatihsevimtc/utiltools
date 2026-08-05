import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MAP = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]

function toRoman(n) {
  if (n < 1 || n > 3999) return 'Out of range (1–3999)'
  let result = ''
  for (const [val, sym] of MAP) { while (n >= val) { result += sym; n -= val } }
  return result
}
function fromRoman(s) {
  const vals = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 }
  let result = 0, prev = 0
  for (const ch of s.toUpperCase().split('').reverse()) {
    const v = vals[ch]
    if (!v) return NaN
    if (v < prev) result -= v; else result += v
    prev = v
  }
  return result
}

export default function RomanNumeral() {
  const [mode, setMode]     = useState('toRoman')
  const [input, setInput]   = useState('')
  const [copied, setCopied] = useState(false)

  const output = (() => {
    if (!input.trim()) return ''
    if (mode === 'toRoman') {
      const n = parseInt(input)
      return isNaN(n) ? 'Enter a valid integer' : toRoman(n)
    } else {
      const n = fromRoman(input)
      return isNaN(n) ? 'Invalid Roman numeral' : String(n)
    }
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Roman Numeral Converter</h1>
      <p className="tool-description">Convert between integers and Roman numerals.</p>

      <div className="chip-group">
        <button className={`chip ${mode==='toRoman'?'active':''}`} onClick={() => { setMode('toRoman'); setInput('') }}>Number → Roman</button>
        <button className={`chip ${mode==='fromRoman'?'active':''}`} onClick={() => { setMode('fromRoman'); setInput('') }}>Roman → Number</button>
      </div>

      <label htmlFor="rn-input">{mode === 'toRoman' ? 'Integer (1–3999)' : 'Roman numeral'}</label>
      <input id="rn-input" type="text" value={input} onChange={e => setInput(e.target.value)}
        placeholder={mode === 'toRoman' ? '2024' : 'MMXXIV'} />

      {output && (
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-card" style={{ display: 'inline-block' }}>
            <div className="stat-value">{output}</div>
            <div className="stat-label">Result</div>
          </div>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓' : 'Copy'}</button>
        </div>
      )}
    </div>
  )
}
