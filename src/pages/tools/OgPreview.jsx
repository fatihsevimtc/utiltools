import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function OgPreview() {
  const [title, setTitle]   = useState('')
  const [desc, setDesc]     = useState('')
  const [image, setImage]   = useState('')
  const [url, setUrl]       = useState('')
  const [platform, setPlatform] = useState('twitter')

  const displayTitle = title || 'Page Title'
  const displayDesc  = desc  || 'A description of this page will appear here when shared on social media.'
  const displayUrl   = url   || 'example.com'
  const displayDomain = displayUrl.replace(/^https?:\/\//, '').split('/')[0]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Open Graph Preview</h1>
      <p className="tool-description">Preview how your page will look when shared on Twitter/X, LinkedIn, and Facebook.</p>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label htmlFor="og-title">Title</label>
          <input id="og-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Page Title" />
        </div>
        <div>
          <label htmlFor="og-desc">Description</label>
          <textarea id="og-desc" value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="A short description of the page…" style={{ minHeight: 80 }} />
        </div>
        <div>
          <label htmlFor="og-img">Image URL</label>
          <input id="og-img" type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/og.png" />
        </div>
        <div>
          <label htmlFor="og-url">Page URL</label>
          <input id="og-url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" />
        </div>
      </div>

      <div className="chip-group">
        {['twitter','linkedin','facebook'].map(p => (
          <button key={p} className={`chip ${platform === p ? 'active' : ''}`} onClick={() => setPlatform(p)}>
            {p === 'twitter' ? 'Twitter / X' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Twitter/X card */}
      {platform === 'twitter' && (
        <div style={{ marginTop: '1rem', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', maxWidth: 500, background: 'var(--surface)' }}>
          {image && <img src={image} alt="og" style={{ width: '100%', height: 261, objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display='none'} />}
          {!image && <div style={{ width: '100%', height: 261, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>No image</div>}
          <div style={{ padding: '0.75rem 1rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.25rem' }}>{displayDomain}</p>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{displayTitle}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{displayDesc}</p>
          </div>
        </div>
      )}

      {/* LinkedIn card */}
      {platform === 'linkedin' && (
        <div style={{ marginTop: '1rem', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', maxWidth: 520, background: 'var(--surface)' }}>
          {image && <img src={image} alt="og" style={{ width: '100%', height: 272, objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display='none'} />}
          {!image && <div style={{ width: '100%', height: 272, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>No image</div>}
          <div style={{ padding: '0.75rem 1rem', background: 'var(--surface2)' }}>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{displayTitle}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{displayDomain}</p>
          </div>
        </div>
      )}

      {/* Facebook card */}
      {platform === 'facebook' && (
        <div style={{ marginTop: '1rem', border: '1px solid var(--border)', overflow: 'hidden', maxWidth: 520, background: 'var(--surface)' }}>
          {image && <img src={image} alt="og" style={{ width: '100%', height: 272, objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display='none'} />}
          {!image && <div style={{ width: '100%', height: 272, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>No image</div>}
          <div style={{ padding: '0.75rem 1rem', background: '#f0f2f5', color: '#1c1e21' }}>
            <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#606770', marginBottom: '0.2rem' }}>{displayDomain}</p>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{displayTitle}</p>
            <p style={{ color: '#606770', fontSize: '0.85rem' }}>{displayDesc}</p>
          </div>
        </div>
      )}
    </div>
  )
}
