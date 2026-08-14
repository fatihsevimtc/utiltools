import { useState, useRef, useCallback, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function AudioTrimmer() {
  const [audioSrc, setAudioSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [trimming, setTrimming] = useState(false)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setAudioSrc(url)
    setStartTime(0)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        const dur = audioRef.current.duration
        setDuration(dur)
        setEndTime(dur)
      })
    }
  }, [audioSrc])

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  async function trimAudio() {
    if (!audioSrc || !audioRef.current) return
    if (startTime >= endTime) {
      alert('Start time must be before end time')
      return
    }

    setTrimming(true)

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const response = await fetch(audioSrc)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const sampleRate = audioBuffer.sampleRate
      const startSample = Math.floor(startTime * sampleRate)
      const endSample = Math.floor(endTime * sampleRate)
      const trimmedLength = endSample - startSample

      // Create new buffer with trimmed audio
      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        trimmedLength,
        sampleRate
      )

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel)
        const trimmedData = trimmedBuffer.getChannelData(channel)
        
        for (let i = 0; i < trimmedLength; i++) {
          trimmedData[i] = channelData[startSample + i]
        }
      }

      // Convert to WAV
      const wav = audioBufferToWav(trimmedBuffer)
      const blob = new Blob([wav], { type: 'audio/wav' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `trimmed-${fileName.replace(/\.[^.]+$/, '')}.wav`
      link.click()
      
      setTrimming(false)
    } catch (err) {
      console.error('Trim error:', err)
      alert('Trimming failed. Please try a different file.')
      setTrimming(false)
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

    setUint32(0x46464952)
    setUint32(length - 8)
    setUint32(0x45564157)
    setUint32(0x20746d66)
    setUint32(16)
    setUint16(1)
    setUint16(buffer.numberOfChannels)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels)
    setUint16(buffer.numberOfChannels * 2)
    setUint16(16)
    setUint32(0x61746164)
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

  function setPreviewStart() {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime
      audioRef.current.play()
    }
  }

  function reset() {
    if (audioSrc) URL.revokeObjectURL(audioSrc)
    setAudioSrc(null)
    setFileName('')
    setDuration(0)
    setStartTime(0)
    setEndTime(0)
    setTrimming(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Audio Trimmer</h1>
      <p className="tool-description">
        Trim audio files by selecting start and end times — all processing happens in your browser.
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
          <audio
            ref={audioRef}
            src={audioSrc}
            controls
            style={{
              width: '100%',
              marginBottom: '1rem',
              borderRadius: 8,
            }}
          />

          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Duration: <strong>{formatTime(duration)}</strong>
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="at-start">Start Time (seconds)</label>
            <input
              id="at-start"
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={startTime}
              onChange={e => setStartTime(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {formatTime(startTime)}
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="at-end">End Time (seconds)</label>
            <input
              id="at-end"
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={endTime}
              onChange={e => setEndTime(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {formatTime(endTime)}
            </p>
          </div>

          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Trimmed duration: <strong>{formatTime(endTime - startTime)}</strong>
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button className="btn" onClick={setPreviewStart}>
              ▶️ Preview from Start
            </button>
            <button
              className="btn"
              onClick={trimAudio}
              disabled={trimming || startTime >= endTime}
            >
              {trimming ? '✂️ Trimming…' : '✂️ Trim & Download'}
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              ↻ Reset
            </button>
          </div>
        </>
      )}

      <RelatedTools
        tools={[
          { icon: '🔄', name: 'Audio Converter', path: '/tools/audio-converter' },
          { icon: '🎵', name: 'Tone Generator', path: '/tools/tone-generator' },
          { icon: '🎼', name: 'Instrument Tuner', path: '/tools/instrument-tuner' },
          { icon: '🔊', name: 'Text to Speech', path: '/tools/text-to-speech' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
