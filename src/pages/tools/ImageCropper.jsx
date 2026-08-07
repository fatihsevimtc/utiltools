import { useState, useRef, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'

export default function ImageCropper() {
  const [src, setSrc] = useState(null)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [crop, setCrop] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [start, setStart] = useState(null)
  const canvasRef = useRef(null)
  const previewRef = useRef(null)
  const imgRef = useRef(null)

  function onFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSrc(url)
    setCrop(null)
  }

  useEffect(() => {
    if (!src || !canvasRef.current) return
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      const maxW = Math.min(img.naturalWidth, 700)
      const scale = maxW / img.naturalWidth
      const w = maxW, h = Math.round(img.naturalHeight * scale)
      setImgSize({ w, h })
      canvasRef.current.width = w
      canvasRef.current.height = h
      canvasRef.current.getContext('2d').drawImage(img, 0, 0, w, h)
    }
    img.src = src
  }, [src])

  useEffect(() => {
    if (!crop || !canvasRef.current || !imgRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, imgSize.w, imgSize.h)
    ctx.drawImage(imgRef.current, 0, 0, imgSize.w, imgSize.h)
    // Draw crop overlay
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 3])
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h)
    ctx.fillStyle = 'rgba(99,102,241,0.1)'
    ctx.fillRect(crop.x, crop.y, crop.w, crop.h)
    // Draw preview
    if (previewRef.current) {
      const pw = previewRef.current, pc = pw.getContext('2d')
      pw.width = Math.abs(crop.w)
      pw.height = Math.abs(crop.h)
      const scaleX = imgRef.current.naturalWidth / imgSize.w
      const scaleY = imgRef.current.naturalHeight / imgSize.h
      pc.drawImage(imgRef.current,
        Math.min(crop.x, crop.x + crop.w) * scaleX,
        Math.min(crop.y, crop.y + crop.h) * scaleY,
        Math.abs(crop.w) * scaleX, Math.abs(crop.h) * scaleY,
        0, 0, Math.abs(crop.w), Math.abs(crop.h))
    }
  }, [crop, imgSize])

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseDown = useCallback(e => {
    const pos = getPos(e)
    setStart(pos)
    setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 })
    setDragging(true)
  }, [])

  const onMouseMove = useCallback(e => {
    if (!dragging || !start) return
    const pos = getPos(e)
    setCrop({ x: start.x, y: start.y, w: pos.x - start.x, h: pos.y - start.y })
  }, [dragging, start])

  const onMouseUp = useCallback(() => setDragging(false), [])

  function download() {
    if (!crop || !imgRef.current || !previewRef.current) return
    const a = document.createElement('a')
    a.href = previewRef.current.toDataURL('image/png')
    a.download = 'cropped.png'
    a.click()
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Cropper</h1>
      <p className="tool-description">Crop images by drawing a selection rectangle — no upload, all in browser.</p>

      <input type="file" accept="image/*" onChange={onFile} style={{ marginBottom: '1rem' }} />

      {src && (
        <>
          <label>Draw a crop rectangle on the image below</label>
          <canvas
            ref={canvasRef}
            style={{ display: 'block', cursor: 'crosshair', border: '1px solid var(--border, #ddd)', borderRadius: 4, maxWidth: '100%' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          />
        </>
      )}

      {crop && Math.abs(crop.w) > 2 && Math.abs(crop.h) > 2 && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>Crop preview ({Math.abs(Math.round(crop.w))} × {Math.abs(Math.round(crop.h))} px)</label>
          <canvas ref={previewRef} style={{ display: 'block', border: '1px solid var(--border, #ddd)', borderRadius: 4, maxWidth: '100%', marginBottom: '0.75rem' }} />
          <button className="btn btn-sm" onClick={download}>⬇ Download Cropped PNG</button>
        </div>
      )}
    </div>
  )
}
