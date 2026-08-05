import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function UrlBuilder() {
  const [protocol, setProtocol] = useState('https')
  const [host, setHost] = useState('example.com')
  const [port, setPort] = useState('')
  const [path, setPath] = useState('/path/to/resource')
  const [params, setParams] = useState([{ key: 'name', value: 'Alice' }])
  const [hash, setHash] = useState('')
  const [copied, setCopied] = useState(false)

  function addParam() {
    setParams(p => [...p, { key: '', value: '' }])
  }
  function removeParam(i) {
    setParams(p => p.filter((_, idx) => idx !== i))
  }
  function updateParam(i, field, val) {
    setParams(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  const url = (() => {
    try {
      const base = `${protocol}://${host}${port ? ':' + port : ''}${path.startsWith('/') ? path : '/' + path}`
      const u = new URL(base)
      params.forEach(({ key, value }) => {
        if (key.trim()) u.searchParams.append(key.trim(), value)
      })
      if (hash.trim()) u.hash = hash.trim()
      return u.toString()
    } catch {
      return '(invalid URL)'
    }
  })()

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>URL Builder</h1>
      <p className="tool-description">Assemble URLs from parts with proper encoding of query parameters.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label style={{ marginBottom: 0 }}>Protocol</label>
        <div className="chip-group" style={{ margin: 0 }}>
          {['https', 'http'].map(p => (
            <button key={p} className={`chip ${protocol === p ? 'active' : ''}`} onClick={() => setProtocol(p)}>{p}</button>
          ))}
        </div>

        <label style={{ marginBottom: 0 }}>Host</label>
        <input type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="example.com" />

        <label style={{ marginBottom: 0 }}>Port</label>
        <input type="text" value={port} onChange={e => setPort(e.target.value)} placeholder="(optional)" />

        <label style={{ marginBottom: 0 }}>Path</label>
        <input type="text" value={path} onChange={e => setPath(e.target.value)} placeholder="/path/to/resource" />

        <label style={{ marginBottom: 0 }}>Hash</label>
        <input type="text" value={hash} onChange={e => setHash(e.target.value)} placeholder="section (optional)" />
      </div>

      <label>Query parameters</label>
      {params.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={p.key}
            onChange={e => updateParam(i, 'key', e.target.value)}
            placeholder="key"
            style={{ flex: 1 }}
          />
          <input
            type="text"
            value={p.value}
            onChange={e => updateParam(i, 'value', e.target.value)}
            placeholder="value"
            style={{ flex: 2 }}
          />
          <button className="btn btn-sm" onClick={() => removeParam(i)} style={{ flexShrink: 0 }}>✕</button>
        </div>
      ))}
      <button className="btn btn-sm" onClick={addParam} style={{ marginBottom: '1.25rem' }}>+ Add parameter</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label style={{ marginBottom: 0 }}>Generated URL</label>
        <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div className="code-block" style={{ wordBreak: 'break-all' }}>{url}</div>
    </div>
  )
}
