import { useState } from 'react'
import BackBar from '../../components/BackBar'

function isPalindrome(text, ignoreCase, ignoreSpaces, ignoreSpecial) {
  let s = text
  if (ignoreCase) s = s.toLowerCase()
  if (ignoreSpecial) s = s.replace(/[^a-z0-9]/gi, '')
  else if (ignoreSpaces) s = s.replace(/\s/g, '')
  return s === s.split('').reverse().join('')
}

function longestPalindrome(s) {
  let start = 0, maxLen = 1
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++ }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1 }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1) }
  return s.slice(start, start + maxLen)
}

export default function PalindromeChecker() {
  const [input, setInput] = useState('')
  const [ignoreCase, setIgnoreCase] = useState(true)
  const [ignoreSpaces, setIgnoreSpaces] = useState(true)
  const [ignoreSpecial, setIgnoreSpecial] = useState(false)

  const result = input.trim() ? isPalindrome(input.trim(), ignoreCase, ignoreSpaces, ignoreSpecial) : null
  const longest = input.trim().length > 1 ? longestPalindrome(ignoreCase ? input.toLowerCase() : input) : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Palindrome Checker</h1>
      <p className="tool-description">Check if a word or phrase reads the same forwards and backwards.</p>

      <label htmlFor="pal-input">Input text</label>
      <input
        id="pal-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="racecar"
      />

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {[
          ['Ignore case', ignoreCase, setIgnoreCase],
          ['Ignore spaces', ignoreSpaces, setIgnoreSpaces],
          ['Ignore special characters', ignoreSpecial, setIgnoreSpecial],
        ].map(([label, val, set]) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', marginBottom: 0 }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
            {label}
          </label>
        ))}
      </div>

      {result !== null && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem', background: 'var(--surface)', borderRadius: 12, border: '2px solid', borderColor: result ? 'var(--success)' : 'var(--danger)' }}>
          <div style={{ fontSize: '2.5rem' }}>{result ? '✅' : '❌'}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem', color: result ? 'var(--success)' : 'var(--danger)' }}>
            {result ? 'Yes, it\'s a palindrome!' : 'Not a palindrome'}
          </div>
        </div>
      )}

      {longest && input.trim().length > 2 && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>Longest palindromic substring</label>
          <div className="code-block">{longest}</div>
        </div>
      )}
    </div>
  )
}
