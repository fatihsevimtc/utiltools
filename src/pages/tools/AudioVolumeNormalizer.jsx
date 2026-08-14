import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function AudioVolumeNormalizer() {
  const [audioSrc, setAudioSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [volumeGain, setVolumeGain] = useState(1.0)
  const [peakLevel, setPeakLevel] = useState(null)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)
  const audioBufferRef = useRef(null)

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setAudioSrc(url)
    setVolumeGain(1.0)
    setPeakLevel(null)
    loadAudioBuffer(url)
  }, [])

  async function loadAudioBuffer(url) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      audioBufferRef.current = audioBuffer
      
      // Calculate peak level
      let peak = 0
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const data = audioBuffer.getChannelData(channel)
        for (let i = 0; i < data.length; i++) {
          const abs = Math.abs(data[i])
          if (abs > peak) peak = abs
        }
      }
      setPeakLevel(peak)
    } catch (err) {
      console.error('Error loading audio:', err)
      alert('Failed to load audio file.')
    }
  }

  function normalizeToTarget() {
    if (!peakLevel || peakLevel === 0) return
    // Target is 95% of maximum to avoid clipping
    const targetPeak = 0.95
    const gain = targetPeak / peakLevel
    setVolumeGain(gain)
  }

  async function downloadNormalized() {
    if (!audioBufferRef.current) return

    setProcessing(true)

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const originalBuffer = audioBufferRef.current
      
      // Create new buffer with adjusted volume
      const newBuffer = audioContext.createBuffer(
        originalBuffer.numberOfChannels,
        originalBuffer.length,
        originalBuffer.sampleRate
      )

      // Apply gain to all channels
      for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        const inputData = originalBuffer.getChannelData(channel)
        const outputData = newBuffer.getChannelData(channel)
        
        for (let i = 0; i < inputData.length; i++) {
          // Apply gain and clamp to prevent clipping
          outputData[i] = Math.max(-1, Math.min(1, inputData[i] * volumeGain))
        }
      }

      // Convert to WAV
      const wav = audioBufferToWav(newBuffer)
      const blob = new Blob([wav], { type: 'audio/wav' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName.replace(/\.[^.]+$/, '')}_normalized.wav`
      link.click()
      
      setProcessing(false)
    } catch (err) {
      console.error('Processing error:', err)
      alert('Failed to process audio. Please try again.')
      setProcessing(false)
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

  function reset() {
    if (audioSrc) URL.revokeObjectURL(audioSrc)
    setAudioSrc(null)
    setFileName('')
    setVolumeGain(1.0)
    setPeakLevel(null)
    setProcessing(false)
    audioBufferRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const peakDb = peakLevel ? (20 * Math.log10(peakLevel)).toFixed(1) : null
  const newPeakLevel = peakLevel ? peakLevel * volumeGain : null
  const newPeakDb = newPeakLevel ? (20 * Math.log10(newPeakLevel)).toFixed(1) : null

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Audio Volume Normalizer</h1>
      <p className="tool-description">
        Normalize or adjust the volume of audio files — increase quiet audio or reduce loud audio to a target level.
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

          {peakLevel !== null && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              marginBottom: '1rem',
            }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Audio Levels</h3>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Original peak:</span>
                  <strong>{(peakLevel * 100).toFixed(1)}% ({peakDb} dB)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Volume gain:</span>
                  <strong>{(volumeGain * 100).toFixed(0)}%</strong>
                </div>
                {newPeakLevel !== null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                    <span>New peak:</span>
                    <strong>{(newPeakLevel * 100).toFixed(1)}% ({newPeakDb} dB)</strong>
                  </div>
                )}
              </div>
              
              <button
                className="btn"
                onClick={normalizeToTarget}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                🎯 Auto-Normalize to 95%
              </button>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="volume-gain">
              Manual Volume Gain: <strong>{(volumeGain * 100).toFixed(0)}%</strong>
            </label>
            <input
              id="volume-gain"
              type="range"
              min={0.1}
              max={3.0}
              step={0.1}
              value={volumeGain}
              onChange={e => setVolumeGain(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.82rem', 
              color: 'var(--muted)',
              marginTop: '0.25rem' 
            }}>
              <span>10% (quieter)</span>
              <span>100% (original)</span>
              <span>300% (louder)</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            ⚠️ Values above 100% may cause clipping if the audio is already loud. Audio is automatically clamped to prevent distortion.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={downloadNormalized}
              disabled={processing || volumeGain === 1.0}
            >
              {processing ? '🔄 Processing…' : '⬇ Download Normalized Audio'}
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              ↻ Reset
            </button>
          </div>

          {volumeGain === 1.0 && (
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              💡 Adjust the volume gain or use auto-normalize to enable download
            </p>
          )}
        </>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 8 }}>
        <h3>About normalization:</h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
          <li><strong>Peak normalization</strong> adjusts the entire audio so the loudest point reaches the target level</li>
          <li>This tool uses peak normalization at 95% to prevent clipping while maximizing volume</li>
          <li>You can manually adjust the gain if you want more or less volume</li>
          <li>Output is in WAV format to preserve audio quality</li>
        </ul>
      </div>

      <RelatedTools
        tools={[
          { icon: '🎵', name: 'Audio Pitch Changer', path: '/tools/audio-pitch-changer' },
          { icon: '🔄', name: 'Audio Converter', path: '/tools/audio-converter' },
          { icon: '✂️', name: 'Audio Trimmer', path: '/tools/audio-trimmer' },
          { icon: '🎵', name: 'Tone Generator', path: '/tools/tone-generator' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
