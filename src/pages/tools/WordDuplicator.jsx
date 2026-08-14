import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function WordDuplicator() {
  const [input, setInput]   = useState('')
  const [times, setTimes]   = useState(2)
  const [sep, setSep]       = useState(' ')
  const [customSep, setCustomSep] = useState('')
  const [mode, setMode]     = useState('words')
  const [copied, setCopied] = useState(false)

  const separator = sep === 'custom' ? customSep : sep === 'newline' ? '\n' : sep

  const output = (() => {
    if (!input.trim() || times < 2) return ''
    if (mode === 'words') {
      return input
        .split('\n')
        .map(line =>
          line.split(/(\s+)/).map(token =>
            /\s+/.test(token) ? token : Array(times).fill(token).join(separator)
          ).join('')
        )
        .join('\n')
    }
    // sentence / line mode
    return input
      .split('\n')
      .map(line => line.trim() ? Array(times).fill(line.trim()).join(separator) : line)
      .join('\n')
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const SEP_OPTIONS = [
    { label: 'Space', value: ' ' },
    { label: 'Comma', value: ', ' },
    { label: 'New line', value: 'newline' },
    { label: 'Custom', value: 'custom' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Word / Sentence Duplicator</h1>
      <p className="tool-description">
        Repeat every word or every line/sentence a set number of times, with your choice of separator.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
        <div className="chip-group">
          <button className={`chip ${mode === 'words' ? 'active' : ''}`} onClick={() => setMode('words')}>Repeat words</button>
          <button className={`chip ${mode === 'lines' ? 'active' : ''}`} onClick={() => setMode('lines')}>Repeat lines</button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: 0 }}>
          Repeat:
          <input
            type="number"
            min={2}
            max={20}
            value={times}
            onChange={e => setTimes(Math.max(2, Math.min(20, Number(e.target.value) || 2)))}
            style={{ width: 60, padding: '0.3rem 0.5rem', fontSize: '0.875rem' }}
          />
          times
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Separator:</span>
        {SEP_OPTIONS.map(o => (
          <button key={o.value} className={`chip ${sep === o.value ? 'active' : ''}`} onClick={() => setSep(o.value)}>
            {o.label}
          </button>
        ))}
        {sep === 'custom' && (
          <input
            value={customSep}
            onChange={e => setCustomSep(e.target.value)}
            placeholder="e.g. | or -"
            style={{ width: 80, padding: '0.3rem 0.5rem', fontSize: '0.875rem' }}
          />
        )}
      </div>

      <label htmlFor="wd-input">Input text</label>
      <textarea
        id="wd-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'words' ? 'hello world' : 'The quick brown fox.\nLine two here.'}
        rows={5}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} rows={6} style={{ background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🔀', name: 'Word Randomizer',    path: '/tools/word-randomizer' },
        { icon: '📝', name: 'Text Repeater',       path: '/tools/text-repeater' },
        { icon: '✂️', name: 'Text Splitter',       path: '/tools/text-splitter' },
        { icon: '🧹', name: 'Duplicate Remover',   path: '/tools/duplicate-remover' },
      ]} />
      <ToolSeo />
    </div>
  )
}
