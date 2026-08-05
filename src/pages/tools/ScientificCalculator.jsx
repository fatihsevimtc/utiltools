import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['sin', 'cos', 'tan', 'ln'],
  ['√', 'x²', 'xʸ', '1/x'],
  ['π', 'e', '(', ')'],
  ['0', '.', '=', ''],
]

const BTN_STYLE = {
  padding: '0.65rem 0',
  borderRadius: 10,
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'opacity 0.1s',
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [expr, setExpr] = useState('')
  const [justEvaled, setJustEvaled] = useState(false)
  const [history, setHistory] = useState([])

  const press = useCallback((btn) => {
    if (btn === '') return

    if (btn === 'C') { setDisplay('0'); setExpr(''); setJustEvaled(false); return }

    if (btn === '=') {
      try {
        const raw = expr + (justEvaled ? '' : display)
        const sanitized = raw
          .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
          .replace(/π/g, String(Math.PI))
          .replace(/e(?![0-9])/g, String(Math.E))
        // eslint-disable-next-line no-new-func
        const result = Function('"use strict"; return (' + sanitized + ')')()
        const resultStr = parseFloat(result.toPrecision(12)).toString()
        setHistory(h => [`${raw} = ${resultStr}`, ...h.slice(0, 9)])
        setDisplay(resultStr)
        setExpr('')
        setJustEvaled(true)
      } catch {
        setDisplay('Error')
        setExpr('')
        setJustEvaled(false)
      }
      return
    }

    const isOp = ['÷', '×', '−', '+', 'xʸ'].includes(btn)

    if (btn === '±') { setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d); return }
    if (btn === '%')  { setDisplay(d => String(parseFloat(d) / 100)); return }
    if (btn === 'π')  { setDisplay(String(Math.PI)); setJustEvaled(false); return }
    if (btn === 'e')  { setDisplay(String(Math.E)); setJustEvaled(false); return }

    if (btn === 'sin')  { setDisplay(d => String(parseFloat(Math.sin(parseFloat(d) * Math.PI / 180).toPrecision(10)))); return }
    if (btn === 'cos')  { setDisplay(d => String(parseFloat(Math.cos(parseFloat(d) * Math.PI / 180).toPrecision(10)))); return }
    if (btn === 'tan')  { setDisplay(d => String(parseFloat(Math.tan(parseFloat(d) * Math.PI / 180).toPrecision(10)))); return }
    if (btn === 'ln')   { setDisplay(d => String(parseFloat(Math.log(parseFloat(d)).toPrecision(10)))); return }
    if (btn === '√')    { setDisplay(d => String(parseFloat(Math.sqrt(parseFloat(d)).toPrecision(10)))); return }
    if (btn === 'x²')   { setDisplay(d => String(parseFloat(d) ** 2)); return }
    if (btn === '1/x')  { setDisplay(d => String(1 / parseFloat(d))); return }

    if (isOp) {
      setExpr(e => e + (justEvaled ? display : (e ? display : display)) + btn)
      setDisplay('0')
      setJustEvaled(false)
      return
    }

    if (btn === '(' || btn === ')') {
      setExpr(e => e + btn)
      return
    }

    if (justEvaled) { setDisplay(btn); setJustEvaled(false); return }
    setDisplay(d => {
      if (btn === '.' && d.includes('.')) return d
      if (d === '0' && btn !== '.') return btn
      return d + btn
    })
  }, [display, expr, justEvaled])

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Scientific Calculator</h1>
      <p className="tool-description">A browser-based scientific calculator with trig, logarithm, and power functions.</p>

      {/* Display */}
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', border: '1px solid var(--border)', textAlign: 'right' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', minHeight: '1.2em', wordBreak: 'break-all' }}>{expr}</div>
        <div style={{ fontSize: '2rem', fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all', marginTop: '0.2rem' }}>{display}</div>
      </div>

      {/* Keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
        {BUTTONS.flat().map((btn, i) => {
          const isOp = ['÷', '×', '−', '+', '='].includes(btn)
          const isFn = ['sin','cos','tan','ln','√','x²','xʸ','1/x','π','e','(',')',].includes(btn)
          const isC  = btn === 'C'
          const bg = isC ? 'var(--danger)' : isOp ? 'var(--accent)' : isFn ? 'var(--surface)' : 'var(--bg)'
          const color = (isC || isOp) ? '#fff' : 'var(--text)'
          return btn ? (
            <button
              key={i}
              onClick={() => press(btn)}
              style={{ ...BTN_STYLE, background: bg, color, border: '1px solid var(--border)' }}
            >
              {btn}
            </button>
          ) : <div key={i} />
        })}
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>History</label>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', maxHeight: 160, overflow: 'auto' }}>
            {history.join('\n')}
          </div>
        </div>
      )}

      <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
        Trig functions use degrees.
      </p>
    </div>
  )
}
