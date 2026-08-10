import { useState, useRef, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function FlipRotateImage() {
  const [src, setSrc] = useState(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [rotation, setRotation] = useState(0)   // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [format, setFormat] = useState('image/png')
  const [quality, setQuality] = useState(90)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOrigW(img.width)
      setOrigH(img.height)
      imgRef.current = img
      setSrc(url)
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
    }
    img.src = url
  }

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const isPortrait = rotation % 180 !== 0
    const W = isPortrait ? origH : origW
    const H = isPortrait ? origW : origH
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    ctx.save()
    ctx.translate(W / 2, H / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(img, -origW / 2, -origH / 2, origW, origH)
    ctx.restore()
  }, [rotation, flipH, flipV, origW, origH])

  useEffect(() => { if (src) render() }, [src, render])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const q = format === 'image/png' ? undefined : quality / 100
    const url = canvas.toDataURL(format, q)
    const a = document.createElement('a')
    a.href = url
    a.download = `flipped.${format === 'image/png' ? 'png' : 'jpg'}`
    a.click()
  }

  function onDrop(e) {
    e.preventDefault()
    loadFile(e.dataTransfer.files[0])
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Flip &amp; Rotate Image</h1>
      <p className="tool-description">
        Flip or rotate any image in your browser. Supports PNG, JPEG, WebP, and GIF. Nothing is uploaded to any server.
      </p>

      {!src ? (
        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '3rem 1.5rem', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => document.getElementById('fr-upload').click()}
        >
          <p style={{ fontSize: '2rem', margin: 0 }}>🖼️</p>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Drop an image here or click to select</p>
          <input id="fr-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => loadFile(e.target.files[0])} />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
            <button className="btn btn-sm" onClick={() => setRotation(r => (r - 90 + 360) % 360)}>↺ Rotate L</button>
            <button className="btn btn-sm" onClick={() => setRotation(r => (r + 90) % 360)}>↻ Rotate R</button>
            <button className={`btn btn-sm ${flipH ? '' : 'btn-ghost'}`} onClick={() => setFlipH(f => !f)}>⇔ Flip H</button>
            <button className={`btn btn-sm ${flipV ? '' : 'btn-ghost'}`} onClick={() => setFlipV(f => !f)}>⇕ Flip V</button>
            <button className="btn btn-sm btn-ghost" onClick={() => { setRotation(0); setFlipH(false); setFlipV(false) }}>Reset</button>
            <button className="btn btn-sm btn-ghost" onClick={() => { setSrc(null); imgRef.current = null }}>Change image</button>
          </div>

          <div style={{ overflowX: 'auto', textAlign: 'center', background: 'repeating-conic-gradient(var(--surface) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px', borderRadius: 8, padding: '1rem' }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 140px' }}>
              <label>Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            {format !== 'image/png' && (
              <div style={{ flex: '1 1 140px' }}>
                <label>Quality ({quality}%)</label>
                <input type="range" min={10} max={100} step={5} value={quality} onChange={e => setQuality(+e.target.value)} />
              </div>
            )}
            <button className="btn" onClick={download}>⬇ Download</button>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            {rotation !== 0 || flipH || flipV
              ? `Rotation: ${rotation}°${flipH ? ' | Flipped H' : ''}${flipV ? ' | Flipped V' : ''}`
              : 'No transforms applied'}
          </p>
        </>
      )}

      <RelatedTools category="files" exclude="/tools/flip-rotate-image" />
      <ToolSeo />
    </div>
  )
}
