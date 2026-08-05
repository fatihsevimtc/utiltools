import { useState } from 'react'
import BackBar from '../../components/BackBar'

function toSlug(text, separator) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, separator)
}

export default function SlugGenerator() {
  const [input, setInput] = useState('')
  const [sep, setSep] = useState('-')
  const [copied, setCopied] = useState(false)

  const output = input ? toSlug(input, sep) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Slug Generator</h1>
      <p className="tool-description">Convert any text into a URL-friendly slug, removing special characters and diacritics.</p>

      <label htmlFor="slug-input">Input text</label>
      <input
        id="slug-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="My Amazing Blog Post Title!"
      />

      <div className="chip-group" style={{ marginTop: '1rem' }}>
        <button className={`chip ${sep === '-' ? 'active' : ''}`} onClick={() => setSep('-')}>Hyphen (-)</button>
        <button className={`chip ${sep === '_' ? 'active' : ''}`} onClick={() => setSep('_')}>Underscore (_)</button>
      </div>

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Slug</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block">{output}</div>
        </div>
      )}
    </div>
  )
}
