import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

// Common Unicode blocks with representative ranges
const BLOCKS = [
  { name: 'Basic Latin',        start: 0x0020, end: 0x007F },
  { name: 'Latin Extended',     start: 0x00A0, end: 0x024F },
  { name: 'Greek & Coptic',     start: 0x0370, end: 0x03FF },
  { name: 'Cyrillic',           start: 0x0400, end: 0x04FF },
  { name: 'Hebrew',             start: 0x05D0, end: 0x05EA },
  { name: 'Arabic',             start: 0x0600, end: 0x06FF },
  { name: 'Currency Symbols',   start: 0x20A0, end: 0x20CF },
  { name: 'Arrows',             start: 0x2190, end: 0x21FF },
  { name: 'Math Operators',     start: 0x2200, end: 0x22FF },
  { name: 'Box Drawing',        start: 0x2500, end: 0x257F },
  { name: 'Geometric Shapes',   start: 0x25A0, end: 0x25FF },
  { name: 'Emoji (Misc)',       start: 0x2600, end: 0x26FF },
  { name: 'Dingbats',           start: 0x2700, end: 0x27BF },
  { name: 'CJK (sample)',       start: 0x4E00, end: 0x4E7F },
  { name: 'Emoji (Faces)',      start: 0x1F600, end: 0x1F64F },
  { name: 'Emoji (Nature)',     start: 0x1F300, end: 0x1F3FF },
]

export default function UnicodeCharMap() {
  const [query, setQuery]       = useState('')
  const [block, setBlock]       = useState(BLOCKS[0].name)
  const [copied, setCopied]     = useState(null)
  const [selected, setSelected] = useState(null)

  const currentBlock = BLOCKS.find(b => b.name === block) || BLOCKS[0]

  const chars = useMemo(() => {
    if (query.trim()) {
      // Search by name via Intl (limited) or codepoint
      const q = query.trim().toLowerCase()
      const results = []
      for (let cp = 0x20; cp <= 0x2BFF; cp++) {
        const ch = String.fromCodePoint(cp)
        try {
          const name = cp.toString(16).toUpperCase()
          if (`U+${name}`.toLowerCase().includes(q) || ch.includes(q)) {
            results.push(cp)
            if (results.length >= 200) break
          }
        } catch { /* skip */ }
      }
      return results
    }
    const arr = []
    for (let cp = currentBlock.start; cp <= currentBlock.end; cp++) arr.push(cp)
    return arr
  }, [query, block])

  function copy(ch) {
    navigator.clipboard.writeText(ch).then(() => {
      setCopied(ch); setTimeout(() => setCopied(null), 1000)
    })
  }

  return (
    <div className="tool-page" style={{ maxWidth: 900 }}>
      <BackBar />
      <h1>Unicode Character Map</h1>
      <p className="tool-description">Browse Unicode characters by block, search by codepoint, and click to copy.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search… e.g. U+2665 or paste a char" style={{ flex: 1, minWidth: 200 }} />
        {!query && (
          <select value={block} onChange={e => setBlock(e.target.value)} style={{ flex: 1, minWidth: 160 }}>
            {BLOCKS.map(b => <option key={b.name}>{b.name}</option>)}
          </select>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.3rem', marginBottom: '1rem' }}>
        {chars.map(cp => {
          const ch = String.fromCodePoint(cp)
          return (
            <button key={cp}
              onClick={() => { setSelected(cp); copy(ch) }}
              title={`U+${cp.toString(16).toUpperCase().padStart(4,'0')}`}
              style={{
                background: selected === cp ? 'var(--accent)' : 'var(--surface)',
                border: `1px solid ${selected === cp ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                color: selected === cp ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0.4rem',
                textAlign: 'center',
                lineHeight: 1,
                transition: 'all 0.1s',
              }}
            >{copied === ch ? '✓' : ch}</button>
          )
        })}
      </div>

      {selected !== null && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '3rem', lineHeight: 1 }}>{String.fromCodePoint(selected)}</div>
          <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.85rem' }}>
            <div><span style={{ color: 'var(--muted)' }}>Codepoint: </span><strong>U+{selected.toString(16).toUpperCase().padStart(4,'0')}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>Decimal: </span><strong>{selected}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>HTML entity: </span><strong>&amp;#{selected};</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>CSS: </span><strong>\\{selected.toString(16).toUpperCase()}</strong></div>
          </div>
          <button className="btn btn-sm" onClick={() => copy(String.fromCodePoint(selected))}>
            {copied === String.fromCodePoint(selected) ? '✓ Copied' : 'Copy character'}
          </button>
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/unicode-char-map" />
    </div>
  )
}
