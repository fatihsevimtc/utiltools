import { useState, useEffect, useRef } from 'react'
import BackBar from '../../components/BackBar'

function pad(n, len = 2) { return String(n).padStart(len, '0') }

function fmt(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  const c = Math.floor(ms / 10) % 100
  return `${h ? pad(h) + ':' : ''}${pad(m)}:${pad(s)}.${pad(c)}`
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startRef = useRef(null)
  const baseRef  = useRef(0)
  const rafRef   = useRef()

  useEffect(() => {
    if (running) {
      startRef.current = Date.now()
      function tick() {
        setElapsed(baseRef.current + Date.now() - startRef.current)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
      baseRef.current = elapsed
    }
    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  function toggle() { setRunning(r => !r) }

  function reset() {
    setRunning(false)
    setElapsed(0)
    baseRef.current = 0
    setLaps([])
  }

  function lap() {
    setLaps(l => [{ time: elapsed, split: elapsed - (l[0]?.time ?? 0) }, ...l])
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Stopwatch</h1>
      <p className="tool-description">A precise stopwatch with lap tracking.</p>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{ fontSize: '4rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em', color: running ? 'var(--accent)' : 'var(--text)' }}>
          {fmt(elapsed)}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={toggle} style={{ minWidth: 100, background: running ? 'var(--danger)' : 'var(--accent)', color: '#fff', border: 'none' }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        {running && (
          <button className="btn btn-sm" onClick={lap}>🏁 Lap</button>
        )}
        {!running && elapsed > 0 && (
          <button className="btn btn-sm" onClick={reset}>↺ Reset</button>
        )}
      </div>

      {laps.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <label>Laps</label>
          <div className="code-block" style={{ whiteSpace: 'pre', fontSize: '0.85rem', maxHeight: 280, overflow: 'auto' }}>
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.25rem', color: 'var(--muted)' }}>
              <span style={{ minWidth: 40 }}>Lap</span>
              <span style={{ minWidth: 120 }}>Time</span>
              <span>Split</span>
            </div>
            {laps.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.15rem 0' }}>
                <span style={{ minWidth: 40, color: 'var(--muted)' }}>#{laps.length - i}</span>
                <span style={{ minWidth: 120 }}>{fmt(l.time)}</span>
                <span style={{ color: 'var(--muted)' }}>+{fmt(l.split)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
