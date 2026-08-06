import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

function encode(str) {
  return str.replace(/[\u00A0-\u9999<>&"']/g, c => `&#${c.charCodeAt(0)};`)
}
function decode(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

export default function HtmlEntities() {
  const [input, setInput]   = useState('')
  const [mode, setMode]     = useState('encode')
  const [copied, setCopied] = useState(false)

  const output = input ? (mode === 'encode' ? encode(input) : decode(input)) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>HTML Entities Encoder / Decoder</h1>
      <p className="tool-description">Convert special characters to HTML entities and back.</p>

      <div className="chip-group">
        <button className={`chip ${mode==='encode'?'active':''}`} onClick={() => setMode('encode')}>Encode</button>
        <button className={`chip ${mode==='decode'?'active':''}`} onClick={() => setMode('decode')}>Decode</button>
      </div>

      <label htmlFor="he-input">Input</label>
      <textarea id="he-input" value={input} onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '<p>Hello & "World"</p>' : '&lt;p&gt;Hello &amp; &quot;World&quot;&lt;/p&gt;'} />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block">{output}</div>
        </div>
      )}
      <RelatedTools category="developer" exclude="/tools/html-entities" />
    </div>
  )
}
