import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function RepeatedWordsFinder() {
  const [text, setText] = useState('')
  const [minCount, setMinCount] = useState(2)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [ignoreCommon, setIgnoreCommon] = useState(true)

  const COMMON = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','i','you','he','she','it','we','they','my','your','his','her','its','our','their'])

  const repeats = useMemo(() => {
    if (!text.trim()) return []
    const words = text.toLowerCase().replace(/[^a-zA-Z\s'-]/g, ' ').split(/\s+/).filter(Boolean)
    const map = {}
    for (const w of words) {
      const key = caseSensitive ? w : w.toLowerCase()
      if (ignoreCommon && COMMON.has(key)) continue
      map[key] = (map[key] || 0) + 1
    }
    return Object.entries(map)
      .filter(([, c]) => c >= minCount)
      .sort((a, b) => b[1] - a[1])
  }, [text, minCount, caseSensitive, ignoreCommon])

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Repeated Words Finder</h1>
      <p className="tool-description">
        Find overused and repeated words in any text. Great for editing essays, blog posts, and reports for variety.
      </p>

      <label htmlFor="rwf-input">Your text</label>
      <textarea
        id="rwf-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here to find repeated words…"
        style={{ minHeight: 180 }}
      />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="rwf-min" style={{ fontSize: '0.875rem', marginBottom: 0 }}>Min occurrences:</label>
          <input
            id="rwf-min"
            type="number"
            min={2}
            max={100}
            value={minCount}
            onChange={e => setMinCount(Math.max(2, parseInt(e.target.value) || 2))}
            style={{ width: 70 }}
          />
        </div>
        {[
          ['caseSensitive', 'Case sensitive', caseSensitive, setCaseSensitive],
          ['ignoreCommon', 'Ignore common words', ignoreCommon, setIgnoreCommon],
        ].map(([id, label, val, setter]) => (
          <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      {text.trim() && (
        <div style={{ marginTop: '1.25rem' }}>
          {repeats.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No repeated words found with the current settings.</p>
          ) : (
            <>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>{repeats.length} repeated word{repeats.length !== 1 ? 's' : ''} found</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {repeats.map(([word, count]) => (
                  <span key={word} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>{word}</span>
                    <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 20, padding: '0.05rem 0.45rem', fontSize: '0.72rem', fontWeight: 700 }}>{count}×</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/repeated-words" />
      <ToolSeo />
    </div>
  )
}
