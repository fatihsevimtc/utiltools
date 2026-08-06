import { useState } from 'react'
import BackBar from '../../components/BackBar'

const FREQ = ['always','hourly','daily','weekly','monthly','yearly','never']

export default function SitemapGenerator() {
  const [urls, setUrls] = useState([
    { loc: '', priority: '1.0', changefreq: 'weekly', lastmod: new Date().toISOString().slice(0,10) }
  ])
  const [copied, setCopied] = useState(false)

  function addUrl() {
    setUrls(u => [...u, { loc: '', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().slice(0,10) }])
  }
  function removeUrl(i) { setUrls(u => u.filter((_,idx) => idx !== i)) }
  function update(i, field, value) {
    setUrls(u => u.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  function bulkAdd(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const newUrls = lines.map(loc => ({ loc, priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().slice(0,10) }))
    setUrls(u => [...u, ...newUrls])
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.filter(u => u.loc).map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  function copy() {
    navigator.clipboard.writeText(xml).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }
  function download() {
    const blob = new Blob([xml], { type: 'application/xml' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'sitemap.xml'; a.click()
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Sitemap Generator</h1>
      <p className="tool-description">Build an XML sitemap file to help search engines discover and index your pages.</p>

      <details style={{ marginBottom: '1rem' }}>
        <summary>Bulk add URLs</summary>
        <div style={{ padding: '0.75rem 1rem' }}>
          <label>Paste one URL per line</label>
          <textarea style={{ minHeight: 100 }} placeholder={'https://example.com/\nhttps://example.com/about\nhttps://example.com/blog'}
            onBlur={e => { if (e.target.value) { bulkAdd(e.target.value); e.target.value = '' } }} />
        </div>
      </details>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        {urls.map((u, i) => (
          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="url" value={u.loc} onChange={e => update(i, 'loc', e.target.value)}
                placeholder="https://example.com/page" style={{ flex: 1 }} />
              {urls.length > 1 && <button className="btn btn-ghost btn-sm" onClick={() => removeUrl(i)}>✕</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label>Last modified</label>
                <input type="date" value={u.lastmod} onChange={e => update(i, 'lastmod', e.target.value)} />
              </div>
              <div>
                <label>Change freq</label>
                <select value={u.changefreq} onChange={e => update(i, 'changefreq', e.target.value)}>
                  {FREQ.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={u.priority} onChange={e => update(i, 'priority', e.target.value)}>
                  {['1.0','0.9','0.8','0.7','0.6','0.5','0.4','0.3','0.2','0.1'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={addUrl}>+ Add URL</button>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>sitemap.xml <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({urls.filter(u=>u.loc).length} URLs)</span></label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
            <button className="btn btn-sm" onClick={download}>Download</button>
          </div>
        </div>
        <div className="code-block" style={{ fontSize: '0.78rem' }}>{xml}</div>
      </div>
    </div>
  )
}
