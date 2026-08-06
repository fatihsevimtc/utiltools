import { useState } from 'react'
import BackBar from '../../components/BackBar'

function syllableCount(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return m ? m.length : 1
}

function analyse(text) {
  const sentences = text.trim().split(/[.!?]+/).filter(s => s.trim().length > 2)
  const words = text.trim().split(/\s+/).filter(w => w.replace(/[^a-z]/gi,'').length > 0)
  if (!sentences.length || !words.length) return null

  const totalSyllables = words.reduce((s, w) => s + syllableCount(w), 0)
  const avgSentLen = words.length / sentences.length
  const avgSyllables = totalSyllables / words.length

  // Flesch Reading Ease
  const ease = 206.835 - (1.015 * avgSentLen) - (84.6 * avgSyllables)
  const easeScore = Math.max(0, Math.min(100, ease))

  // Flesch-Kincaid Grade Level
  const grade = (0.39 * avgSentLen) + (11.8 * avgSyllables) - 15.59

  // Long sentences (>25 words)
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 25).length

  // Complex words (3+ syllables)
  const complexWords = words.filter(w => syllableCount(w) >= 3).length

  return {
    easeScore: easeScore.toFixed(1),
    grade: Math.max(0, grade).toFixed(1),
    words: words.length,
    sentences: sentences.length,
    avgSentLen: avgSentLen.toFixed(1),
    complexWords,
    longSentences,
  }
}

function easeLabel(score) {
  if (score >= 90) return { label: 'Very Easy', color: 'var(--success)' }
  if (score >= 70) return { label: 'Easy', color: 'var(--success)' }
  if (score >= 60) return { label: 'Standard', color: 'var(--warning)' }
  if (score >= 50) return { label: 'Fairly Difficult', color: 'var(--warning)' }
  if (score >= 30) return { label: 'Difficult', color: 'var(--danger)' }
  return { label: 'Very Difficult', color: 'var(--danger)' }
}

function gradeLabel(g) {
  const n = parseFloat(g)
  if (n <= 6)  return '5th–6th grade (very accessible)'
  if (n <= 8)  return '7th–8th grade (easy)'
  if (n <= 10) return '9th–10th grade (standard)'
  if (n <= 12) return '11th–12th grade (fairly hard)'
  if (n <= 16) return 'College level (difficult)'
  return 'Graduate level (very difficult)'
}

export default function ReadabilityScore() {
  const [text, setText] = useState('')
  const r = text.trim() ? analyse(text) : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Readability Score</h1>
      <p className="tool-description">Analyse text complexity with Flesch Reading Ease and Flesch-Kincaid Grade Level scores.</p>

      <label htmlFor="rs-input">Paste your text</label>
      <textarea id="rs-input" value={text} onChange={e => setText(e.target.value)}
        placeholder="Paste an article, blog post, or any text to score its readability…"
        style={{ minHeight: 200 }} />

      {r && (
        <>
          <div className="stats-row" style={{ marginTop: '1.25rem' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ color: easeLabel(r.easeScore).color }}>{r.easeScore}</div>
              <div className="stat-label">Flesch Reading Ease</div>
              <div style={{ fontSize: '0.75rem', color: easeLabel(r.easeScore).color, marginTop: '0.2rem' }}>{easeLabel(r.easeScore).label}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{r.grade}</div>
              <div className="stat-label">FK Grade Level</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{gradeLabel(r.grade)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{r.words}</div>
              <div className="stat-label">Words</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{r.sentences}</div>
              <div className="stat-label">Sentences</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{r.avgSentLen}</div>
              <div className="stat-label">Avg sentence length</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: r.complexWords > r.words * 0.2 ? 'var(--warning)' : 'var(--text)' }}>{r.complexWords}</div>
              <div className="stat-label">Complex words (3+ syl.)</div>
            </div>
          </div>

          {r.longSentences > 0 && (
            <div className="notice notice-warning" style={{ marginTop: '1rem' }}>
              ⚠️ {r.longSentences} sentence{r.longSentences > 1 ? 's are' : ' is'} over 25 words — consider breaking them up.
            </div>
          )}

          <details style={{ marginTop: '1rem' }}>
            <summary>What do these scores mean?</summary>
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              <p><strong>Flesch Reading Ease</strong> — Higher is easier. 90–100: very easy (5th grade). 60–70: standard (8th–9th grade). Below 30: very difficult (college graduate).</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Flesch-Kincaid Grade Level</strong> — US school grade required to understand the text. Grade 8 is considered ideal for general web content.</p>
            </div>
          </details>
        </>
      )}
    </div>
  )
}
