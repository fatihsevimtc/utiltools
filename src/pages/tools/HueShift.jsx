import { useState, useRef, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function HueShift() {
  const [image, setImage] = useState(null)
  const [hueShift, setHueShift] = useState(0)
  const canvasRef = useRef(null)
  const originalRef = useRef(null)

  useEffect(() => {
    if (image) {
      applyHueShift()
    }
  }, [hueShift, image])

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        originalRef.current = img
        setImage(img)
        applyHueShift()
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  function applyHueShift() {
    const img = originalRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')

    ctx.filter = `hue-rotate(${hueShift}deg)`
    ctx.drawImage(img, 0, 0)
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hue-shift-${hueShift}deg.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Hue Shift Generator</h1>
      <p className="tool-description">Shift the hue of any image to create color variations, artistic effects, or correct color casts.</p>

      <label htmlFor="hue-image">Upload Image</label>
      <input 
        id="hue-image"
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
      />

      {image && (
        <>
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor="hue-slider">Hue Shift: {hueShift}°</label>
            <input 
              id="hue-slider"
              type="range" 
              min="0" 
              max="360" 
              value={hueShift} 
              onChange={e => setHueShift(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <canvas 
            ref={canvasRef} 
            style={{ 
              maxWidth: '100%', 
              marginTop: '1.5rem', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              display: 'block'
            }}
          />

          <button onClick={download} style={{ marginTop: '1rem' }}>
            Download Shifted Image
          </button>
        </>
      )}

      <RelatedTools category="images" exclude="/tools/hue-shift" />
      <ToolSeo />
    </div>
  )
}
