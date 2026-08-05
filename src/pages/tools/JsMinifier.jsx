import { useState } from 'react'
import BackBar from '../../components/BackBar'

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')          // block comments
    .replace(/\/\/[^\n]*/g, '')                 // line comments
    .replace(/\n\s*\n/g, '\n')                  // blank lines
    .replace(/[ \t]+/g, ' ')                    // collapse spaces/tabs
    .replace(/\s*([=+\-*/%&|^!<>?:,;{}()[\]])\s*/g, '$1') // spaces around operators
    .replace(/\n/g, '')                         // remove newlines
    .trim()
}

export default function JsMinifier() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? minifyJS(input) : ''
  const saved = input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JS Minifier</h1>
      <p className="tool-description">
        Strip comments and whitespace from JavaScript. Basic minification — not a full AST minifier.
      </p>

      <label htmlFor="js-input">Input JavaScript</label>
      <textarea
        id="js-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="function hello() { console.log('Hello World'); }"
        style={{ minHeight: 180, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>
              Minified output
              <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                {saved}% smaller ({output.length} chars)
              </span>
            </label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
