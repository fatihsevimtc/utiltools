import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TextAsciiConverter() {
  const [mode, setMode] = useState('text-to-ascii')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [separator, setSeparator] = useState(' ')
  const [copied, setCopied] = useState(false)

  const convert = useCallback(() => {
    const text = input.trim()
    if (!text) {
      setOutput('')
      return
    }

    try {
      if (mode === 'text-to-ascii') {
        const codes = []
        for (let i = 0; i < text.length; i++) {
          codes.push(text.charCodeAt(i))
        }
        setOutput(codes.join(separator))
      } else {
        // ASCII to text
        const codes = text.split(/[\s,]+/).filter(Boolean)
        const chars = codes.map(code => {
          const num = parseInt(code, 10)
          if (isNaN(num) || num < 0 || num > 1114111) return '�'
          return String.fromCharCode(num)
        })
        setOutput(chars.join(''))
      }
    } catch (err) {
      setOutput('Error: ' + err.message)
    }
  }, [input, mode, separator])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const SEPARATORS = [
    { id: ' ', label: 'Space' },
    { id: ', ', label: 'Comma' },
    { id: '-', label: 'Dash' },
    { id: '\n', label: 'New line' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text ↔ ASCII Converter</h1>
      <p className="tool-description">
        Convert text to ASCII character codes or decode ASCII codes back to text.
      </p>

      <div className="chip-group">
        <button
          className={`chip ${mode === 'text-to-ascii' ? 'active' : ''}`}
          onClick={() => setMode('text-to-ascii')}
        >
          Text → ASCII
        </button>
        <button
          className={`chip ${mode === 'ascii-to-text' ? 'active' : ''}`}
          onClick={() => setMode('ascii-to-text')}
        >
          ASCII → Text
        </button>
      </div>

      {mode === 'text-to-ascii' && (
        <>
          <label htmlFor="tac-separator">Separator</label>
          <div className="chip-group" style={{ marginTop: '0.4rem', marginBottom: '0.75rem' }}>
            {SEPARATORS.map(s => (
              <button
                key={s.id}
                className={`chip ${separator === s.id ? 'active' : ''}`}
                onClick={() => setSeparator(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}

      <label htmlFor="tac-input">
        {mode === 'text-to-ascii' ? 'Input text' : 'ASCII codes (space or comma separated)'}
      </label>
      <textarea
        id="tac-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'text-to-ascii' ? 'Type or paste your text…' : 'e.g. 72 101 108 108 111'}
        rows={6}
      />

      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={convert}>
        🔄 Convert
      </button>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ fontFamily: mode === 'text-to-ascii' ? 'monospace' : 'inherit', whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {output}
          </div>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '0️⃣', name: 'Text ↔ Binary',      path: '/tools/text-to-binary' },
        { icon: '🔢', name: 'Number Base',         path: '/tools/number-base' },
        { icon: '📡', name: 'Morse Code',          path: '/tools/morse-code' },
        { icon: '🌐', name: 'HTML Entities',       path: '/tools/html-entities' },
      ]} />
      <ToolSeo />
    </div>
  )
}
