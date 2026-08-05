import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

export default function SentenceCounter() {
  const [input, setInput] = useState('')

  const stats = useMemo(() => {
    if (!input.trim()) return null
    const sentences = input.match(/[^.!?]+[.!?]+/g) || []
    const words = input.trim().split(/\s+/).filter(Boolean)
    const chars = input.length
    const charsNoSpaces = input.replace(/\s/g, '').length
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim()).length
    const avgWordsPerSentence = sentences.length ? (words.length / sentences.length).toFixed(1) : 0
    const vowelCount = (input.match(/[aeiouAEIOU]/g) || []).length
    const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length
    return { sentences: sentences.length, words: words.length, chars, charsNoSpaces, paragraphs, avgWordsPerSentence, vowelCount, consonantCount }
  }, [input])

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Sentence Counter</h1>
      <p className="tool-description">Count sentences, words, characters, paragraphs and more.</p>

      <label htmlFor="sc-input">Input text</label>
      <textarea
        id="sc-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your text here…"
        style={{ minHeight: 180 }}
      />

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          {[
            ['Sentences', stats.sentences, '💬'],
            ['Words', stats.words, '📝'],
            ['Characters', stats.chars, '🔤'],
            ['Chars (no spaces)', stats.charsNoSpaces, '📏'],
            ['Paragraphs', stats.paragraphs, '¶'],
            ['Avg words/sentence', stats.avgWordsPerSentence, '📊'],
            ['Vowels', stats.vowelCount, 'A'],
            ['Consonants', stats.consonantCount, 'B'],
          ].map(([label, val, icon]) => (
            <div key={label} style={{ background: 'var(--surface)', borderRadius: 10, padding: '0.9rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{val}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
