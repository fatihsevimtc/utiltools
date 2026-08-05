import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function TextRepeater() {
  const [text, setText]       = useState('')
  const [times, setTimes]     = useState(5)
  const [separator, setSep]   = useState('\\n')
  const [copied, setCopied]   = useState(false)

  const sep = separator === '\\n' ? '\n' : separator === '\\t' ? '\t' : separator
  const output = text ? Array(Number(times)).fill(text).join(sep) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text Repeater</h1>
      <p className="tool-description">Repeat any string a set number of times with a custom separator.</p>

      <label htmlFor="tr-input">Text to repeat</label>
      <input id="tr-input" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Hello world" />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ flex: '1 1 120px' }}>
          <label>Repeat</label>
          <input type="number" min={1} max={1000} value={times} onChange={e => setTimes(Math.max(1, Number(e.target.value)))} />
        </div>
        <div style={{ flex: '2 1 180px' }}>
          <label>Separator</label>
          <select value={separator} onChange={e => setSep(e.target.value)}>
            <option value="\\n">New line</option>
            <option value=" ">Space</option>
            <option value=", ">Comma</option>
            <option value="\\t">Tab</option>
            <option value="">None</option>
          </select>
        </div>
      </div>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block">{output}</div>
        </div>
      )}
    </div>
  )
}
