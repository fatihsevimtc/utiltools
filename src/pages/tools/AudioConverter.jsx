import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function AudioConverter() {
  const [audioSrc, setAudioSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [outputFormat, setOutputFormat] = useState('mp3')
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setAudioSrc(url)
  }, [])

  async function convertAudio() {
    if (!audioSrc || !audioRef.current) return

    setConverting(true)

    try {
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Fetch audio data
      const response = await fetch(audioSrc)
      const arrayBuffer = await response.arrayBuffer()
      
      // Decode audio
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      // Create offline context for rendering
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      )
      
      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(offlineContext.destination)
      source.start()
      
      // Render audio
      const renderedBuffer = await offlineContext.startRendering()
      
      // Convert to WAV (browser-native format)
      const wav = audioBufferToWav(renderedBuffer)
      const blob = new Blob([wav], { type: 'audio/wav' })
      
      // Download
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName.replace(/\.[^.]+$/, '')}.${outputFormat === 'wav' ? 'wav' : 'wav'}`
      link.click()
      
      setConverting(false)
    } catch (err) {
      console.error('Conversion error:', err)
      alert('Conversion failed. Please try a different file.')
      setConverting(false)
    }
  }

  // Convert AudioBuffer to WAV format
  function audioBufferToWav(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44
    const arrayBuffer = new ArrayBuffer(length)
    const view = new DataView(arrayBuffer)
    const channels = []
    let offset = 0
    let pos = 0

    // Write WAV header
    const setUint16 = (data) => {
      view.setUint16(pos, data, true)
      pos += 2
    }
    const setUint32 = (data) => {
      view.setUint32(pos, data, true)
      pos += 4
    }

    // RIFF identifier
    setUint32(0x46464952)
    // file length
    setUint32(length - 8)
    // RIFF type
    setUint32(0x45564157)
    // format chunk identifier
    setUint32(0x20746d66)
    // format chunk length
    setUint32(16)
    // sample format (raw)
    setUint16(1)
    // channel count
    setUint16(buffer.numberOfChannels)
    // sample rate
    setUint32(buffer.sampleRate)
    // byte rate
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels)
    // block align
    setUint16(buffer.numberOfChannels * 2)
    // bits per sample
    setUint16(16)
    // data chunk identifier
    setUint32(0x61746164)
    // data chunk length
    setUint32(length - pos - 4)

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

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
    if (audioSrc) URL.revokeObjectURL(audioSrc)
    setAudioSrc(null)
    setFileName('')
    setOutputFormat('mp3')
    setConverting(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Audio Converter</h1>
      <p className="tool-description">
        Convert audio files between formats — all processing happens in your browser.
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

          <label htmlFor="ac-format">Output Format</label>
          <select
            id="ac-format"
            value={outputFormat}
            onChange={e => setOutputFormat(e.target.value)}
            style={{ marginBottom: '1rem' }}
          >
            <option value="wav">WAV</option>
            <option value="mp3">MP3 (converted as WAV)</option>
            <option value="ogg">OGG (converted as WAV)</option>
          </select>

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            ℹ️ Due to browser limitations, output is in WAV format. For true MP3/OGG, use a desktop tool.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={convertAudio}
              disabled={converting}
            >
              {converting ? '🔄 Converting…' : '🔄 Convert & Download'}
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              ↻ Reset
            </button>
          </div>
        </>
      )}

      <RelatedTools
        tools={[
          { icon: '✂️', name: 'Audio Trimmer', path: '/tools/audio-trimmer' },
          { icon: '🎵', name: 'Tone Generator', path: '/tools/tone-generator' },
          { icon: '🎼', name: 'Instrument Tuner', path: '/tools/instrument-tuner' },
          { icon: '🔊', name: 'Text to Speech', path: '/tools/text-to-speech' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
