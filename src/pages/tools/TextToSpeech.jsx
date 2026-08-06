import { useState, useEffect, useRef } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const IDLE     = 'idle'
const SPEAKING = 'speaking'
const PAUSED   = 'paused'

export default function TextToSpeech() {
  const [text, setText]         = useState('')
  const [voices, setVoices]     = useState([])
  const [voiceURI, setVoiceURI] = useState('')
  const [rate, setRate]         = useState(1)
  const [pitch, setPitch]       = useState(1)
  const [volume, setVolume]     = useState(1)
  const [status, setStatus]     = useState(IDLE)
  const utteranceRef            = useRef(null)

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!supported) return
    function loadVoices() {
      const list = window.speechSynthesis.getVoices()
      if (list.length > 0) {
        setVoices(list)
        const defaultVoice = list.find(v => v.lang.startsWith('en')) || list[0]
        setVoiceURI(prev => prev || defaultVoice.voiceURI)
      }
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [supported])

  useEffect(() => {
    return () => { if (supported) window.speechSynthesis.cancel() }
  }, [supported])

  function handlePlay() {
    if (!supported || !text.trim()) return
    if (status === PAUSED) {
      window.speechSynthesis.resume()
      setStatus(SPEAKING)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate   = rate
    utterance.pitch  = pitch
    utterance.volume = volume
    const selectedVoice = voices.find(v => v.voiceURI === voiceURI)
    if (selectedVoice) utterance.voice = selectedVoice
    utterance.onstart = () => setStatus(SPEAKING)
    utterance.onend   = () => setStatus(IDLE)
    utterance.onerror = () => setStatus(IDLE)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setStatus(SPEAKING)
  }

  function handlePause() {
    if (!supported) return
    window.speechSynthesis.pause()
    setStatus(PAUSED)
  }

  function handleStop() {
    if (!supported) return
    window.speechSynthesis.cancel()
    setStatus(IDLE)
  }

  if (!supported) {
    return (
      <div className="tool-page">
        <BackBar />
        <h1>Text to Speech</h1>
        <div className="notice notice-warning" style={{ marginTop: '1rem' }}>
          Your browser does not support the Web Speech API. Try Chrome, Edge, or Safari.
        </div>
        <RelatedTools category="text" exclude="/tools/text-to-speech" />
        <ToolSeo />
      </div>
    )
  }

  const canPlay  = text.trim().length > 0
  const isActive = status === SPEAKING
  const isPaused = status === PAUSED

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text to Speech</h1>
      <p className="tool-description">
        Convert text to speech instantly using your browser's built-in synthesis engine.
      </p>

      <label htmlFor="tts-input">Text</label>
      <textarea
        id="tts-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text here…"
        style={{ minHeight: 180 }}
      />
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.35rem', marginBottom: '1.5rem' }}>
        {text.length} character{text.length !== 1 ? 's' : ''}
      </p>

      {voices.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="tts-voice">Voice</label>
          <select
            id="tts-voice"
            value={voiceURI}
            onChange={e => setVoiceURI(e.target.value)}
            disabled={isActive || isPaused}
          >
            {voices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <SliderField id="tts-rate"   label="Speed"  min={0.5} max={2} step={0.1} value={rate}   onChange={setRate}   disabled={isActive || isPaused} />
        <SliderField id="tts-pitch"  label="Pitch"  min={0.5} max={2} step={0.1} value={pitch}  onChange={setPitch}  disabled={isActive || isPaused} />
        <SliderField id="tts-volume" label="Volume" min={0}   max={1} step={0.1} value={volume} onChange={setVolume} disabled={isActive || isPaused} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className="btn"
          onClick={handlePlay}
          disabled={!canPlay}
          style={isActive ? { background: 'var(--success)', boxShadow: '0 0 0 3px rgba(46,204,113,0.25)' } : undefined}
          aria-label={isPaused ? 'Resume' : 'Play'}
        >
          {isPaused ? '▶ Resume' : isActive ? '▶ Speaking…' : '▶ Play'}
        </button>

        <button
          className="btn btn-ghost"
          onClick={handlePause}
          disabled={!isActive}
          style={isPaused ? { background: 'var(--accent)', color: '#fff' } : undefined}
          aria-label="Pause"
        >
          ⏸ Pause
        </button>

        <button
          className="btn btn-ghost"
          onClick={handleStop}
          disabled={status === IDLE}
          aria-label="Stop"
        >
          ⏹ Stop
        </button>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>🔒</span>
        All processing happens in your browser — text never leaves your device.
      </p>

      <RelatedTools category="text" exclude="/tools/text-to-speech" />
      <ToolSeo />
    </div>
  )
}

function SliderField({ id, label, min, max, step, value, onChange, disabled }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label htmlFor={id} style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, fontFamily: 'monospace' }}>
          {value.toFixed(1)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        disabled={disabled}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
