import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

const STOP_WORDS = new Set(['a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','it','its','this','that','these','those','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their'])

export default function TextToHashtags() {
  const [input, setInput] = useState('')
  const [removeStop, setRemoveStop] = useState(true)
  const [maxTags, setMaxTags] = useState(15)
  const [copied, setCopied] = useState(false)

  const hashtags = useMemo(() => {
    const words = input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .filter(w => !removeStop || !STOP_WORDS.has(w))

    // Deduplicate preserving order
    const seen = new Set()
    return words
      .filter(w => { if (seen.has(w)) return false; seen.add(w); return true })
      .slice(0, maxTags)
      .map(w => '#' + w)
  }, [input, removeStop, maxTags])

  function copy() {
    navigator.clipboard.writeText(hashtags.join(' ')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text to Hashtags</h1>
      <p className="tool-description">Generate hashtags from any text, ready to paste into social media.</p>

      <label htmlFor="tth-input">Input text</label>
      <textarea
        id="tth-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your blog post, caption, or any text here…"
        style={{ minHeight: 140 }}
      />

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text)', marginBottom: 0 }}>
          <input type="checkbox" checked={removeStop} onChange={e => setRemoveStop(e.target.checked)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
          Remove stop words
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)', marginBottom: 0 }}>
          Max tags:
          <select value={maxTags} onChange={e => setMaxTags(Number(e.target.value))} style={{ width: 'auto', padding: '0.2rem 0.5rem' }}>
            {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {hashtags.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>{hashtags.length} hashtag{hashtags.length !== 1 ? 's' : ''}</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {hashtags.map(tag => (
              <span key={tag} style={{ background: 'var(--accent)', color: '#fff', borderRadius: 20, padding: '0.25rem 0.7rem', fontSize: '0.88rem', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
