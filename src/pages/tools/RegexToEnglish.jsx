import { useState } from 'react'
import BackBar from '../../components/BackBar'

function regexToEnglish(pattern) {
  const parts = []
  let i = 0
  while (i < pattern.length) {
    const ch = pattern[i]
    if (ch === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1]
      if (next === 'd') parts.push('a digit (0-9)')
      else if (next === 'D') parts.push('a non-digit')
      else if (next === 'w') parts.push('a word character (a-z, A-Z, 0-9, _)')
      else if (next === 'W') parts.push('a non-word character')
      else if (next === 's') parts.push('whitespace')
      else if (next === 'S') parts.push('non-whitespace')
      else if (next === 'n') parts.push('newline')
      else if (next === 't') parts.push('tab')
      else if (next === 'b') parts.push('word boundary')
      else parts.push(`literal "${next}"`)
      i += 2
    } else if (ch === '^') {
      parts.push('starts with')
      i++
    } else if (ch === '$') {
      parts.push('ends with')
      i++
    } else if (ch === '.') {
      parts.push('any character')
      i++
    } else if (ch === '+') {
      if (parts.length) parts.push('one or more of the previous')
      i++
    } else if (ch === '*') {
      if (parts.length) parts.push('zero or more of the previous')
      i++
    } else if (ch === '?') {
      if (parts.length) parts.push('zero or one of the previous')
      i++
    } else if (ch === '|') {
      parts.push('or')
      i++
    } else if (ch === '{') {
      const end = pattern.indexOf('}', i)
      if (end !== -1) {
        const qty = pattern.slice(i + 1, end)
        parts.push(`between ${qty.replace(',', ' and ')} of the previous`)
        i = end + 1
      } else { parts.push(ch); i++ }
    } else if (ch === '[') {
      const end = pattern.indexOf(']', i)
      if (end !== -1) {
        parts.push(`one character from: ${pattern.slice(i + 1, end)}`)
        i = end + 1
      } else { parts.push(ch); i++ }
    } else if (ch === '(') {
      const end = pattern.indexOf(')', i)
      if (end !== -1) {
        parts.push(`capture group: (${pattern.slice(i + 1, end)})`)
        i = end + 1
      } else { parts.push(ch); i++ }
    } else {
      parts.push(`literal "${ch}"`)
      i++
    }
  }
  return parts.join(', ')
}

export default function RegexToEnglish() {
  const [pattern, setPattern] = useState('')

  const description = pattern ? regexToEnglish(pattern) : ''

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Regex to English</h1>
      <p className="tool-description">Convert regular expressions to plain-English descriptions.</p>

      <label htmlFor="regex-input">Regular expression</label>
      <input
        id="regex-input"
        type="text"
        value={pattern}
        onChange={e => setPattern(e.target.value)}
        placeholder="^\d{3}-\w+"
        style={{ fontFamily: 'monospace', fontSize: '1rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box' }}
      />

      {description && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>Plain English</label>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{description}</div>
        </div>
      )}
    </div>
  )
}
