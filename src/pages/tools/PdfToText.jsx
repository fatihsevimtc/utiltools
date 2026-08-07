import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

const PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'
const WORKER    = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return }
    const s = document.createElement('script')
    s.src = src; s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })
}

export default function PdfToText() {
  const [ready, setReady]   = useState(false)
  const [text, setText]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadScript(PDFJS_CDN).then(() => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER
      setReady(true)
    })
  }, [])

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setError(''); setText(''); setLoading(true)
    try {
      const buf = await file.arrayBuffer()
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise
      const pages = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page    = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(it => it.str).join(' ')
        pages.push(`--- Page ${i} ---\n${pageText}`)
      }
      setText(pages.join('\n\n'))
    } catch {
      setError('Could not extract text. The PDF may be scanned, encrypted, or image-based.')
    } finally { setLoading(false) }
  }

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  function download() {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    a.download = 'extracted-text.txt'; a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>PDF to Text</h1>
      <p className="tool-description">Extract all text from a PDF file — runs entirely in your browser, nothing is uploaded.</p>

      {!ready && <p style={{ color: 'var(--muted)' }}>Loading PDF engine…</p>}

      {ready && (
        <div>
          <label htmlFor="pdf-file">Select PDF file</label>
          <input id="pdf-file" type="file" accept=".pdf,application/pdf" onChange={handleFile} />
        </div>
      )}

      {loading && <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Extracting text…</p>}
      {error   && <p style={{ marginTop: '1rem', color: 'var(--danger)' }}>{error}</p>}

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Extracted text</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
              <button className="btn btn-sm" onClick={download}>⬇ Download .txt</button>
            </div>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', maxHeight: 500, overflowY: 'auto' }}>{text}</div>
        </div>
      )}
    </div>
  )
}
