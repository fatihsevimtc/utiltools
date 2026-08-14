import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ComplexEnglishHelper() {
  const [input, setInput] = useState('')

  // Simple patterns for complex/uncommon constructions
  const patterns = [
    { regex: /\b(notwithstanding|nonetheless|nevertheless|hitherto|heretofore|wherein|whereby)\b/gi, type: 'Formal/Archaic word' },
    { regex: /\b(utilise|utilisation|whilst|amongst|colour)\b/gi, type: 'British spelling' },
    { regex: /\b\w+tion\b/gi, type: 'Abstract noun (-tion)' },
    { regex: /[;:—]/g, type: 'Complex punctuation' },
  ]

  function analyzeText(text) {
    if (!text) return []
    const findings = []
    
    patterns.forEach(({ regex, type }) => {
      const matches = text.match(regex)
      if (matches) {
        matches.forEach(match => {
          findings.push({ word: match, type, suggestion: getSuggestion(match, type) })
        })
      }
    })

    return findings
  }

  function getSuggestion(word, type) {
    const simplifications = {
      'notwithstanding': 'despite',
      'nonetheless': 'however',
      'nevertheless': 'however',
      'hitherto': 'until now',
      'heretofore': 'before now',
      'wherein': 'in which',
      'whereby': 'by which',
      'utilise': 'use',
      'utilisation': 'use',
      'whilst': 'while',
      'amongst': 'among',
      'colour': 'color',
    }
    
    return simplifications[word.toLowerCase()] || 'Simplify if possible'
  }

  const results = analyzeText(input)
  const complexWords = results.filter(r => r.type.includes('Formal') || r.type.includes('British'))

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Understand Complex/Foreign English Text Helper</h1>
      <p className="tool-description">Identify complex, formal, or British English constructions and get simpler alternatives.</p>

      <label htmlFor="complex-input">Paste your text</label>
      <textarea 
        id="complex-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Paste text with complex or formal English..."
        rows={10}
      />

      {results.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Analysis Results</h3>
          <div className="stats-row" style={{ marginBottom: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value">{results.length}</div>
              <div className="stat-label">Complex patterns found</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{complexWords.length}</div>
              <div className="stat-label">Complex words</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
            {results.slice(0, 20).map((r, i) => (
              <div key={i} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--primary)' }}>{r.word}</strong>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  {r.type} → {r.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/complex-english-helper" />
      <ToolSeo />
    </div>
  )
}
