import { useState } from 'react'
import BackBar from '../../components/BackBar'

const PRESETS = {
  'Allow all': `User-agent: *\nAllow: /`,
  'Block all': `User-agent: *\nDisallow: /`,
  'Block AI bots': `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ChatGPT-User\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /`,
  'Block bad bots': `User-agent: *\nAllow: /\n\nUser-agent: SemrushBot\nDisallow: /\n\nUser-agent: AhrefsBot\nDisallow: /\n\nUser-agent: MJ12bot\nDisallow: /\n\nUser-agent: DotBot\nDisallow: /`,
}

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState([
    { agent: '*', disallow: '', allow: '/' }
  ])
  const [sitemap, setSitemap] = useState('')
  const [crawlDelay, setCrawlDelay] = useState('')
  const [custom, setCustom] = useState('')
  const [mode, setMode] = useState('builder') // 'builder' | 'custom'
  const [copied, setCopied] = useState(false)

  function addRule() {
    setRules(r => [...r, { agent: '', disallow: '', allow: '' }])
  }
  function removeRule(i) {
    setRules(r => r.filter((_, idx) => idx !== i))
  }
  function updateRule(i, field, value) {
    setRules(r => r.map((rule, idx) => idx === i ? { ...rule, [field]: value } : rule))
  }

  const generated = mode === 'custom' ? custom : (() => {
    const lines = []
    rules.forEach(r => {
      if (!r.agent) return
      lines.push(`User-agent: ${r.agent}`)
      if (r.allow)    lines.push(`Allow: ${r.allow}`)
      if (r.disallow) lines.push(`Disallow: ${r.disallow}`)
      if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`)
      lines.push('')
    })
    if (sitemap) lines.push(`Sitemap: ${sitemap}`)
    return lines.join('\n').trim()
  })()

  function copy() {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function download() {
    const blob = new Blob([generated], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'robots.txt'
    a.click()
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>robots.txt Generator</h1>
      <p className="tool-description">Build a robots.txt file to control how search engines and bots crawl your site.</p>

      <div className="chip-group">
        <button className={`chip ${mode === 'builder' ? 'active' : ''}`} onClick={() => setMode('builder')}>Builder</button>
        <button className={`chip ${mode === 'custom' ? 'active' : ''}`} onClick={() => setMode('custom')}>Manual</button>
      </div>

      {mode === 'builder' ? (
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Quick presets</p>
            <div className="chip-group">
              {Object.keys(PRESETS).map(p => (
                <button key={p} className="chip" onClick={() => { setMode('custom'); setCustom(PRESETS[p]) }}>{p}</button>
              ))}
            </div>
          </div>

          {rules.map((r, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Rule {i + 1}</span>
                {rules.length > 1 && <button className="btn btn-ghost btn-sm" onClick={() => removeRule(i)}>Remove</button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>User-agent</label>
                  <input type="text" value={r.agent} onChange={e => updateRule(i, 'agent', e.target.value)} placeholder="* (all bots)" />
                </div>
                <div>
                  <label>Allow</label>
                  <input type="text" value={r.allow} onChange={e => updateRule(i, 'allow', e.target.value)} placeholder="/" />
                </div>
                <div>
                  <label>Disallow</label>
                  <input type="text" value={r.disallow} onChange={e => updateRule(i, 'disallow', e.target.value)} placeholder="/admin/" />
                </div>
              </div>
            </div>
          ))}

          <button className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }} onClick={addRule}>+ Add rule</button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Sitemap URL (optional)</label>
              <input type="url" value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
            </div>
            <div>
              <label>Crawl delay (seconds)</label>
              <input type="number" value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} placeholder="10" />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <label>Edit robots.txt directly</label>
          <textarea value={custom} onChange={e => setCustom(e.target.value)} style={{ minHeight: 200, fontFamily: 'monospace' }}
            placeholder={'User-agent: *\nAllow: /'} />
        </div>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>robots.txt</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
            <button className="btn btn-sm" onClick={download}>Download</button>
          </div>
        </div>
        <div className="code-block" style={{ fontSize: '0.85rem' }}>{generated}</div>
      </div>
    </div>
  )
}
