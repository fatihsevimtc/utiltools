import { useState } from 'react'
import BackBar from '../../components/BackBar'

// APA 7th edition title case rules
const MINOR_WORDS = new Set([
  'a','an','the',
  'and','but','for','nor','or','so','yet',
  'as','at','by','in','of','off','on','per','to','up','via',
])

function toApaTitle(text) {
  return text
    .split(/\s+/)
    .map((word, index, arr) => {
      const clean = word.replace(/[^a-zA-Z'-]/g, '').toLowerCase()
      const punctBefore = word.match(/^[^a-zA-Z]*/)[0]
      const punctAfter  = word.match(/[^a-zA-Z]*$/)[0]
      const core = word.slice(punctBefore.length, word.length - punctAfter.length)

      // Always capitalise: first word, last word, after colon/dash, or not a minor word
      const isFirst = index === 0
      const isLast  = index === arr.length - 1
      const prevWord = arr[index - 1] || ''
      const afterColon = prevWord.match(/[:—–]$/)

      const shouldCapitalise = isFirst || isLast || afterColon || !MINOR_WORDS.has(clean)

      const result = shouldCapitalise
        ? core.charAt(0).toUpperCase() + core.slice(1).toLowerCase()
        : core.toLowerCase()

      return punctBefore + result + punctAfter
    })
    .join(' ')
}

export default function TitleCaseApa() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? toApaTitle(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Title Case (APA)</h1>
      <p className="tool-description">Apply APA 7th edition title case rules — capitalise major words, lowercase articles, prepositions, and short conjunctions.</p>

      <label htmlFor="apa-input">Input text</label>
      <textarea
        id="apa-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="the quick brown fox jumps over the lazy dog"
        style={{ minHeight: 100 }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>APA title case</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>{output}</div>
        </div>
      )}

      <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        Always capitalised: first word, last word, words after a colon. Always lowercase: articles (a, an, the), short prepositions, short conjunctions.
      </p>
    </div>
  )
}
