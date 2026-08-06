import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

function normalize(s) {
  return s.toLowerCase().replace(/\s/g, '').split('').sort().join('')
}

function letterFreq(s) {
  const f = {}
  for (const c of s.toLowerCase().replace(/\s/g, '')) {
    f[c] = (f[c] || 0) + 1
  }
  return f
}

export default function AnagramChecker() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const isAnagram = a.trim() && b.trim() ? normalize(a) === normalize(b) : null
  const freqA = letterFreq(a)
  const freqB = letterFreq(b)
  const allLetters = [...new Set([...Object.keys(freqA), ...Object.keys(freqB)])].sort()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Anagram Checker</h1>
      <p className="tool-description">Check whether two words or phrases are anagrams of each other.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="ana-a">First word / phrase</label>
          <input id="ana-a" type="text" value={a} onChange={e => setA(e.target.value)} placeholder="listen" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="ana-b">Second word / phrase</label>
          <input id="ana-b" type="text" value={b} onChange={e => setB(e.target.value)} placeholder="silent" />
        </div>
      </div>

      {isAnagram !== null && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem', background: 'var(--surface)', borderRadius: 12, border: '2px solid', borderColor: isAnagram ? 'var(--success)' : 'var(--danger)' }}>
          <div style={{ fontSize: '2.5rem' }}>{isAnagram ? '🔤' : '❌'}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem', color: isAnagram ? 'var(--success)' : 'var(--danger)' }}>
            {isAnagram ? 'These are anagrams!' : 'Not anagrams'}
          </div>
        </div>
      )}

      {(a.trim() || b.trim()) && allLetters.length > 0 && (
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <label>Letter frequency comparison</label>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem', borderBottom: '1px solid var(--border)' }}>Letter</th>
                <th style={{ textAlign: 'right', padding: '0.3rem 0.5rem', borderBottom: '1px solid var(--border)' }}>"{a || '…'}"</th>
                <th style={{ textAlign: 'right', padding: '0.3rem 0.5rem', borderBottom: '1px solid var(--border)' }}>"{b || '…'}"</th>
                <th style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid var(--border)' }}>Match?</th>
              </tr>
            </thead>
            <tbody>
              {allLetters.map(l => {
                const ca = freqA[l] || 0
                const cb = freqB[l] || 0
                const match = ca === cb
                return (
                  <tr key={l} style={{ background: match ? 'transparent' : 'rgba(220,53,69,0.06)' }}>
                    <td style={{ padding: '0.25rem 0.5rem', fontWeight: 700 }}>{l}</td>
                    <td style={{ textAlign: 'right', padding: '0.25rem 0.5rem' }}>{ca}</td>
                    <td style={{ textAlign: 'right', padding: '0.25rem 0.5rem' }}>{cb}</td>
                    <td style={{ padding: '0.25rem 0.5rem', color: match ? 'var(--success)' : 'var(--danger)' }}>{match ? '✓' : '✗'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <RelatedTools category="text" exclude="/tools/anagram" />
    </div>
  )
}
