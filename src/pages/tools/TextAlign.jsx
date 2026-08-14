import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function padLeft(text, width) {
  return text.split('\n').map(line => line.padStart(width)).join('\n')
}

function padRight(text, width) {
  return text.split('\n').map(line => line.padEnd(width)).join('\n')
}

function center(text, width) {
  return text.split('\n').map(line => {
    const total = width - line.length
    if (total <= 0) return line
    const left  = Math.floor(total / 2)
    const right = total - left
    return ' '.repeat(left) + line + ' '.repeat(right)
  }).join('\n')
}

function justify(text, width) {
  return text.split('\n').map(line => {
    const words = line.trim().split(/\s+/).filter(Boolean)
    if (words.length <= 1) return line.padEnd(width)
    const totalSpaces = width - words.reduce((s, w) => s + w.length, 0)
    const gaps = words.length - 1
    const base = Math.floor(totalSpaces / gaps)
    let extra  = totalSpaces % gaps
    let result = ''
    for (let i = 0; i < words.length; i++) {
      result += words[i]
      if (i < gaps) {
        result += ' '.repeat(base + (extra-- > 0 ? 1 : 0))
      }
    }
    return result
  }).join('\n')
}

const MODES = [
  { id: 'left',    label: '⬅️ Left-align',    fn: (t, w) => t },
  { id: 'right',   label: '➡️ Right-align',   fn: padLeft },
  { id: 'center',  label: '↔️ Center',         fn: center },
  { id: 'justify', label: '≡ Justify',         fn: justify },
]

export default function TextAlign() {
  const [input, setInput]   = useState('The quick brown fox\njumps over the lazy dog\nand then sat down quietly')
  const [mode, setMode]     = useState('right')
  const [width, setWidth]   = useState(40)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input.trim()) return ''
    const fn = MODES.find(m => m.id === mode)?.fn
    return fn ? fn(input, width) : input
  }, [input, mode, width])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text Alignment Tool</h1>
      <p className="tool-description">
        Left-align, right-align, center, or justify any block of text to a fixed column width.
      </p>

      <div className="chip-group">
        {MODES.map(m => (
          <button
            key={m.id}
            className={`chip ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
        <label htmlFor="align-width" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Column width:</label>
        <input
          id="align-width"
          type="number"
          min={10}
          max={200}
          value={width}
          onChange={e => setWidth(Math.max(10, Math.min(200, Number(e.target.value) || 40)))}
          style={{ width: 70, padding: '0.4rem 0.6rem', fontSize: '0.95rem' }}
          disabled={mode === 'left'}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>characters</span>
      </div>

      <label htmlFor="align-input">Input</label>
      <textarea
        id="align-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste text here…"
        rows={6}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <pre
            className="code-block"
            style={{ fontFamily: 'monospace', whiteSpace: 'pre', overflowX: 'auto', fontSize: '0.92rem', lineHeight: 1.6 }}
          >
            {output}
          </pre>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '⬛', name: 'Text Padder',        path: '/tools/text-padder' },
        { icon: '↩️', name: 'Wrap Text',           path: '/tools/wrap-text' },
        { icon: '⇥',  name: 'Tabs ↔ Spaces',       path: '/tools/tabs-to-spaces' },
        { icon: '⇥',  name: 'Indent / Unindent',   path: '/tools/indent-text' },
      ]} />
      <ToolSeo />
    </div>
  )
}
