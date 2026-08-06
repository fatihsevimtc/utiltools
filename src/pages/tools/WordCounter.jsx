import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}
function countSentences(text) {
  return text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
}
function readingTime(words) {
  const mins = Math.ceil(words / 200)
  return mins < 1 ? '< 1 min' : `${mins} min${mins > 1 ? 's' : ''}`
}

export default function WordCounter() {
  const [text, setText] = useState('')

  const words = countWords(text)
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = countSentences(text)
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n+/).length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Word Counter</h1>
      <p className="tool-description">
        Paste or type your text below. Counts update in real time — no uploads, no tracking.
      </p>

      <label htmlFor="wc-input">Your text</label>
      <textarea
        id="wc-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Start typing or paste your text here…"
        style={{ minHeight: 220 }}
      />

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{words.toLocaleString()}</div>
          <div className="stat-label">Words</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{chars.toLocaleString()}</div>
          <div className="stat-label">Characters</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{charsNoSpaces.toLocaleString()}</div>
          <div className="stat-label">Chars (no spaces)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sentences}</div>
          <div className="stat-label">Sentences</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{paragraphs}</div>
          <div className="stat-label">Paragraphs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{readingTime(words)}</div>
          <div className="stat-label">Reading time</div>
        </div>
      </div>

      {text && (
        <button className="btn btn-ghost btn-sm" onClick={() => setText('')}>
          Clear
        </button>
      )}
          <ToolSeo />
    </div>
  )
}
