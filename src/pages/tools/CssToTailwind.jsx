import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MAP = [
  ['display: flex', 'flex'],
  ['display: block', 'block'],
  ['display: inline-block', 'inline-block'],
  ['display: inline', 'inline'],
  ['display: grid', 'grid'],
  ['display: none', 'hidden'],
  ['flex-direction: row', 'flex-row'],
  ['flex-direction: column', 'flex-col'],
  ['align-items: center', 'items-center'],
  ['align-items: flex-start', 'items-start'],
  ['align-items: flex-end', 'items-end'],
  ['justify-content: center', 'justify-center'],
  ['justify-content: flex-start', 'justify-start'],
  ['justify-content: flex-end', 'justify-end'],
  ['justify-content: space-between', 'justify-between'],
  ['justify-content: space-around', 'justify-around'],
  ['font-weight: bold', 'font-bold'],
  ['font-weight: 700', 'font-bold'],
  ['font-weight: 400', 'font-normal'],
  ['font-weight: 600', 'font-semibold'],
  ['text-align: center', 'text-center'],
  ['text-align: left', 'text-left'],
  ['text-align: right', 'text-right'],
  ['text-decoration: underline', 'underline'],
  ['text-decoration: none', 'no-underline'],
  ['overflow: hidden', 'overflow-hidden'],
  ['overflow: scroll', 'overflow-scroll'],
  ['overflow: auto', 'overflow-auto'],
  ['position: relative', 'relative'],
  ['position: absolute', 'absolute'],
  ['position: fixed', 'fixed'],
  ['position: sticky', 'sticky'],
  ['cursor: pointer', 'cursor-pointer'],
  ['cursor: not-allowed', 'cursor-not-allowed'],
  ['width: 100%', 'w-full'],
  ['height: 100%', 'h-full'],
  ['width: 100vw', 'w-screen'],
  ['height: 100vh', 'h-screen'],
  ['min-width: 0', 'min-w-0'],
  ['flex-wrap: wrap', 'flex-wrap'],
  ['flex-wrap: nowrap', 'flex-nowrap'],
  ['border-radius: 9999px', 'rounded-full'],
  ['border-radius: 0.25rem', 'rounded'],
  ['border-radius: 0.5rem', 'rounded-lg'],
  ['box-sizing: border-box', 'box-border'],
  ['user-select: none', 'select-none'],
  ['pointer-events: none', 'pointer-events-none'],
  ['visibility: hidden', 'invisible'],
  ['opacity: 0', 'opacity-0'],
  ['opacity: 1', 'opacity-100'],
  ['transition: all 0.3s', 'transition-all duration-300'],
  ['border: none', 'border-0'],
  ['list-style: none', 'list-none'],
  ['white-space: nowrap', 'whitespace-nowrap'],
  ['white-space: pre-wrap', 'whitespace-pre-wrap'],
  ['word-break: break-all', 'break-all'],
]

function convertLine(line) {
  const clean = line.trim().replace(/;$/, '').trim()
  const match = MAP.find(([css]) => clean.toLowerCase() === css.toLowerCase())
  if (match) return match[1]
  return `/* not mapped: ${clean} */`
}

function convert(input) {
  return input
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('{') && !l.startsWith('}') && !l.startsWith('//') && !l.startsWith('/*'))
    .map(convertLine)
    .join('\n')
}

export default function CssToTailwind() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? convert(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>CSS → Tailwind</h1>
      <p className="tool-description">Convert common CSS declarations to equivalent Tailwind CSS utility classes.</p>

      <label htmlFor="css-tw-input">CSS declarations (one per line)</label>
      <textarea
        id="css-tw-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'display: flex;\nalign-items: center;\nfont-weight: bold;'}
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Tailwind classes</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
