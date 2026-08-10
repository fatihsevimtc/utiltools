import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function UtmBuilder() {
  const [url, setUrl]         = useState('')
  const [source, setSource]   = useState('')
  const [medium, setMedium]   = useState('')
  const [campaign, setCamp]   = useState('')
  const [term, setTerm]       = useState('')
  const [content, setContent] = useState('')
  const [copied, setCopied]   = useState(false)

  function buildUrl() {
    if (!url.trim()) return ''
    const params = new URLSearchParams()
    if (source)   params.set('utm_source',   source.trim())
    if (medium)   params.set('utm_medium',   medium.trim())
    if (campaign) params.set('utm_campaign', campaign.trim())
    if (term)     params.set('utm_term',     term.trim())
    if (content)  params.set('utm_content',  content.trim())
    const q = params.toString()
    const base = url.trim().replace(/\?$/, '')
    return q ? `${base}${base.includes('?') ? '&' : '?'}${q}` : base
  }

  const result = buildUrl()

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const fields = [
    { label: 'Campaign Source *', placeholder: 'google, newsletter…',  value: source,   set: setSource },
    { label: 'Campaign Medium *', placeholder: 'cpc, email, social…',  value: medium,   set: setMedium },
    { label: 'Campaign Name *',   placeholder: 'spring_sale…',         value: campaign, set: setCamp },
    { label: 'Campaign Term',     placeholder: 'paid keyword…',        value: term,     set: setTerm },
    { label: 'Campaign Content',  placeholder: 'logolink, banner…',    value: content,  set: setContent },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>UTM Builder</h1>
      <p className="tool-description">
        Build UTM-tagged URLs for tracking campaign traffic in Google Analytics and other analytics platforms.
      </p>

      <label htmlFor="utm-url">Destination URL</label>
      <input id="utm-url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" style={{ width: '100%' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
        {fields.map(f => (
          <div key={f.label}>
            <label htmlFor={`utm-${f.label}`}>{f.label}</label>
            <input id={`utm-${f.label}`} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} />
          </div>
        ))}
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Generated URL</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy URL'}</button>
          </div>
          <div className="code-block" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{result}</div>
        </div>
      )}

      <RelatedTools category="seo" exclude="/tools/utm-builder" />
      <ToolSeo />
    </div>
  )
}
