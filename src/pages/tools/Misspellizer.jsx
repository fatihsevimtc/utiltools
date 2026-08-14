import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function Misspellizer() {
  const [input, setInput] = useState('')
  const [intensity, setIntensity] = useState(30)

  function misspell(text, percent) {
    if (!text) return ''
    
    const words = text.split(/(\s+)/)
    const shouldMisspell = Math.floor(100 / percent)
    
    return words.map((word, i) => {
      if (!word.trim() || word.length < 3) return word
      if (i % shouldMisspell !== 0) return word
      
      const techniques = [
        // Double letter
        () => {
          const pos = Math.floor(Math.random() * word.length)
          return word.slice(0, pos) + word[pos] + word.slice(pos)
        },
        // Swap adjacent letters
        () => {
          if (word.length < 2) return word
          const pos = Math.floor(Math.random() * (word.length - 1))
          const arr = word.split('')
          ;[arr[pos], arr[pos + 1]] = [arr[pos + 1], arr[pos]]
          return arr.join('')
        },
        // Remove a letter
        () => {
          if (word.length < 4) return word
          const pos = Math.floor(Math.random() * word.length)
          return word.slice(0, pos) + word.slice(pos + 1)
        },
        // Common typos
        () => word.replace(/e/i, 'ee').replace(/o/i, 'oo'),
      ]
      
      const technique = techniques[Math.floor(Math.random() * techniques.length)]
      return technique()
    }).join('')
  }

  const output = misspell(input, Math.max(1, intensity))

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Misspellizer</h1>
      <p className="tool-description">Intentionally misspell text for testing spell-checkers, creating puzzles, or having fun.</p>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="intensity">Misspelling intensity: {intensity}%</label>
        <input 
          id="intensity"
          type="range" 
          min="10" 
          max="100" 
          value={intensity} 
          onChange={e => setIntensity(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <label htmlFor="misspell-input">Original Text</label>
      <textarea 
        id="misspell-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Enter text to misspell..."
        rows={8}
      />

      <label htmlFor="misspell-output">Misspelled Text</label>
      <textarea 
        id="misspell-output"
        value={output} 
        readOnly
        rows={8}
      />

      <button className="btn" onClick={() => navigator.clipboard.writeText(output)}>
        Copy Misspelled Text
      </button>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.875rem' }}>
        <strong>Misspelling techniques:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Double letters (e.g., "hello" → "helllo")</li>
          <li>Swap adjacent letters (e.g., "word" → "wrod")</li>
          <li>Remove random letters (e.g., "test" → "tst")</li>
          <li>Common typos (e.g., "too" → "tooo")</li>
        </ul>
      </div>

      <RelatedTools category="text" exclude="/tools/misspellizer" />
      <ToolSeo />
    </div>
  )
}
