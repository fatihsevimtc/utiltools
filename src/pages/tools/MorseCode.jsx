import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MORSE = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',
  J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',
  S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.',
  '-':'-....-','(':'-.--.',')':`-.--.-`,'@':'.--.-.','&':'.-...',
  ':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','_':'..--.-',
  '"':'.-..-.',"'":`-----.`,'$':'...-..-',
}

const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

function textToMorse(text) {
  return text.toUpperCase().split('').map(c => {
    if (c === ' ') return '/'
    return MORSE[c] ?? '?'
  }).join(' ')
}

function morseToText(morse) {
  return morse.trim().split(' / ').map(word =>
    word.split(' ').map(sym => {
      if (sym === '') return ''
      return REVERSE[sym] ?? '?'
    }).join('')
  ).join(' ')
}

export default function MorseCode() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input
    ? mode === 'encode' ? textToMorse(input) : morseToText(input)
    : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Morse Code</h1>
      <p className="tool-description">Encode text to Morse code or decode Morse code back to text.</p>

      <div className="chip-group">
        <button className={`chip ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>Text → Morse</button>
        <button className={`chip ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>Morse → Text</button>
      </div>

      <label htmlFor="morse-input" style={{ marginTop: '1rem' }}>
        {mode === 'encode' ? 'Input text' : 'Morse code (use / for spaces between words)'}
      </label>
      <textarea
        id="morse-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Hello World' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
        style={{ minHeight: 100, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', letterSpacing: '0.08em' }}>{output}</div>
        </div>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        Use a single space between letters, and <code>/</code> between words when decoding.
      </p>
    </div>
  )
}
