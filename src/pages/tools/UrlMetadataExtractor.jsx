import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function UrlMetadataExtractor() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState(null)
  const [error, setError] = useState('')

  async function extractMetadata() {
    if (!url) return
    
    setLoading(true)
    setError('')
    setMetadata(null)

    try {
      const response = await fetch(url)
      const html = await response.text()
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const getMetaContent = (name) => {
        const meta = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
        return meta?.getAttribute('content') || null
      }

      const extracted = {
        title: doc.querySelector('title')?.textContent || 'No title found',
        description: getMetaContent('description') || getMetaContent('og:description') || 'No description found',
        keywords: getMetaContent('keywords') || 'No keywords found',
        ogImage: getMetaContent('og:image') || 'No OG image found',
        ogTitle: getMetaContent('og:title') || 'No OG title found',
        twitterCard: getMetaContent('twitter:card') || 'No Twitter card found',
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'No canonical URL found',
        favicon: doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href') || 'No favicon found',
      }

      setMetadata(extracted)
    } catch (err) {
      setError('Failed to fetch URL metadata. CORS restrictions may prevent extraction.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>URL Metadata Extractor</h1>
      <p className="tool-description">Extract title, description, Open Graph tags, and other metadata from any URL.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ CORS Limitations</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Many websites block cross-origin requests. This tool works best with sites that allow CORS or via a proxy.
        </p>
      </div>

      <label htmlFor="meta-url">Website URL</label>
      <input 
        id="meta-url"
        type="url" 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        placeholder="https://example.com"
      />

      <button onClick={extractMetadata} disabled={loading || !url}>
        {loading ? 'Extracting...' : 'Extract Metadata'}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {metadata && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Extracted Metadata</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{ wordBreak: 'break-word' }}>
                  {key === 'ogImage' && value !== 'No OG image found' ? (
                    <>
                      <img src={value} alt="OG" style={{ maxWidth: '300px', marginBottom: '0.5rem', border: '1px solid var(--border)', borderRadius: '4px' }} />
                      <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>{value}</div>
                    </>
                  ) : (
                    value
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools category="seo" exclude="/tools/url-metadata-extractor" />
      <ToolSeo />
    </div>
  )
}
