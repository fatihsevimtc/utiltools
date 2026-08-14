import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WordRandomizer() {
  const [input, setInput] = useState('the quick brown fox jumps over the lazy dog')
  const [mode, setMode] = useState('shuffle-words')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const process = useCallback(() => {
    const text = input.trim()
    if (!text) { setOutput(''); return }

    let result = ''
    if (mode === 'shuffle-words') {
      // Shuffle words across lines
      result = text
        .split('\n')
        .map(line => shuffleArray(line.split(/\s+/).filter(Boolean)).join(' '))
        .join('\n')
    } else if (mode === 'shuffle-lines') {
      result = shuffleArray(text.split('\n')).join('\n')
    } else if (mode === 'shuffle-chars') {
      // Shuffle characters within each word, keeping first/last
      result = text
        .split('\n')
        .map(line =>
          line.split(/(\s+)/).map(token => {
            if (/\s+/.test(token)) return token
            if (token.length <= 3) return token
            const mid = shuffleArray(token.slice(1, -1).split('')).join('')
            return token[0] + mid + token[token.length - 1]
          }).join('')
        )
        .join('\n')
    } else if (mode === 'random-word') {
      const words = text.split(/\s+/).filter(Boolean)
      result = words[Math.floor(Math.random() * words.length)] || ''
    } else if (mode === 'pick-n') {
      const words = text.split(/\s+/).filter(Boolean)
      result = shuffleArray(words).slice(0, Math.min(5, words.length)).join(' ')
    }

    setOutput(result)
  }, [input, mode])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const MODES = [
    { id: 'shuffle-words',  label: '🔀 Shuffle Words' },
    { id: 'shuffle-lines',  label: '↕️ Shuffle Lines' },
    { id: 'shuffle-chars',  label: '🔡 Shuffle Chars (in-word)' },
    { id: 'random-word',    label: '🎲 Pick Random Word' },
    { id: 'pick-n',         label: '🎯 Pick 5 Random Words' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Word Randomizer</h1>
      <p className="tool-description">
        Shuffle words, lines, or characters — or pick random words from any text.
      </p>

      <div className="chip-group" style={{ flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button
            key={m.id}
            className={`chip ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <label htmlFor="wr-input">Input text</label>
      <textarea
        id="wr-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={6}
      />

      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={process}>
        🎲 Randomize
      </button>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {output}
          </div>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🎲', name: 'Random Picker',           path: '/tools/random-picker' },
        { icon: '🎲', name: 'Random Sentence Generator', path: '/tools/random-sentence' },
        { icon: '↕️', name: 'Line Sorter',              path: '/tools/line-sort' },
        { icon: '🧹', name: 'Duplicate Remover',        path: '/tools/duplicate-remover' },
      ]} />
      <ToolSeo />
    </div>
  )
}
