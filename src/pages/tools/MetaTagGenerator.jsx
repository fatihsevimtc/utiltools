import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

export default function MetaTagGenerator() {
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [keywords, setKeywords] = useState('')
  const [url, setUrl]           = useState('')
  const [image, setImage]       = useState('')
  const [siteName, setSiteName] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [copied, setCopied]     = useState(false)

  const titleLen = title.length
  const descLen  = desc.length

  const tags = [
    `<!-- Primary Meta Tags -->`,
    `<title>${title || 'Page Title'}</title>`,
    `<meta name="title" content="${title || 'Page Title'}" />`,
    desc      ? `<meta name="description" content="${desc}" />` : null,
    keywords  ? `<meta name="keywords" content="${keywords}" />` : null,
    ``,
    `<!-- Open Graph / Facebook -->`,
    `<meta property="og:type" content="website" />`,
    url       ? `<meta property="og:url" content="${url}" />` : null,
    `<meta property="og:title" content="${title || 'Page Title'}" />`,
    desc      ? `<meta property="og:description" content="${desc}" />` : null,
    image     ? `<meta property="og:image" content="${image}" />` : null,
    siteName  ? `<meta property="og:site_name" content="${siteName}" />` : null,
    ``,
    `<!-- Twitter -->`,
    `<meta property="twitter:card" content="summary_large_image" />`,
    url       ? `<meta property="twitter:url" content="${url}" />` : null,
    `<meta property="twitter:title" content="${title || 'Page Title'}" />`,
    desc      ? `<meta property="twitter:description" content="${desc}" />` : null,
    image     ? `<meta property="twitter:image" content="${image}" />` : null,
    twitterHandle ? `<meta property="twitter:site" content="@${twitterHandle.replace('@','')}" />` : null,
  ].filter(l => l !== null).join('\n')

  function copy() {
    navigator.clipboard.writeText(tags).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const titleColor = titleLen > 60 ? 'var(--danger)' : titleLen > 50 ? 'var(--warning)' : 'var(--success)'
  const descColor  = descLen > 160 ? 'var(--danger)' : descLen > 140 ? 'var(--warning)' : descLen > 0 ? 'var(--success)' : 'var(--muted)'

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Meta Tag Generator</h1>
      <p className="tool-description">Generate SEO meta tags, Open Graph, and Twitter Card tags for any page.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="mt-title">Page title</label>
            <span style={{ fontSize: '0.78rem', color: titleColor }}>{titleLen}/60</span>
          </div>
          <input id="mt-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Page" />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="mt-desc">Description</label>
            <span style={{ fontSize: '0.78rem', color: descColor }}>{descLen}/160</span>
          </div>
          <textarea id="mt-desc" value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="A short description shown in search results and social previews."
            style={{ minHeight: 80 }} />
        </div>

        <div>
          <label htmlFor="mt-kw">Keywords (comma-separated)</label>
          <input id="mt-kw" type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="seo, tools, meta tags" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="mt-url">Canonical URL</label>
            <input id="mt-url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" />
          </div>
          <div>
            <label htmlFor="mt-site">Site name</label>
            <input id="mt-site" type="text" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="My Site" />
          </div>
        </div>

        <div>
          <label htmlFor="mt-img">OG Image URL</label>
          <input id="mt-img" type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/og-image.png (1200×630 recommended)" />
        </div>

        <div>
          <label htmlFor="mt-tw">Twitter handle (optional)</label>
          <input id="mt-tw" type="text" value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} placeholder="@yourhandle" />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>Generated tags</label>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
        </div>
        <div className="code-block" style={{ fontSize: '0.8rem' }}>{tags}</div>
      </div>
          <ToolSeo />
    </div>
  )
}
