import { useState, useRef, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const NOTES = [
  { name: 'C', freq: 261.63 },
  { name: 'C#', freq: 277.18 },
  { name: 'D', freq: 293.66 },
  { name: 'D#', freq: 311.13 },
  { name: 'E', freq: 329.63 },
  { name: 'F', freq: 349.23 },
  { name: 'F#', freq: 369.99 },
  { name: 'G', freq: 392.00 },
  { name: 'G#', freq: 415.30 },
  { name: 'A', freq: 440.00 },
  { name: 'A#', freq: 466.16 },
  { name: 'B', freq: 493.88 },
]

export default function InstrumentTuner() {
  const [detectedFreq, setDetectedFreq] = useState(null)
  const [detectedNote, setDetectedNote] = useState(null)
  const [cents, setCents] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationIdRef = useRef(null)

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 8192
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = { audioContext, stream }
      analyserRef.current = analyser
      setIsListening(true)

      detectPitch()
    } catch (err) {
      alert('Microphone access denied: ' + err.message)
    }
  }

  function stopListening() {
    if (audioContextRef.current) {
      audioContextRef.current.audioContext.close()
      audioContextRef.current.stream.getTracks().forEach(t => t.stop())
      audioContextRef.current = null
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
    analyserRef.current = null
    setIsListening(false)
    setDetectedFreq(null)
    setDetectedNote(null)
    setCents(0)
  }

  function detectPitch() {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const buffer = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(buffer)

    const freq = autoCorrelate(buffer, audioContextRef.current.audioContext.sampleRate)

    if (freq > 0) {
      setDetectedFreq(freq.toFixed(2))
      const { note, cents: c } = getClosestNote(freq)
      setDetectedNote(note)
      setCents(c)
    } else {
      setDetectedFreq(null)
      setDetectedNote(null)
      setCents(0)
    }

    animationIdRef.current = requestAnimationFrame(detectPitch)
  }

  function autoCorrelate(buffer, sampleRate) {
    let SIZE = buffer.length
    let rms = 0
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i]
    }
    rms = Math.sqrt(rms / SIZE)
    if (rms < 0.01) return -1

    let r1 = 0, r2 = SIZE - 1, thres = 0.2
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break }
    }

    buffer = buffer.slice(r1, r2)
    SIZE = buffer.length

    let c = new Array(SIZE).fill(0)
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i]
      }
    }

    let d = 0
    while (c[d] > c[d + 1]) d++

    let maxval = -1, maxpos = -1
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i]
        maxpos = i
      }
    }

    let T0 = maxpos
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1]
    let a = (x1 + x3 - 2 * x2) / 2
    let b = (x3 - x1) / 2
    if (a) T0 = T0 - b / (2 * a)

    return sampleRate / T0
  }

  function getClosestNote(freq) {
    let minDiff = Infinity
    let closestNote = NOTES[0]

    for (const note of NOTES) {
      const diff = Math.abs(freq - note.freq)
      if (diff < minDiff) {
        minDiff = diff
        closestNote = note
      }
    }

    const cents = 1200 * Math.log2(freq / closestNote.freq)
    return { note: closestNote.name, cents: Math.round(cents) }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Instrument Tuner</h1>
      <p className="tool-description">
        Tune your guitar, ukulele, or any instrument using your device's microphone.
      </p>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {!isListening ? (
          <button className="btn" onClick={startListening}>
            🎤 Start Tuner
          </button>
        ) : (
          <button className="btn btn-ghost" onClick={stopListening}>
            ⏹ Stop
          </button>
        )}
      </div>

      {isListening && (
        <div style={{ padding: '2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
          {detectedNote ? (
            <>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {detectedNote}
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                {detectedFreq} Hz
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{ width: 200, height: 8, background: 'var(--bg)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      width: 2,
                      height: '100%',
                      background: 'var(--text)',
                      opacity: 0.3,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `calc(50% + ${(cents / 50) * 50}%)`,
                      width: 6,
                      height: '100%',
                      background: Math.abs(cents) < 10 ? '#4ade80' : '#f87171',
                      borderRadius: 3,
                      transition: 'left 0.1s ease-out',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: Math.abs(cents) < 10 ? '#4ade80' : 'var(--muted)' }}>
                  {cents > 0 ? '+' : ''}{cents} ¢
                </span>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {Math.abs(cents) < 5 ? '✓ In tune!' : Math.abs(cents) < 10 ? 'Almost there' : cents > 0 ? 'Too high' : 'Too low'}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              🎵 Play a note...
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Standard tuning reference</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          {NOTES.map(note => (
            <div key={note.name} style={{ padding: '0.4rem', background: 'var(--bg)', borderRadius: 6, textAlign: 'center' }}>
              <strong style={{ color: 'var(--text)' }}>{note.name}</strong> {note.freq.toFixed(1)} Hz
            </div>
          ))}
        </div>
      </div>

      <RelatedTools tools={[
        { icon: '🎵', name: 'Tone Generator',  path: '/tools/tone-generator' },
        { icon: '🥁', name: 'Metronome',       path: '/tools/metronome' },
        { icon: '📡', name: 'Morse Code',      path: '/tools/morse-code' },
        { icon: '⌨️', name: 'Typing Speed',    path: '/tools/typing-speed' },
      ]} />
      <ToolSeo />
    </div>
  )
}
