import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

async function hashText(text, algo) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algo, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const ALGOS = [
  { id: 'SHA-1',   label: 'SHA-1' },
  { id: 'SHA-256', label: 'SHA-256' },
  { id: 'SHA-384', label: 'SHA-384' },
  { id: 'SHA-512', label: 'SHA-512' },
]

export default function HashGenerator() {
  const [input, setInput]   = useState('')
  const [hashes, setHashes] = useState({})
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (!input.trim()) { setHashes({}); return }
    Promise.all(ALGOS.map(a => hashText(input, a.id).then(h => [a.id, h])))
      .then(results => setHashes(Object.fromEntries(results)))
  }, [input])

  function copy(algo) {
    navigator.clipboard.writeText(hashes[algo]).then(() => { setCopied(algo); setTimeout(() => setCopied(''), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Hash Generator</h1>
      <p className="tool-description">Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes of any text using the browser's built-in Web Crypto API.</p>

      <label htmlFor="hash-input">Input text</label>
      <textarea id="hash-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste text to hash…" style={{ minHeight: 120 }} />

      {Object.keys(hashes).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
          {ALGOS.map(a => (
            <div key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label style={{ marginBottom: 0, color: 'var(--accent)' }}>{a.label}</label>
                <button className="btn btn-sm" onClick={() => copy(a.id)}>{copied===a.id ? '✓ Copied' : 'Copy'}</button>
              </div>
              <div className="code-block" style={{ fontSize: '0.8rem', wordBreak: 'break-all', minHeight: 'auto', padding: '0.6rem 0.8rem' }}>{hashes[a.id]}</div>
            </div>
          ))}
        </div>
      )}
      <RelatedTools category="generators" exclude="/tools/hash-generator" />
    </div>
  )
}
