import { useState, useEffect, useRef } from 'react'
import BackBar from '../../components/BackBar'

const MODES = [
  { id: 'work',       label: 'Work',        default: 25, color: '#ef4444' },
  { id: 'short',      label: 'Short break', default: 5,  color: '#10b981' },
  { id: 'long',       label: 'Long break',  default: 15, color: '#3b82f6' },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function PomodoroTimer() {
  const [mode, setMode]         = useState('work')
  const [durations, setDurations] = useState({ work: 25, short: 5, long: 15 })
  const [secondsLeft, setLeft]  = useState(25 * 60)
  const [running, setRunning]   = useState(false)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef()

  const currentMode = MODES.find(m => m.id === mode)
  const totalSeconds = durations[mode] * 60
  const progress = 1 - secondsLeft / totalSeconds

  useEffect(() => {
    setLeft(durations[mode] * 60)
    setRunning(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (mode === 'work') setCompleted(c => c + 1)
            // Beep
            try {
              const ctx = new AudioContext()
              const osc = ctx.createOscillator()
              osc.connect(ctx.destination)
              osc.frequency.value = 880
              osc.start()
              osc.stop(ctx.currentTime + 0.4)
            } catch {}
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function toggle() { setRunning(r => !r) }
  function reset() { setRunning(false); setLeft(durations[mode] * 60) }

  function setDuration(modeId, val) {
    const n = Math.max(1, Math.min(120, val))
    setDurations(d => ({ ...d, [modeId]: n }))
    if (modeId === mode) setLeft(n * 60)
  }

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  const circumference = 2 * Math.PI * 54
  const strokeDash = circumference * (1 - progress)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Pomodoro Timer</h1>
      <p className="tool-description">Work in focused bursts with the Pomodoro technique.</p>

      <div className="chip-group">
        {MODES.map(m => (
          <button key={m.id} className={`chip ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)} style={mode === m.id ? { background: m.color } : {}}>{m.label}</button>
        ))}
      </div>

      {/* Circle timer */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
        <svg width={130} height={130} viewBox="0 0 120 120">
          <circle cx={60} cy={60} r={54} fill="none" stroke="var(--border)" strokeWidth={8} />
          <circle
            cx={60} cy={60} r={54} fill="none"
            stroke={currentMode.color} strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeDash}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
          <text x={60} y={55} textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={800} fill="var(--text)" fontFamily="monospace">
            {pad(mins)}:{pad(secs)}
          </text>
          <text x={60} y={76} textAnchor="middle" fontSize={10} fill="var(--muted)" fontFamily="sans-serif">
            {currentMode.label}
          </text>
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn" onClick={toggle} style={{ minWidth: 90, background: currentMode.color, color: '#fff', border: 'none' }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn btn-sm" onClick={reset}>↺ Reset</button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
        🍅 {completed} pomodoro{completed !== 1 ? 's' : ''} completed
      </div>

      <details>
        <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}>Customize durations</summary>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {MODES.map(m => (
            <div key={m.id} style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: '0.82rem' }}>{m.label} (min)</label>
              <input type="number" min={1} max={120} value={durations[m.id]} onChange={e => setDuration(m.id, Number(e.target.value))} />
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
