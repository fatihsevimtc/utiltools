import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ImageSplitter() {
  const [imageSrc, setImageSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)
  const [splits, setSplits] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setSplits([])
    const reader = new FileReader()
    reader.onload = (ev) => setImageSrc(ev.target.result)
    reader.readAsDataURL(file)
  }, [])

  function splitImage() {
    if (!imageSrc) return

    const img = new Image()
    img.onload = () => {
      const pieceWidth = Math.floor(img.width / cols)
      const pieceHeight = Math.floor(img.height / rows)
      const pieces = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const canvas = document.createElement('canvas')
          canvas.width = pieceWidth
          canvas.height = pieceHeight
          const ctx = canvas.getContext('2d')

          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          )

          pieces.push({
            dataUrl: canvas.toDataURL('image/png'),
            row,
            col,
            name: `${fileName.replace(/\.[^.]+$/, '')}_r${row + 1}c${col + 1}.png`,
          })
        }
      }

      setSplits(pieces)
    }
    img.src = imageSrc
  }

  function downloadPiece(dataUrl, name) {
    const link = document.createElement('a')
    link.download = name
    link.href = dataUrl
    link.click()
  }

  function downloadAll() {
    splits.forEach((piece, idx) => {
      setTimeout(() => downloadPiece(piece.dataUrl, piece.name), idx * 100)
    })
  }

  function reset() {
    setImageSrc(null)
    setFileName('')
    setRows(2)
    setCols(2)
    setSplits([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Splitter</h1>
      <p className="tool-description">
        Split any image into a grid of smaller pieces — perfect for Instagram grids, puzzles, or tiled artwork.
      </p>

      <label className="file-upload-label" style={{ marginBottom: '1rem' }}>
        📁 {fileName || 'Choose image…'}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {imageSrc && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="is-rows">Rows (1–10)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn"
                  onClick={() => setRows(prev => Math.max(1, prev - 1))}
                  style={{ padding: '0.5rem 0.75rem', minWidth: 'auto' }}
                >
                  −
                </button>
                <input
                  id="is-rows"
                  type="number"
                  min={1}
                  max={10}
                  value={rows}
                  onChange={e => {
                    const v = parseInt(e.target.value)
                    if (!isNaN(v) && v >= 1 && v <= 10) setRows(v)
                  }}
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <button
                  className="btn"
                  onClick={() => setRows(prev => Math.min(10, prev + 1))}
                  style={{ padding: '0.5rem 0.75rem', minWidth: 'auto' }}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="is-cols">Columns (1–10)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn"
                  onClick={() => setCols(prev => Math.max(1, prev - 1))}
                  style={{ padding: '0.5rem 0.75rem', minWidth: 'auto' }}
                >
                  −
                </button>
                <input
                  id="is-cols"
                  type="number"
                  min={1}
                  max={10}
                  value={cols}
                  onChange={e => {
                    const v = parseInt(e.target.value)
                    if (!isNaN(v) && v >= 1 && v <= 10) setCols(v)
                  }}
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <button
                  className="btn"
                  onClick={() => setCols(prev => Math.min(10, prev + 1))}
                  style={{ padding: '0.5rem 0.75rem', minWidth: 'auto' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Total pieces: {rows * cols}
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button className="btn" onClick={splitImage}>
              ✂️ Split Image
            </button>
            {splits.length > 0 && (
              <>
                <button className="btn" onClick={downloadAll}>
                  ⬇ Download All
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  ↻ Reset
                </button>
              </>
            )}
          </div>
        </>
      )}

      {splits.length > 0 && (
        <div>
          <h3>Preview & Download</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            {splits.map((piece, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '0.5rem',
                  textAlign: 'center',
                }}
              >
                <img
                  src={piece.dataUrl}
                  alt={`Piece ${idx + 1}`}
                  style={{ width: '100%', borderRadius: 4, marginBottom: '0.5rem' }}
                />
                <button
                  className="btn"
                  onClick={() => downloadPiece(piece.dataUrl, piece.name)}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                >
                  ⬇ Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools
        tools={[
          { icon: '✂️', name: 'Image Cropper', path: '/tools/image-cropper' },
          { icon: '🖼️', name: 'Image Resizer', path: '/tools/image-resizer' },
          { icon: '🔍', name: 'Image Enlarger', path: '/tools/image-enlarger' },
          { icon: '🗜️', name: 'Image Compressor', path: '/tools/image-compressor' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
