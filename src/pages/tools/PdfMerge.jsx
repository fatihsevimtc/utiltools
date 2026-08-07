import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

const PDFLIBCDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js'

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return }
    const s = document.createElement('script')
    s.src = src; s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })
}

export default function PdfMerge() {
  const [ready, setReady]   = useState(false)
  const [files, setFiles]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    loadScript(PDFLIBCDN).then(() => setReady(true))
  }, [])

  function handleFiles(e) {
    const picked = Array.from(e.target.files)
    setFiles(prev => [...prev, ...picked])
    setError('')
  }

  function removeFile(idx) { setFiles(prev => prev.filter((_, i) => i !== idx)) }
  function moveUp(idx)   { if (idx === 0) return; setFiles(prev => { const a = [...prev]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a }) }
  function moveDown(idx) { setFiles(prev => { if (idx === prev.length-1) return prev; const a = [...prev]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; return a }) }

  async function merge() {
    if (files.length < 2) { setError('Add at least 2 PDF files to merge.'); return }
    setLoading(true); setError('')
    try {
      const { PDFDocument } = window.PDFLib
      const merged = await PDFDocument.create()
      for (const file of files) {
        const buf  = await file.arrayBuffer()
        const doc  = await PDFDocument.load(buf, { ignoreEncryption: true })
        const idxs = doc.getPageIndices()
        const pages = await merged.copyPages(doc, idxs)
        pages.forEach(p => merged.addPage(p))
      }
      const bytes = await merged.save()
      const blob  = new Blob([bytes], { type: 'application/pdf' })
      const a     = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'merged.pdf'; a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      setError('Failed to merge. Some PDFs may be encrypted or corrupt.')
    } finally { setLoading(false) }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>PDF Merge</h1>
      <p className="tool-description">Combine multiple PDF files into one — drag to reorder, runs entirely in your browser.</p>

      {!ready && <p style={{ color: 'var(--muted)' }}>Loading PDF library…</p>}

      {ready && (
        <>
          <label htmlFor="pdf-files">Add PDF files</label>
          <input id="pdf-files" type="file" accept=".pdf,application/pdf" multiple onChange={handleFiles} />

          {files.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                {files.length} file{files.length !== 1 ? 's' : ''} — drag to reorder using the ↑↓ buttons
              </p>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ flex: 1, fontSize: '0.875rem', wordBreak: 'break-all' }}>{i + 1}. {f.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{(f.size / 1024).toFixed(0)} KB</span>
                  <button className="btn btn-sm" onClick={() => moveUp(i)}>↑</button>
                  <button className="btn btn-sm" onClick={() => moveDown(i)}>↓</button>
                  <button className="btn btn-sm" style={{ color: 'var(--danger)' }} onClick={() => removeFile(i)}>✕</button>
                </div>
              ))}
              <button
                className="btn"
                style={{ marginTop: '1rem' }}
                onClick={merge}
                disabled={loading}
              >
                {loading ? 'Merging…' : '⬇ Merge & Download PDF'}
              </button>
            </div>
          )}

          {error && <p style={{ marginTop: '1rem', color: 'var(--danger)' }}>{error}</p>}
        </>
      )}
    </div>
  )
}
