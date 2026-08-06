import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function formatCSS(css) {
  // Strip comments, then re-format
  let result = ''
  let indent = 0
  const tab = '  '

  // Tokenise roughly by { } ;
  const tokens = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/([\{\};])/)
    .map(t => t.trim())
    .filter(Boolean)

  for (const token of tokens) {
    if (token === '{') {
      result += ' {\n'
      indent++
    } else if (token === '}') {
      indent = Math.max(0, indent - 1)
      result += tab.repeat(indent) + '}\n'
    } else if (token === ';') {
      result += ';\n'
    } else {
      // Check if it's a selector (next char would be {) or a property
      result += tab.repeat(indent) + token
    }
  }

  return result.trim()
}

export default function CssFormatter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? formatCSS(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>CSS Formatter</h1>
      <p className="tool-description">Prettify and indent CSS for readability.</p>

      <label htmlFor="cssf-input">Input CSS</label>
      <textarea
        id="cssf-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder=".example{color:red;background:blue}"
        style={{ minHeight: 180, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Formatted output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
      <RelatedTools category="developer" exclude="/tools/css-formatter" />
          <ToolSeo />
    </div>
  )
}
