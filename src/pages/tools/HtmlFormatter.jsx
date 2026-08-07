import { useState } from 'react'
import BackBar from '../../components/BackBar'

function formatHtml(html) {
  const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])
  let indent = 0
  let result = ''
  const tokens = html.match(/<[^>]+>|[^<]+/g) || []
  for (const token of tokens) {
    const trimmed = token.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1)
      result += '  '.repeat(indent) + trimmed + '\n'
    } else if (trimmed.startsWith('<') && !trimmed.startsWith('<!--')) {
      const tag = (trimmed.match(/^<([a-zA-Z0-9]+)/) || [])[1] || ''
      result += '  '.repeat(indent) + trimmed + '\n'
      if (!VOID.has(tag.toLowerCase()) && !trimmed.endsWith('/>')) indent++
    } else {
      if (trimmed) result += '  '.repeat(indent) + trimmed + '\n'
    }
  }
  return result.trim()
}

export default function HtmlFormatter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? formatHtml(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>HTML Formatter</h1>
      <p className="tool-description">Format and indent HTML markup for better readability.</p>

      <label htmlFor="html-input">HTML input</label>
      <textarea
        id="html-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="<html><body><p>Hello</p></body></html>"
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Formatted output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
