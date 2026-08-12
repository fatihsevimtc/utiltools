import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'
import DeveloperPortalBanner from '../../components/DeveloperPortalBanner'

const MODES = ['Base64 Encode', 'Base64 Decode', 'URL Encode', 'URL Decode']

function process(input, mode) {
  try {
    switch (mode) {
      case 'Base64 Encode': return btoa(unescape(encodeURIComponent(input)))
      case 'Base64 Decode': return decodeURIComponent(escape(atob(input)))
      case 'URL Encode':    return encodeURIComponent(input)
      case 'URL Decode':    return decodeURIComponent(input)
      default: return ''
    }
  } catch (e) {
    return `Error: ${e.message}`
  }
}

export default function Base64Tool() {
  const [mode, setMode] = useState('Base64 Encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input.trim() ? process(input, mode) : ''
  const isError = output.startsWith('Error:')

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function swap() {
    setInput(output)
    // flip mode
    const pairs = {
      'Base64 Encode': 'Base64 Decode',
      'Base64 Decode': 'Base64 Encode',
      'URL Encode':    'URL Decode',
      'URL Decode':    'URL Encode',
    }
    setMode(pairs[mode] ?? mode)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Base64 / URL Encoder–Decoder</h1>
      <p className="tool-description">
        Encode or decode Base64 and URL strings instantly in your browser.
      </p>

      <DeveloperPortalBanner packageName="Base64 encoding" />

      <div className="chip-group">
        {MODES.map(m => (
          <button key={m} className={`chip ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
            {m}
          </button>
        ))}
      </div>

      <label htmlFor="b64-input">Input</label>
      <textarea
        id="b64-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste text here…"
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={swap}>⇄ Swap</button>
              {!isError && <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>}
            </div>
          </div>
          <div className={`code-block ${isError ? 'error' : ''}`}>{output}</div>
        </div>
      )}
      <RelatedTools category="developer" exclude="/tools/base64" />
          <ToolSeo />
    </div>
  )
}
