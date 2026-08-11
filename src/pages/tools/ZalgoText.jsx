import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// Build zalgo combining chars: diacritics above, middle, below
const ABOVE = [0x030d,0x030e,0x0304,0x0305,0x033f,0x0311,0x0306,0x0310,0x0352,0x0357,0x0351,0x0307,0x0308,0x030a,0x0342,0x0343,0x0344,0x034a,0x034b,0x034c,0x0303,0x0302,0x030c,0x0350,0x0300,0x0301,0x030b,0x030f,0x0312,0x0313,0x0314,0x033d,0x0309,0x0363,0x0364,0x0365,0x0366,0x0367,0x0368,0x0369,0x036a,0x036b,0x036c,0x036d,0x036e,0x036f,0x033e,0x035b]
const MIDDLE = [0x0315,0x031b,0x0340,0x0341,0x0358,0x0321,0x0322,0x0327,0x0328,0x0334,0x0335,0x0336,0x034f,0x035c,0x035d,0x035e,0x035f,0x0360,0x0362,0x0338,0x0337,0x0361,0x0489]
const BELOW  = [0x0316,0x0317,0x0318,0x0319,0x031c,0x031d,0x031e,0x031f,0x0320,0x0324,0x0325,0x0326,0x0329,0x032a,0x032b,0x032c,0x032d,0x032e,0x032f,0x0330,0x0331,0x0332,0x0333,0x0339,0x033a,0x033b,0x033c,0x0345,0x0347,0x0348,0x0349,0x034d,0x034e,0x0353,0x0354,0x0355,0x0356,0x0359,0x035a,0x0323]

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pick(arr, max) {
  const n = Math.floor(Math.random() * max) + 1
  return Array.from({ length: n }, () => String.fromCharCode(rnd(arr))).join('')
}

function zalgoText(text, intensity = 'medium') {
  const max = intensity === 'low' ? 2 : intensity === 'high' ? 8 : 4
  return text.split('').map(c => {
    if (c === ' ' || c === '\n') return c
    return c + pick(ABOVE, max) + pick(MIDDLE, 1) + pick(BELOW, max)
  }).join('')
}

function unzalgo(text) {
  // Strip all combining Unicode characters (U+0300–U+036F and U+0489)
  return text.replace(/[\u0300-\u036f\u0489]/g, '')
}

export default function ZalgoText() {
  const [text, setText] = useState('')
  const [intensity, setIntensity] = useState('medium')
  const [mode, setMode] = useState('zalgo')
  const [copied, setCopied] = useState(false)

  const output = (() => {
    if (!text.trim()) return ''
    return mode === 'zalgo' ? zalgoText(text, intensity) : unzalgo(text)
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Zalgo Text Generator</h1>
      <p className="tool-description">
        Transform text into glitchy, corrupted-looking Zalgo text by stacking Unicode combining characters — or clean it back to normal.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div className="chip-group">
          <button className={`chip ${mode === 'zalgo' ? 'active' : ''}`} onClick={() => setMode('zalgo')}>Zalgo ↓</button>
          <button className={`chip ${mode === 'unzalgo' ? 'active' : ''}`} onClick={() => setMode('unzalgo')}>Un-Zalgo ↑</button>
        </div>
        {mode === 'zalgo' && (
          <div className="chip-group">
            {['low','medium','high'].map(i => (
              <button key={i} className={`chip ${intensity === i ? 'active' : ''}`} onClick={() => setIntensity(i)} style={{ textTransform: 'capitalize' }}>{i}</button>
            ))}
          </div>
        )}
      </div>

      <label htmlFor="zt-input">Input</label>
      <textarea
        id="zt-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'zalgo' ? 'Enter normal text…' : 'Paste Zalgo text to clean…'}
        style={{ minHeight: 140 }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 140, background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/zalgo-text" />
      <ToolSeo />
    </div>
  )
}
