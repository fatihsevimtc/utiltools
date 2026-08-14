import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ImageDownloader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  async function handleDownload() {
    if (!url) return
    
    setLoading(true)
    setError('')
    setPreview(null)

    try {
      // Fetch via CORS proxy or direct if CORS allows
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      setPreview(objectUrl)

      // Auto-download
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = url.split('/').pop() || 'image'
      link.click()
    } catch (err) {
      setError('Failed to download image. The URL may be invalid or CORS restricted.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Image Downloader (from URL)</h1>
      <p className="tool-description">Download images from any URL directly to your device. Works with publicly accessible images.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ CORS Limitations</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Some websites block direct image downloads due to CORS policies. This tool works best with CDN-hosted images and public resources.
        </p>
      </div>

      <label htmlFor="img-url">Image URL</label>
      <input 
        id="img-url"
        type="url" 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        placeholder="https://example.com/image.jpg"
      />

      <button onClick={handleDownload} disabled={loading || !url}>
        {loading ? 'Downloading...' : 'Download Image'}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {preview && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Preview</h3>
          <img 
            src={preview} 
            alt="Downloaded" 
            style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: '8px' }}
          />
        </div>
      )}

      <RelatedTools category="images" exclude="/tools/image-downloader" />
      <ToolSeo />
    </div>
  )
}
