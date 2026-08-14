import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function Dictionary() {
  const [word, setWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function lookupWord() {
    if (!word.trim()) {
      setError('Please enter a word to look up')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Try direct API call first, with CORS proxy as fallback
      let response
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
      
      try {
        response = await fetch(apiUrl)
      } catch (corsError) {
        // If CORS fails (common in dev), try with a CORS proxy
        console.log('Direct API failed, trying CORS proxy...')
        response = await fetch(`https://corsproxy.io/?${encodeURIComponent(apiUrl)}`)
      }

      if (!response.ok) {
        if (response.status === 404) {
          setError('Word not found. Please check the spelling and try again.')
        } else {
          setError('Failed to fetch definition. Please try again.')
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      setResult(data[0])
    } catch (err) {
      console.error('Dictionary lookup error:', err)
      setError('An error occurred. The dictionary service may be temporarily unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  function playAudio(audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  function reset() {
    setWord('')
    setResult(null)
    setError('')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Dictionary</h1>
      <p className="tool-description">
        Look up word definitions, pronunciations, and usage examples — powered by a free dictionary API.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="dict-word">Enter a word</label>
        <input
          id="dict-word"
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookupWord()}
          placeholder="e.g., serendipity"
          style={{ marginBottom: '0.5rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className="btn"
          onClick={lookupWord}
          disabled={loading}
        >
          {loading ? '🔄 Looking up…' : '🔍 Look Up'}
        </button>
        {result && (
          <button className="btn btn-ghost" onClick={reset}>
            ↻ Reset
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgb(248, 113, 113)',
          borderRadius: 8,
          color: 'rgb(248, 113, 113)',
          marginBottom: '1rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{result.word}</h2>
            {result.phonetic && (
              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                {result.phonetic}
              </p>
            )}
            {result.phonetics && result.phonetics.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {result.phonetics
                  .filter(p => p.audio)
                  .map((p, idx) => (
                    <button
                      key={idx}
                      className="btn"
                      onClick={() => playAudio(p.audio)}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                    >
                      🔊 Play pronunciation
                    </button>
                  ))}
              </div>
            )}
          </div>

          {result.meanings && result.meanings.map((meaning, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: 'var(--primary)',
                marginBottom: '0.75rem',
                fontStyle: 'italic',
              }}>
                {meaning.partOfSpeech}
              </h3>

              {meaning.definitions && meaning.definitions.map((def, defIdx) => (
                <div key={defIdx} style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>{defIdx + 1}.</strong> {def.definition}
                  </p>
                  {def.example && (
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--muted)',
                      fontStyle: 'italic',
                      paddingLeft: '1.5rem',
                    }}>
                      Example: "{def.example}"
                    </p>
                  )}
                  {def.synonyms && def.synonyms.length > 0 && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
                      Synonyms: {def.synonyms.slice(0, 5).join(', ')}
                    </p>
                  )}
                  {def.antonyms && def.antonyms.length > 0 && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
                      Antonyms: {def.antonyms.slice(0, 5).join(', ')}
                    </p>
                  )}
                </div>
              ))}

              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <strong>Synonyms:</strong> {meaning.synonyms.slice(0, 10).join(', ')}
                  </p>
                </div>
              )}

              {meaning.antonyms && meaning.antonyms.length > 0 && (
                <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <strong>Antonyms:</strong> {meaning.antonyms.slice(0, 10).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}

          {result.origin && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--bg)',
              borderRadius: 8,
            }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Origin</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                {result.origin}
              </p>
            </div>
          )}

          {result.sourceUrls && result.sourceUrls.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                Source: <a href={result.sourceUrls[0]} target="_blank" rel="noopener noreferrer">
                  {result.sourceUrls[0]}
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 8 }}>
        <h3>About this tool:</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          This dictionary uses the free Dictionary API. It provides definitions, pronunciations, 
          examples, synonyms, and antonyms for English words.
        </p>
      </div>

      <RelatedTools
        tools={[
          { icon: '📚', name: 'Vocabulary Builder', path: '/tools/vocabulary-builder' },
          { icon: '📊', name: 'Word Frequency', path: '/tools/word-frequency' },
          { icon: '📝', name: 'Word Counter', path: '/tools/word-counter' },
          { icon: '🔀', name: 'Anagram Checker', path: '/tools/anagram' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
