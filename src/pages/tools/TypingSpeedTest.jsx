import { useState, useEffect, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

const TEXTS = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
  "Programming is the art of telling another human what one wants the computer to do. Any sufficiently advanced technology is indistinguishable from magic.",
  "The only way to learn a new programming language is by writing programs in it. Talk is cheap. Show me the code.",
  "First, solve the problem. Then, write the code. Simplicity is the soul of efficiency. Clean code always looks like it was written by someone who cares.",
  "In the middle of difficulty lies opportunity. Success is not final, failure is not fatal — it is the courage to continue that counts.",
]

export default function TypingSpeedTest() {
  const [textIdx, setTextIdx]   = useState(0)
  const [typed, setTyped]       = useState('')
  const [started, setStarted]   = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed]   = useState(0)
  const intervalRef = useRef(null)
  const inputRef    = useRef(null)

  const target = TEXTS[textIdx]

  useEffect(() => {
    if (started && !finished) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime)
      }, 100)
    }
    return () => clearInterval(intervalRef.current)
  }, [started, finished, startTime])

  function handleInput(e) {
    const val = e.target.value
    if (!started) { setStarted(true); setStartTime(Date.now()) }
    setTyped(val)
    if (val === target) {
      setFinished(true)
      clearInterval(intervalRef.current)
      setElapsed(Date.now() - startTime)
    }
  }

  function reset(newIdx) {
    clearInterval(intervalRef.current)
    setTyped(''); setStarted(false); setFinished(false)
    setStartTime(null); setElapsed(0)
    setTextIdx(newIdx ?? textIdx)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const words     = target.trim().split(/\s+/).length
  const minutes   = elapsed / 60000 || 0.001
  const wpm       = finished ? Math.round(words / (elapsed / 60000)) : started ? Math.round(words / minutes) : 0
  const progress  = typed.length / target.length

  // Count correct chars
  let correct = 0, errors = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++; else errors++
  }
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Typing Speed Test</h1>
      <p className="tool-description">Test your typing speed in WPM (words per minute) with accuracy tracking.</p>

      <div className="chip-group">
        {TEXTS.map((_, i) => (
          <button key={i} className={`chip ${textIdx === i ? 'active' : ''}`} onClick={() => reset(i)}>Text {i+1}</button>
        ))}
        <button className="chip" onClick={() => reset((textIdx + 1) % TEXTS.length)}>🔀 Random</button>
      </div>

      {/* Display text with per-character feedback */}
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem', fontSize: '1.05rem', lineHeight: 1.8, letterSpacing: '0.01em', userSelect: 'none' }}>
        {target.split('').map((ch, i) => {
          let color = 'var(--muted)'
          if (i < typed.length) color = typed[i] === ch ? 'var(--success)' : 'var(--danger)'
          const isCursor = i === typed.length
          return (
            <span key={i} style={{ color, borderBottom: isCursor ? '2px solid var(--accent)' : 'none' }}>
              {ch === ' ' && typed[i] !== undefined && typed[i] !== ' '
                ? <span style={{ background: 'var(--danger)', borderRadius: 2 }}>&nbsp;</span>
                : ch}
            </span>
          )
        })}
      </div>

      <textarea ref={inputRef} value={typed} onChange={handleInput}
        disabled={finished}
        placeholder={finished ? '' : 'Start typing here…'}
        style={{ minHeight: 80, marginBottom: '1rem', resize: 'none' }}
        onPaste={e => e.preventDefault()}
      />

      {/* Progress bar */}
      <div className="strength-bar">
        <div className="strength-fill" style={{ width: `${Math.round(progress * 100)}%`, background: finished ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      <div className="stats-row" style={{ marginTop: '1rem' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{wpm}</div>
          <div className="stat-label">WPM {!finished && started ? '(live)' : ''}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: accuracy < 90 ? 'var(--warning)' : 'var(--success)' }}>{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: errors > 0 ? 'var(--danger)' : 'var(--text)' }}>{errors}</div>
          <div className="stat-label">Errors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{finished ? (elapsed/1000).toFixed(1) : (elapsed/1000).toFixed(1)}</div>
          <div className="stat-label">Seconds</div>
        </div>
      </div>

      {finished && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            🎉 Finished! {wpm} WPM · {accuracy}% accuracy
          </p>
          <button className="btn" onClick={() => reset()}>Try again</button>
        </div>
      )}
          <ToolSeo />
    </div>
  )
}
