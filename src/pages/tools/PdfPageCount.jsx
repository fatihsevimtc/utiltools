import { useState, useEffect, useRef } from 'react'
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

export default function PdfPageCount() {
  const [ready, setReady]   = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadScript(PDFJS_CDN).then(() => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER
      setReady(true)
    })
  }, [])

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setError(''); setResult(null); setLoading(true)
    try {
      const buf  = await file.arrayBuffer()
      const pdf  = await window.pdfjsLib.getDocument({ data: buf }).promise
      const info = await pdf.getMetadata().catch(() => ({}))
      setResult({
        name:  file.name,
        pages: pdf.numPages,
        size:  file.size,
        title: info?.info?.Title || '',
        author: info?.info?.Author || '',
        creator: info?.info?.Creator || '',
      })
    } catch {
      setError('Could not read PDF. The file may be corrupted or password-protected.')
    } finally { setLoading(false) }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>PDF Page Count</h1>
      <p className="tool-description">Count pages in a PDF and view its metadata — file never leaves your browser.</p>

      {!ready && <p style={{ color: 'var(--muted)' }}>Loading PDF engine…</p>}

      {ready && (
        <div>
          <label htmlFor="pdf-file">Select PDF file</label>
          <input id="pdf-file" type="file" accept=".pdf,application/pdf" onChange={handleFile} />
        </div>
      )}

      {loading && <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Reading PDF…</p>}
      {error   && <p style={{ marginTop: '1rem', color: 'var(--danger)' }}>{error}</p>}

      {result && (
        <div className="notice" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              ['File',    result.name],
              ['Pages',   result.pages],
              ['Size',    (result.size / 1024).toFixed(1) + ' KB'],
              ['Title',   result.title  || '—'],
              ['Author',  result.author || '—'],
              ['Creator', result.creator|| '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                <div style={{ fontWeight: 600, wordBreak: 'break-word' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
