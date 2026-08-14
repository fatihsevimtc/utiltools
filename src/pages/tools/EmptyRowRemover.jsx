import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function EmptyRowRemover() {
  const [input, setInput]           = useState('')
  const [trimLines, setTrimLines]   = useState(true)
  const [collapseMode, setCollapse] = useState('all') // all | collapse
  const [copied, setCopied]         = useState(false)

  const lines   = input.split('\n')
  const isEmpty = l => (trimLines ? l.trim() : l) === ''

  const output = (() => {
    if (!input) return ''
    if (collapseMode === 'all') {
      return lines.filter(l => !isEmpty(l)).join('\n')
    }
    // collapse: replace runs of blank lines with a single blank
    const result = []
    let prevBlank = false
    for (const l of lines) {
      const blank = isEmpty(l)
      if (blank && prevBlank) continue
      result.push(l)
      prevBlank = blank
    }
    // also strip leading/trailing blank lines
    while (result.length && isEmpty(result[0])) result.shift()
    while (result.length && isEmpty(result[result.length - 1])) result.pop()
    return result.join('\n')
  })()

  const removed = lines.length - output.split('\n').filter(Boolean).length

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Empty Row Remover</h1>
      <p className="tool-description">
        Remove all blank lines from your text, or collapse consecutive blank lines into one.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
        <div className="chip-group">
          <button className={`chip ${collapseMode === 'all' ? 'active' : ''}`} onClick={() => setCollapse('all')}>
            Remove all blank lines
          </button>
          <button className={`chip ${collapseMode === 'collapse' ? 'active' : ''}`} onClick={() => setCollapse('collapse')}>
            Collapse to single blank
          </button>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer', marginBottom: 0 }}>
          <input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} />
          Treat whitespace-only lines as blank
        </label>
      </div>

      <label htmlFor="err-input">Input text</label>
      <textarea
        id="err-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'Line one\n\nLine two\n\n\nLine three'}
        rows={8}
        style={{ fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>
              Output
              {input && (
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>
                  ({output.split('\n').length} lines, {removed} blank line{removed !== 1 ? 's' : ''} removed)
                </span>
              )}
            </label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} rows={Math.min(output.split('\n').length + 1, 14)} style={{ background: 'var(--surface)', cursor: 'default', fontFamily: 'monospace' }} />
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🧹', name: 'Duplicate Remover',   path: '/tools/duplicate-remover' },
        { icon: '↕️', name: 'Line Sorter',          path: '/tools/line-sort' },
        { icon: '🧼', name: 'Special Char Remover', path: '/tools/special-char-remover' },
        { icon: '🔡', name: 'Whitespace Remover',   path: '/tools/whitespace-remover' },
      ]} />
      <ToolSeo />
    </div>
  )
}
