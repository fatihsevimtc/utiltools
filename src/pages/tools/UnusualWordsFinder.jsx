import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function UnusualWordsFinder() {
  const [input, setInput] = useState('')

  // Common 1000 English words (simplified list)
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'did', 'having', 'may', 'should', 'very', 'more', 'much', 'such', 'many', 'through', 'being', 'where',
  ])

  function findUnusual(text) {
    if (!text) return []
    
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || []
    const unusual = []
    const seen = new Set()

    words.forEach(word => {
      if (word.length > 6 && !commonWords.has(word) && !seen.has(word)) {
        unusual.push(word)
        seen.add(word)
      }
    })

    return unusual.sort()
  }

  const unusualWords = findUnusual(input)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Unusual/Uncommon Words Finder</h1>
      <p className="tool-description">Find uncommon, sophisticated, or unusual words in your text that may need simplification or definition.</p>

      <label htmlFor="unusual-input">Text to analyze</label>
      <textarea 
        id="unusual-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Paste your text here..."
        rows={10}
      />

      {unusualWords.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="stat-card" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="stat-value">{unusualWords.length}</div>
            <div className="stat-label">Unusual words found</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Uncommon Words</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {unusualWords.map((word, i) => (
                <span key={i} style={{ 
                  background: 'var(--bg-tertiary)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  border: '1px solid var(--border)'
                }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {input && unusualWords.length === 0 && (
        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginTop: '1rem' }}>
          ✓ No unusual words found — your text uses common vocabulary
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/unusual-words-finder" />
      <ToolSeo />
    </div>
  )
}
