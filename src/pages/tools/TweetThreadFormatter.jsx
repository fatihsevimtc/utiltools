import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

const LIMIT = 280

function splitIntoTweets(text, limit) {
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
  const tweets = []

  for (const para of paragraphs) {
    if (para.length <= limit) {
      tweets.push(para)
    } else {
      // Split long paragraph at sentence boundaries
      const sentences = para.split(/(?<=[.!?])\s+/)
      let current = ''
      for (const sentence of sentences) {
        if (!current) {
          current = sentence
        } else if ((current + ' ' + sentence).length <= limit) {
          current += ' ' + sentence
        } else {
          if (current) tweets.push(current)
          current = sentence
        }
      }
      if (current) tweets.push(current)
    }
  }
  return tweets
}

export default function TweetThreadFormatter() {
  const [text, setText]       = useState('')
  const [numbered, setNumbered] = useState(true)
  const [copied, setCopied]   = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const tweets = useMemo(() => {
    if (!text.trim()) return []
    const raw = splitIntoTweets(text, numbered ? LIMIT - 8 : LIMIT)
    return raw.map((t, i) => numbered && raw.length > 1 ? `${t}\n\n${i+1}/${raw.length}` : t)
  }, [text, numbered])

  function copy(i) {
    navigator.clipboard.writeText(tweets[i]).then(() => {
      setCopied(i); setTimeout(() => setCopied(null), 1200)
    })
  }

  function copyAll() {
    navigator.clipboard.writeText(tweets.join('\n\n---\n\n')).then(() => {
      setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Tweet / Thread Formatter</h1>
      <p className="tool-description">Paste long text and split it into a Twitter/X thread. Each tweet stays under 280 characters.</p>

      <label htmlFor="tt-input">Your text</label>
      <textarea id="tt-input" value={text} onChange={e => setText(e.target.value)}
        placeholder="Paste your text here. Separate paragraphs with a blank line for natural tweet splits…"
        style={{ minHeight: 160 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: 0 }}>
          <input type="checkbox" checked={numbered} onChange={e => setNumbered(e.target.checked)} />
          Add tweet numbers (1/5, 2/5…)
        </label>
        {tweets.length > 0 && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={copyAll}>
            {copiedAll ? '✓ Copied all' : 'Copy all tweets'}
          </button>
        )}
      </div>

      {tweets.length > 0 && (
        <>
          <div className="stats-row" style={{ marginBottom: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value">{tweets.length}</div>
              <div className="stat-label">Tweets</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{text.trim().split(/\s+/).filter(Boolean).length}</div>
              <div className="stat-label">Total words</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {tweets.map((t, i) => {
              const over = t.length > LIMIT
              return (
                <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${over ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>Tweet {i + 1}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: over ? 'var(--danger)' : 'var(--muted)' }}>
                        {t.length}/{LIMIT}
                      </span>
                      <button className="btn btn-sm" onClick={() => copy(i)}>
                        {copied === i ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', margin: 0 }}>{t}</p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
