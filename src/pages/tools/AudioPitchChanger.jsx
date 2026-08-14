import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function AudioPitchChanger() {
  const [audioSrc, setAudioSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [pitchShift, setPitchShift] = useState(0)
  const [playing, setPlaying] = useState(false)
  const fileInputRef = useRef(null)
  const audioContextRef = useRef(null)
  const sourceRef = useRef(null)
  const audioBufferRef = useRef(null)

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setAudioSrc(url)
    stopAudio()
    loadAudioBuffer(url)
  }, [])

  async function loadAudioBuffer(url) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      audioBufferRef.current = audioBuffer
    } catch (err) {
      console.error('Error loading audio:', err)
      alert('Failed to load audio file.')
    }
  }

  function playAudio() {
    if (!audioBufferRef.current || !audioContextRef.current) return

    stopAudio()

    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBufferRef.current
    
    // Change playback rate to shift pitch
    // Positive values = higher pitch, negative = lower pitch
    const playbackRate = Math.pow(2, pitchShift / 12)
    source.playbackRate.value = playbackRate
    
    source.connect(audioContextRef.current.destination)
    source.start(0)
    
    sourceRef.current = source
    setPlaying(true)

    source.onended = () => {
      setPlaying(false)
      sourceRef.current = null
    }
  }

  function stopAudio() {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch (e) {
        // Already stopped
      }
      sourceRef.current = null
    }
    setPlaying(false)
  }

  async function downloadShifted() {
    if (!audioBufferRef.current || !audioContextRef.current) return

    try {
      const playbackRate = Math.pow(2, pitchShift / 12)
      const sampleRate = audioBufferRef.current.sampleRate
      const newLength = Math.floor(audioBufferRef.current.length / playbackRate)
      
      const offlineContext = new OfflineAudioContext(
        audioBufferRef.current.numberOfChannels,
        newLength,
        sampleRate
      )
      
      const source = offlineContext.createBufferSource()
      source.buffer = audioBufferRef.current
      source.playbackRate.value = playbackRate
      source.connect(offlineContext.destination)
      source.start(0)
      
      const renderedBuffer = await offlineContext.startRendering()
      
      // Convert to WAV
      const wav = audioBufferToWav(renderedBuffer)
      const blob = new Blob([wav], { type: 'audio/wav' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const suffix = pitchShift >= 0 ? `+${pitchShift}` : pitchShift
      link.download = `${fileName.replace(/\.[^.]+$/, '')}_pitch${suffix}.wav`
      link.click()
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to process audio. Please try again.')
    }
  }

  function audioBufferToWav(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44
    const arrayBuffer = new ArrayBuffer(length)
    const view = new DataView(arrayBuffer)
    const channels = []
    let pos = 0

    const setUint16 = (data) => {
      view.setUint16(pos, data, true)
      pos += 2
    }
    const setUint32 = (data) => {
      view.setUint32(pos, data, true)
      pos += 4
    }

    setUint32(0x46464952) // "RIFF"
    setUint32(length - 8)
    setUint32(0x45564157) // "WAVE"
    setUint32(0x20746d66) // "fmt "
    setUint32(16)
    setUint16(1)
    setUint16(buffer.numberOfChannels)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels)
    setUint16(buffer.numberOfChannels * 2)
    setUint16(16)
    setUint32(0x61746164) // "data"
    setUint32(length - pos - 4)

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

    let offset = 0
    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]))
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(pos, sample, true)
        pos += 2
      }
      offset++
    }

    return arrayBuffer
  }

  function reset() {
    stopAudio()
    if (audioSrc) URL.revokeObjectURL(audioSrc)
    setAudioSrc(null)
    setFileName('')
    setPitchShift(0)
    setPlaying(false)
    audioBufferRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Audio Pitch Changer</h1>
      <p className="tool-description">
        Change the pitch of audio files up or down by semitones — all processing happens in your browser.
      </p>

      <label className="file-upload-label" style={{ marginBottom: '1rem' }}>
        🎵 {fileName || 'Choose audio file…'}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {audioSrc && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="pitch-shift">
              Pitch Shift: <strong>{pitchShift > 0 ? '+' : ''}{pitchShift}</strong> semitones
            </label>
            <input
              id="pitch-shift"
              type="range"
              min={-12}
              max={12}
              step={1}
              value={pitchShift}
              onChange={e => {
                setPitchShift(parseInt(e.target.value))
                stopAudio()
              }}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.82rem', 
              color: 'var(--muted)',
              marginTop: '0.25rem' 
            }}>
              <span>-12 (lower)</span>
              <span>0 (original)</span>
              <span>+12 (higher)</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            ℹ️ Positive values raise the pitch, negative values lower it. Each semitone is 1/12 of an octave.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button
              className="btn"
              onClick={playing ? stopAudio : playAudio}
            >
              {playing ? '⏸️ Stop Preview' : '▶️ Play Preview'}
            </button>
            <button
              className="btn"
              onClick={downloadShifted}
              disabled={pitchShift === 0}
            >
              ⬇ Download Shifted Audio
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              ↻ Reset
            </button>
          </div>

          {pitchShift === 0 && (
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              💡 Adjust the pitch slider to enable download
            </p>
          )}
        </>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 8 }}>
        <h3>How it works:</h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
          <li>This tool changes the playback rate to adjust pitch</li>
          <li>Changing pitch also changes the duration (higher pitch = shorter, lower pitch = longer)</li>
          <li>For professional pitch shifting without tempo changes, use dedicated audio software</li>
          <li>Output is in WAV format for maximum compatibility</li>
        </ul>
      </div>

      <RelatedTools
        tools={[
          { icon: '🔄', name: 'Audio Converter', path: '/tools/audio-converter' },
          { icon: '✂️', name: 'Audio Trimmer', path: '/tools/audio-trimmer' },
          { icon: '🔊', name: 'Audio Volume Normalizer', path: '/tools/audio-volume-normalizer' },
          { icon: '🎵', name: 'Tone Generator', path: '/tools/tone-generator' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
