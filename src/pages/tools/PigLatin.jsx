import { useState } from 'react'
import BackBar from '../../components/BackBar'

function toPigLatin(word) {
  const vowels = 'aeiouAEIOU'
  if (!word.match(/[a-zA-Z]/)) return word
  const prefix = word.match(/^[^a-zA-Z]*/)[0]
  const suffix = word.match(/[^a-zA-Z]*$/)[0]
  const core = word.slice(prefix.length, word.length - suffix.length)
  if (!core) return word

  const isUpper = core[0] === core[0].toUpperCase() && core[0] !== core[0].toLowerCase()

  if (vowels.includes(core[0])) {
    const result = core + 'way'
    return prefix + (isUpper ? result[0].toUpperCase() + result.slice(1).toLowerCase() : result) + suffix
  }

  // Find first vowel
  let i = 0
  while (i < core.length && !vowels.includes(core[i])) i++
  const consonants = core.slice(0, i)
  const rest = core.slice(i)
  const result = rest + consonants.toLowerCase() + 'ay'
  return prefix + (isUpper ? result[0].toUpperCase() + result.slice(1) : result) + suffix
}

function convertPigLatin(text) {
  return text.replace(/[a-zA-Z'-]+/g, toPigLatin)
}

export default function PigLatin() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? convertPigLatin(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Pig Latin Converter</h1>
      <p className="tool-description">Convert English text to Pig Latin.</p>

      <label htmlFor="pl-input">Input text</label>
      <textarea
        id="pl-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="The quick brown fox jumps over the lazy dog"
        style={{ minHeight: 120 }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Pig Latin</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}

      <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
        <strong>Rules:</strong> Words starting with a vowel → add "way". Words starting with consonants → move consonant cluster to end + "ay".
      </div>
    </div>
  )
}
