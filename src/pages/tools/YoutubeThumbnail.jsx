import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [thumbnails, setThumbnails] = useState([])
  const [error, setError] = useState('')

  function extractVideoId(input) {
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]

    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) return match[1]
    }

    return null
  }

  function getThumbnails() {
    if (!url.trim()) {
      setError('Please enter a YouTube URL or video ID')
      return
    }

    const id = extractVideoId(url.trim())
    if (!id) {
      setError('Invalid YouTube URL or video ID')
      return
    }

    setVideoId(id)
    setError('')

    setThumbnails([
      {
        quality: 'Maximum Quality',
        size: '1280×720',
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      },
      {
        quality: 'Standard Quality',
        size: '640×480',
        url: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
      },
      {
        quality: 'High Quality',
        size: '480×360',
        url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      },
      {
        quality: 'Medium Quality',
        size: '320×180',
        url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      },
      {
        quality: 'Default',
        size: '120×90',
        url: `https://img.youtube.com/vi/${id}/default.jpg`,
      },
    ])
  }

  function downloadThumbnail(url, quality) {
    const link = document.createElement('a')
    link.href = url
    link.download = `youtube-${videoId}-${quality.replace(/\s+/g, '-').toLowerCase()}.jpg`
    link.target = '_blank'
    link.click()
  }

  function reset() {
    setUrl('')
    setVideoId('')
    setThumbnails([])
    setError('')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>YouTube Thumbnail Downloader</h1>
      <p className="tool-description">
        Download YouTube video thumbnails in all available qualities — paste a URL or video ID.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="yt-url">YouTube URL or Video ID</label>
        <input
          id="yt-url"
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && getThumbnails()}
          placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
          style={{ marginBottom: '0.5rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button className="btn" onClick={getThumbnails}>
          🖼️ Get Thumbnails
        </button>
        {thumbnails.length > 0 && (
          <button className="btn btn-ghost" onClick={reset}>
            ↻ Reset
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgb(248, 113, 113)',
          borderRadius: 8,
          color: 'rgb(248, 113, 113)',
          marginBottom: '1rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {videoId && (
        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          Video ID: <code style={{ padding: '0.2rem 0.4rem', backgroundColor: 'var(--card-bg)', borderRadius: 4 }}>{videoId}</code>
        </p>
      )}

      {thumbnails.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{thumb.quality}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                    {thumb.size}
                  </p>
                </div>
                <button
                  className="btn"
                  onClick={() => downloadThumbnail(thumb.url, thumb.quality)}
                  style={{ fontSize: '0.85rem' }}
                >
                  ⬇ Download
                </button>
              </div>
              <img
                src={thumb.url}
                alt={thumb.quality}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div style={{ display: 'none', padding: '1rem', textAlign: 'center', color: 'var(--muted)' }}>
                ⚠️ This quality may not be available for this video
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 8 }}>
        <h3>Supported URL formats:</h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
          <li>https://youtube.com/watch?v=VIDEO_ID</li>
          <li>https://youtu.be/VIDEO_ID</li>
          <li>https://youtube.com/embed/VIDEO_ID</li>
          <li>VIDEO_ID (11 characters)</li>
        </ul>
      </div>

      <RelatedTools
        tools={[
          { icon: '📷', name: 'QR Generator', path: '/tools/qr-generator' },
          { icon: '🖼️', name: 'Image Resizer', path: '/tools/image-resizer' },
          { icon: '🗜️', name: 'Image Compressor', path: '/tools/image-compressor' },
          { icon: '✂️', name: 'Image Cropper', path: '/tools/image-cropper' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
