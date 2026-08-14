import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function RandomTextInserter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('letters')
  const [density, setDensity] = useState(10)

  const randomWords = ['the', 'and', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'do', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must']
  const randomLetters = 'abcdefghijklmnopqrstuvwxyz'

  function insertRandom(text) {
    if (!text) return ''
    const words = text.split(/(\s+)/)
    const insertEvery = Math.max(1, Math.floor(100 / density))
    
    return words.map((word, i) => {
      if (i % insertEvery !== 0 || !word.trim()) return word
      
      if (mode === 'words') {
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)]
        return word + ' ' + randomWord
      } else if (mode === 'letters') {
        const randomLetter = randomLetters[Math.floor(Math.random() * randomLetters.length)]
        const pos = Math.floor(Math.random() * word.length)
        return word.slice(0, pos) + randomLetter + word.slice(pos)
      } else { // errors (swap letters)
        if (word.length > 2) {
          const arr = word.split('')
          const i1 = Math.floor(Math.random() * (arr.length - 1))
          const i2 = i1 + 1
          ;[arr[i1], arr[i2]] = [arr[i2], arr[i1]]
          return arr.join('')
        }
        return word
      }
    }).join('')
  }

  const output = insertRandom(input)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Add Random Words / Letters / Errors to Text</h1>
      <p className="tool-description">Insert random words, letters, or intentional typos into your text for testing or creative purposes.</p>

      <div style={{ marginBottom: '1rem' }}>
        <label>Mode</label>
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="letters">Random Letters</option>
          <option value="words">Random Words</option>
          <option value="errors">Swap Letters (Errors)</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="density">Density: {density}%</label>
        <input 
          id="density" 
          type="range" 
          min="1" 
          max="50" 
          value={density} 
          onChange={e => setDensity(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <label htmlFor="random-input">Input Text</label>
      <textarea 
        id="random-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Enter your text here..."
        rows={8}
      />

      <label htmlFor="random-output">Output</label>
      <textarea 
        id="random-output"
        value={output} 
        readOnly
        rows={8}
      />

      <button className="btn" onClick={() => navigator.clipboard.writeText(output)}>
        Copy Output
      </button>

      <RelatedTools category="text" exclude="/tools/random-text-inserter" />
      <ToolSeo />
    </div>
  )
}
