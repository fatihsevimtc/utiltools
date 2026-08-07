import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

const JSZIP_CDN = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'

function loadJsZip() {
  return new Promise((resolve, reject) => {
    if (window.JSZip) { resolve(window.JSZip); return }
    const script = document.createElement('script')
    script.src = JSZIP_CDN
    script.onload = () => resolve(window.JSZip)
    script.onerror = () => reject(new Error('Failed to load JSZip'))
    document.head.appendChild(script)
  })
}

function stripXml(xml) {
  return xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function countWords(text) {
  const words = text.match(/\b\w+\b/g) || []
  return words.length
}

function countParagraphs(text) {
  return (text.match(/\n\s*\n/g) || []).length + 1
}

export default function DocxWordCount() {
  const [jszip, setJszip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadJsZip()
      .then(j => { setJszip(j); setLoading(false) })
      .catch(e => { setLoadErr(e.message); setLoading(false) })
  }, [])

  async function onFile(e) {
    const file = e.target.files[0]
    if (!file || !jszip) return
    setProcessing(true)
    setResult(null)
    setError('')
    try {
      const buf = await file.arrayBuffer()
      const zip = await jszip.loadAsync(buf)
      const xmlFile = zip.file('word/document.xml')
      if (!xmlFile) throw new Error('No word/document.xml found — is this a valid .docx file?')
      const xml = await xmlFile.async('string')
      const text = stripXml(xml)
      const words = countWords(text)
      const chars = text.replace(/\s/g, '').length
      const charsSpaces = text.length
      const paragraphs = countParagraphs(text)
      setResult({ fileName: file.name, words, chars, charsSpaces, paragraphs, text: text.slice(0, 500) })
    } catch (e) {
      setError(e.message)
    }
    setProcessing(false)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Word Count (DOCX)</h1>
      <p className="tool-description">Count words, characters, and paragraphs in Microsoft Word (.docx) files — no upload needed.</p>

      {loading && <p style={{ opacity: 0.6 }}>Loading JSZip…</p>}
      {loadErr && <p style={{ color: 'var(--danger, #ef4444)' }}>Failed to load library: {loadErr}</p>}

      {!loading && !loadErr && (
        <>
          <label className="file-upload-label">
            📁 Choose .docx file…
            <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFile} style={{ display: 'none' }} />
          </label>
          {processing && <p style={{ opacity: 0.6 }}>Processing…</p>}
          {error && <p style={{ color: 'var(--danger, #ef4444)' }}>{error}</p>}
        </>
      )}

      {result && (
        <>
          <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{result.fileName}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Words',              value: result.words.toLocaleString() },
              { label: 'Characters',         value: result.chars.toLocaleString() },
              { label: 'Chars (with spaces)',value: result.charsSpaces.toLocaleString() },
              { label: 'Paragraphs (~)',      value: result.paragraphs.toLocaleString() },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface2, #f5f5f5)', borderRadius: '0.5rem', padding: '0.75rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent, #6366f1)' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.65 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <label>Text preview (first 500 chars)</label>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{result.text}{result.text.length >= 500 ? '…' : ''}</div>
        </>
      )}
    </div>
  )
}
