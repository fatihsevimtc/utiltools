import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ListToArray() {
  const [input, setInput]   = useState('')
  const [lang, setLang]     = useState('js')
  const [quoteType, setQt]  = useState('double') // 'double' | 'single' | 'none'
  const [copied, setCopied] = useState(false)

  const langs = [
    { id: 'js',     label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'php',    label: 'PHP' },
    { id: 'ruby',   label: 'Ruby' },
    { id: 'csv',    label: 'CSV' },
  ]

  const items = input.split('\n').map(l => l.trim()).filter(Boolean)
  const q = quoteType === 'double' ? '"' : quoteType === 'single' ? "'" : ''

  const output = (() => {
    if (!items.length) return ''
    const wrapped = items.map(i => `${q}${i.replace(new RegExp(q, 'g'), `\\${q}`)}${q}`)
    switch (lang) {
      case 'js':     return `[${wrapped.join(', ')}]`
      case 'python': return `[${wrapped.join(', ')}]`
      case 'php':    return `[${wrapped.join(', ')}]`
      case 'ruby':   return `[${wrapped.join(', ')}]`
      case 'csv':    return items.map(i => q ? `${q}${i}${q}` : i).join(', ')
      default:       return wrapped.join(', ')
    }
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>List to Array Converter</h1>
      <p className="tool-description">
        Convert a line-by-line list into a code array for JavaScript, Python, PHP, Ruby, or a CSV string.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div className="chip-group">
          {langs.map(l => (
            <button key={l.id} className={`chip ${lang === l.id ? 'active' : ''}`} onClick={() => setLang(l.id)}>{l.label}</button>
          ))}
        </div>
        {lang !== 'csv' && (
          <div className="chip-group">
            <button className={`chip ${quoteType === 'double' ? 'active' : ''}`} onClick={() => setQt('double')}>Double quotes</button>
            <button className={`chip ${quoteType === 'single' ? 'active' : ''}`} onClick={() => setQt('single')}>Single quotes</button>
            <button className={`chip ${quoteType === 'none' ? 'active' : ''}`} onClick={() => setQt('none')}>No quotes</button>
          </div>
        )}
      </div>

      <label htmlFor="la-input">Items (one per line)</label>
      <textarea
        id="la-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'apple\nbanana\ncherry'}
        style={{ minHeight: 180 }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Array ({items.length} items)</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{output}</div>
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/list-to-array" />
      <ToolSeo />
    </div>
  )
}
