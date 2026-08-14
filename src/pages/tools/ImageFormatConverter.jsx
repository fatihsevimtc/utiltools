import { useState, useRef } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ImageFormatConverter() {
  const [image, setImage] = useState(null)
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(90)
  const canvasRef = useRef(null)

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
        }
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return

    let mimeType = 'image/png'
    let ext = 'png'

    if (format === 'jpeg') {
      mimeType = 'image/jpeg'
      ext = 'jpg'
    } else if (format === 'bmp') {
      mimeType = 'image/bmp'
      ext = 'bmp'
    } else if (format === 'gif') {
      mimeType = 'image/gif'
      ext = 'gif'
    } else if (format === 'ico') {
      mimeType = 'image/x-icon'
      ext = 'ico'
    }

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converted.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    }, mimeType, quality / 100)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>BMP / GIF / ICO Format Converter</h1>
      <p className="tool-description">Convert images to BMP, GIF, ICO, PNG, or JPEG formats entirely in your browser.</p>

      <label htmlFor="format-image">Upload Image</label>
      <input 
        id="format-image"
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
      />

      {image && (
        <>
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor="format-select">Output Format</label>
            <select id="format-select" value={format} onChange={e => setFormat(e.target.value)}>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="bmp">BMP</option>
              <option value="gif">GIF</option>
              <option value="ico">ICO</option>
            </select>
          </div>

          {(format === 'jpeg' || format === 'webp') && (
            <div style={{ marginTop: '1rem' }}>
              <label htmlFor="quality-slider">Quality: {quality}%</label>
              <input 
                id="quality-slider"
                type="range" 
                min="10" 
                max="100" 
                value={quality} 
                onChange={e => setQuality(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <canvas 
            ref={canvasRef} 
            style={{ 
              maxWidth: '100%', 
              marginTop: '1.5rem', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              display: 'none'
            }}
          />

          <div style={{ marginTop: '1.5rem' }}>
            <h3>Preview</h3>
            <img 
              src={canvasRef.current?.toDataURL()} 
              alt="Preview" 
              style={{ maxWidth: '300px', border: '1px solid var(--border)', borderRadius: '8px' }}
            />
          </div>

          <button onClick={download} style={{ marginTop: '1rem' }}>
            Download as {format.toUpperCase()}
          </button>
        </>
      )}

      <RelatedTools category="images" exclude="/tools/image-format-converter" />
      <ToolSeo />
    </div>
  )
}
