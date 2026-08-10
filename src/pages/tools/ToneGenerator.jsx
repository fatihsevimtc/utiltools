import { useState, useRef, useCallback, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const PRESETS = [
  { name: 'A4 (440 Hz)', freq: 440 },
  { name: 'Middle C (261 Hz)', freq: 261.63 },
  { name: 'Low bass (60 Hz)', freq: 60 },
  { name: 'Speech (1 kHz)', freq: 1000 },
  { name: 'High (4 kHz)', freq: 4000 },
  { name: 'Ultrasonic test (15 kHz)', freq: 15000 },
]

const WAVEFORMS = ['sine', 'square', 'triangle', 'sawtooth']

export default function ToneGenerator() {
  const [freq, setFreq] = useState(440)
  const [freqInput, setFreqInput] = useState('440')
  const [volume, setVolume] = useState(50)
  const [waveform, setWaveform] = useState('sine')
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)

  const ctxRef = useRef(null)
  const oscRef = useRef(null)
  const gainRef = useRef(null)
  const timerRef = useRef(null)

  const startTone = useCallback(() => {
    if (playing) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = waveform
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume / 100, ctx.currentTime)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    ctxRef.current = ctx
    oscRef.current = osc
    gainRef.current = gain
    setPlaying(true)
    setDuration(0)
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
  }, [playing, waveform, freq, volume])

  const stopTone = useCallback(() => {
    if (!playing) return
    clearInterval(timerRef.current)
    try {
      const gain = gainRef.current
      const ctx = ctxRef.current
      if (gain && ctx) {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05)
      }
      setTimeout(() => {
        try { oscRef.current?.stop() } catch {}
        try { ctxRef.current?.close() } catch {}
      }, 100)
    } catch {}
    setPlaying(false)
    setDuration(0)
  }, [playing])

  // Update frequency live while playing
  useEffect(() => {
    if (playing && oscRef.current && ctxRef.current) {
      oscRef.current.frequency.setValueAtTime(freq, ctxRef.current.currentTime)
    }
  }, [freq, playing])

  // Update volume live while playing
  useEffect(() => {
    if (playing && gainRef.current && ctxRef.current) {
      gainRef.current.gain.setValueAtTime(volume / 100, ctxRef.current.currentTime)
    }
  }, [volume, playing])

  // Cleanup on unmount
  useEffect(() => () => stopTone(), [])

  function handleFreqInput(val) {
    setFreqInput(val)
    const n = parseFloat(val)
    if (!isNaN(n) && n > 0 && n <= 22000) setFreq(n)
  }

  function noteFromFreq(f) {
    const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
    const n = Math.round(12 * Math.log2(f / 440) + 69)
    return `${notes[n % 12]}${Math.floor(n / 12) - 1}`
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Tone Generator</h1>
      <p className="tool-description">
        Generate pure audio tones at any frequency using your browser's Web Audio API. Useful for hearing tests, instrument tuning, and audio experiments.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label>Presets</label>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.name} className="btn btn-ghost btn-sm" onClick={() => { setFreq(p.freq); setFreqInput(String(p.freq)) }}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="tg-freq">Frequency (Hz): <strong>{freq.toFixed(1)} Hz</strong> ≈ <em>{noteFromFreq(freq)}</em></label>
          <input
            id="tg-freq"
            type="range"
            min={20}
            max={20000}
            step={1}
            value={freq}
            onChange={e => { setFreq(+e.target.value); setFreqInput(String(e.target.value)) }}
          />
          <input
            type="number"
            min={20}
            max={20000}
            value={freqInput}
            onChange={e => handleFreqInput(e.target.value)}
            style={{ marginTop: '0.4rem', width: 120 }}
          />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="tg-vol">Volume: {volume}%</label>
          <input
            id="tg-vol"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={e => setVolume(+e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label>Waveform</label>
          <select value={waveform} onChange={e => { if (playing) { stopTone(); } setWaveform(e.target.value) }}>
            {WAVEFORMS.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn"
          onClick={playing ? stopTone : startTone}
          style={{ fontSize: '1.1rem', padding: '0.65rem 2.5rem', minWidth: 140 }}
        >
          {playing ? '⏹ Stop' : '▶ Play'}
        </button>
        {playing && (
          <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            Playing for {duration}s…
          </span>
        )}
      </div>

      <div style={{ marginTop: '1.25rem', padding: '0.9rem 1.1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--muted)' }}>
        ⚠️ Use headphones carefully. High frequencies and high volumes can cause discomfort or hearing damage. Keep the volume low when testing.
      </div>

      <RelatedTools tools={[
        { icon: '🔊', name: 'Text to Speech', path: '/tools/text-to-speech' },
        { icon: '⌨️', name: 'Typing Speed Test', path: '/tools/typing-speed' },
        { icon: '⏱️', name: 'Stopwatch', path: '/tools/stopwatch' },
        { icon: '🍅', name: 'Pomodoro Timer', path: '/tools/pomodoro' },
      ]} />
      <ToolSeo />
    </div>
  )
}
