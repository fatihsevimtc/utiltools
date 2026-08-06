import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function minifyHTML(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')            // remove comments
    .replace(/>\s+</g, '><')                    // remove whitespace between tags
    .replace(/\s{2,}/g, ' ')                    // collapse multiple spaces
    .replace(/\n/g, '')                         // remove newlines
    .trim()
}

export default function HtmlMinifier() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? minifyHTML(input) : ''
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
      <h1>HTML Minifier</h1>
      <p className="tool-description">Remove comments and extra whitespace from HTML to reduce file size.</p>

      <label htmlFor="htmlm-input">Input HTML</label>
      <textarea
        id="htmlm-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="<div>  <!-- comment -->  <p>Hello</p>  </div>"
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
      <RelatedTools category="developer" exclude="/tools/html-minifier" />
          <ToolSeo />
    </div>
  )
}
