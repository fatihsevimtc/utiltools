import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

function toCamel(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())
}
function toSnake(s) {
  return s
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+|[0-9]|\b)|[A-Z]?[a-z]+|[A-Z]|[0-9]+/g)
    ?.join('_').toLowerCase() ?? s
}
function toKebab(s) {
  return toSnake(s).replace(/_/g, '-')
}
function toPascal(s) {
  const c = toCamel(s)
  return c.charAt(0).toUpperCase() + c.slice(1)
}
function toTitle(s) {
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
function toSentence(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
function toAlternating(s) {
  return s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
}

const CASES = [
  { id: 'upper',       label: 'UPPER CASE',    fn: s => s.toUpperCase() },
  { id: 'lower',       label: 'lower case',    fn: s => s.toLowerCase() },
  { id: 'title',       label: 'Title Case',    fn: toTitle },
  { id: 'sentence',    label: 'Sentence case', fn: toSentence },
  { id: 'camel',       label: 'camelCase',     fn: toCamel },
  { id: 'pascal',      label: 'PascalCase',    fn: toPascal },
  { id: 'snake',       label: 'snake_case',    fn: toSnake },
  { id: 'kebab',       label: 'kebab-case',    fn: toKebab },
  { id: 'alternating', label: 'aLtErNaTiNg',   fn: toAlternating },
]

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [activeCase, setActiveCase] = useState('lower')
  const [copied, setCopied] = useState(false)

  const output = (() => {
    const fn = CASES.find(c => c.id === activeCase)?.fn
    return fn ? fn(input) : input
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Case Converter</h1>
      <p className="tool-description">
        Paste your text, choose a format, and copy the result instantly.
      </p>

      <label htmlFor="cc-input">Input text</label>
      <textarea
        id="cc-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your text here…"
      />

      <div className="chip-group" style={{ marginTop: '1.25rem' }}>
        {CASES.map(c => (
          <button
            key={c.id}
            className={`chip ${activeCase === c.id ? 'active' : ''}`}
            onClick={() => setActiveCase(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {input && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="code-block">{output}</div>
        </div>
      )}
      <RelatedTools category="text" exclude="/tools/case-converter" />
    </div>
  )
}
