import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function Metronome() {
  const [bpm, setBpm] = useState(120)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(false)
  const [intervalId, setIntervalId] = useState(null)

  function start() {
    if (running) return
    const id = setInterval(() => {
      setBeat(true)
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.08)
      setTimeout(() => setBeat(false), 80)
    }, (60 / bpm) * 1000)
    setIntervalId(id)
    setRunning(true)
  }

  function stop() {
    clearInterval(intervalId)
    setRunning(false)
    setBeat(false)
  }

  function toggle() { running ? stop() : start() }

  // Restart with new BPM if running
  function handleBpm(v) {
    setBpm(v)
    if (running) { stop(); setTimeout(() => { setBpm(v); start() }, 50) }
  }

  const PRESETS = [40, 60, 80, 100, 120, 140, 160, 180, 200]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Metronome</h1>
      <p className="tool-description">
        A browser-based metronome with adjustable BPM. Uses the Web Audio API for precise click timing — no plugins needed.
      </p>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: beat ? 'var(--accent, #6366f1)' : 'var(--surface)',
          border: '3px solid var(--border)',
          transition: 'background 0.05s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
        }}>
          🎵
        </div>

        <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{bpm}</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>BPM</div>

        <input
          type="range" min={20} max={300} value={bpm}
          onChange={e => handleBpm(Number(e.target.value))}
          style={{ width: '100%', maxWidth: 320 }}
        />

        <div className="chip-group" style={{ justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p} className={`chip ${bpm === p ? 'active' : ''}`} onClick={() => handleBpm(p)}>{p}</button>
          ))}
        </div>

        <button
          className={`btn ${running ? 'btn-danger' : ''}`}
          style={{ marginTop: '1.5rem', minWidth: 120 }}
          onClick={toggle}
        >
          {running ? '⏹ Stop' : '▶ Start'}
        </button>
      </div>

      <RelatedTools category="misc" exclude="/tools/metronome" />
      <ToolSeo />
    </div>
  )
}
