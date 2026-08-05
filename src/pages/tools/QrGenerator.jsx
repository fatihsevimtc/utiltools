import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import BackBar from '../../components/BackBar'

export default function QrGenerator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!text.trim()) return
    setError(null)
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).catch(err => setError(err.message))
  }, [text, size])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return

    // iOS Safari doesn't support the download attribute on anchor clicks.
    // Use toBlob + createObjectURL which works across all browsers including iPhone.
    canvas.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qrcode.png'
      // iOS fallback: if download attribute is ignored, open image in new tab
      a.target = '_blank'
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, 'image/png')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>QR Code Generator</h1>
      <p className="tool-description">
        Enter any URL or text to generate a downloadable QR code — entirely in your browser.
      </p>

      <label htmlFor="qr-input">URL or text</label>
      <input
        id="qr-input"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="https://example.com"
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <label style={{ marginBottom: 0 }}>Size</label>
        <select value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: 'auto' }}>
          <option value={128}>128 px</option>
          <option value={256}>256 px</option>
          <option value={512}>512 px</option>
        </select>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}

      <div className="qr-output">
        <canvas
          ref={canvasRef}
          style={{ display: text.trim() ? 'block' : 'none', maxWidth: '100%', height: 'auto' }}
        />
        {text.trim() && (
          <button className="btn" onClick={download}>Download PNG</button>
        )}
      </div>
    </div>
  )
}
