import { useState } from 'react'
import BackBar from '../../components/BackBar'

const VOWELS = new Set('aeiouAEIOU')

function analyze(text) {
  let vowels = 0, consonants = 0, spaces = 0, digits = 0, special = 0
  for (const ch of text) {
    if (VOWELS.has(ch)) vowels++
    else if (/[a-zA-Z]/.test(ch)) consonants++
    else if (/\d/.test(ch)) digits++
    else if (/\s/.test(ch)) spaces++
    else special++
  }
  return { vowels, consonants, letters: vowels + consonants, spaces, digits, special, total: text.length }
}

export default function VowelCounter() {
  const [input, setInput] = useState('')

  const stats = analyze(input)

  const cards = [
    { label: 'Vowels',     value: stats.vowels },
    { label: 'Consonants', value: stats.consonants },
    { label: 'Letters',    value: stats.letters },
    { label: 'Spaces',     value: stats.spaces },
    { label: 'Digits',     value: stats.digits },
    { label: 'Special',    value: stats.special },
    { label: 'Total Chars',value: stats.total },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Vowel Counter</h1>
      <p className="tool-description">Count vowels, consonants, and character types in any text.</p>

      <label htmlFor="vc-input">Input text</label>
      <textarea
        id="vc-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text here…"
        style={{ minHeight: 160 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'var(--surface2, #f5f5f5)', borderRadius: '0.5rem', padding: '0.75rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent, #6366f1)' }}>{c.value}</div>
            <div style={{ fontSize: '0.78rem', opacity: 0.65, marginTop: '0.2rem' }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
