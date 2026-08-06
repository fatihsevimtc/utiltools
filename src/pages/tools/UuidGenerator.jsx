import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export default function UuidGenerator() {
  const [count, setCount]   = useState(5)
  const [uuids, setUuids]   = useState([])
  const [upper, setUpper]   = useState(false)
  const [copied, setCopied] = useState(false)

  function generate() {
    const list = Array.from({ length: count }, () => upper ? uuidv4().toUpperCase() : uuidv4())
    setUuids(list)
  }

  const output = uuids.join('\n')

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>UUID Generator</h1>
      <p className="tool-description">Generate cryptographically random v4 UUIDs — up to 100 at once.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div style={{ flex: '1 1 120px' }}>
          <label>Count (1–100)</label>
          <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', cursor: 'pointer', paddingBottom: '0.65rem' }}>
          <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
          Uppercase
        </label>
        <button className="btn" onClick={generate} style={{ flexShrink: 0 }}>Generate</button>
      </div>

      {uuids.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>{uuids.length} UUID{uuids.length>1?'s':''}</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
          </div>
          <div className="code-block">{output}</div>
        </>
      )}
          <ToolSeo />
    </div>
  )
}
