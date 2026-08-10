import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// Minimal SRT ↔ VTT converter (browser-side, no deps)
function srtToVtt(srt) {
  return 'WEBVTT\n\n' + srt.trim()
    .replace(/\r\n/g, '\n')
    .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4')
}

function vttToSrt(vtt) {
  return vtt.trim()
    .replace(/^WEBVTT.*\n(\n)?/m, '')
    .replace(/\r\n/g, '\n')
    .replace(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/g, '$1:$2:$3,$4')
    .trim()
}

export default function SubtitleConverter() {
  const [input, setInput]   = useState('')
  const [mode, setMode]     = useState('srtToVtt')
  const [copied, setCopied] = useState(false)

  const output = (() => {
    if (!input.trim()) return ''
    try {
      return mode === 'srtToVtt' ? srtToVtt(input) : vttToSrt(input)
    } catch { return '' }
  })()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  function download() {
    const ext = mode === 'srtToVtt' ? 'vtt' : 'srt'
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `subtitles.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>SRT ↔ VTT Subtitle Converter</h1>
      <p className="tool-description">
        Convert subtitle files between SRT (SubRip) and WebVTT formats instantly in your browser — nothing is uploaded anywhere.
      </p>

      <div className="chip-group" style={{ marginBottom: '0.75rem' }}>
        <button className={`chip ${mode === 'srtToVtt' ? 'active' : ''}`} onClick={() => setMode('srtToVtt')}>SRT → VTT</button>
        <button className={`chip ${mode === 'vttToSrt' ? 'active' : ''}`} onClick={() => setMode('vttToSrt')}>VTT → SRT</button>
      </div>

      <label htmlFor="sc-input">Input ({mode === 'srtToVtt' ? 'SRT' : 'VTT'})</label>
      <textarea
        id="sc-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'srtToVtt' ? '1\n00:00:01,000 --> 00:00:04,000\nHello world' : 'WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.000\nHello world'}
        style={{ minHeight: 220, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output ({mode === 'srtToVtt' ? 'VTT' : 'SRT'})</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-ghost" onClick={download}>Download</button>
              <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 220, fontFamily: 'monospace', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <RelatedTools category="misc" exclude="/tools/subtitle-converter" />
      <ToolSeo />
    </div>
  )
}
