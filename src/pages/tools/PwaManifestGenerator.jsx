import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const DISPLAYS    = ['standalone', 'fullscreen', 'minimal-ui', 'browser']
const ORIENTATIONS = ['any', 'portrait', 'landscape', 'portrait-primary', 'landscape-primary']
const CATEGORIES  = ['', 'business', 'education', 'entertainment', 'finance', 'fitness', 'food', 'games', 'government', 'health', 'kids', 'lifestyle', 'medical', 'music', 'navigation', 'news', 'personalization', 'photo', 'politics', 'productivity', 'security', 'shopping', 'social', 'sports', 'travel', 'utilities', 'weather']

const ICON_SIZES = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512']

const DEFAULT_ICONS = ICON_SIZES.map(size => ({
  src: `/icons/icon-${size}.png`,
  sizes: size,
  type: 'image/png',
  purpose: 'any maskable',
}))

export default function PwaManifestGenerator() {
  const [name,        setName]        = useState('My Awesome App')
  const [shortName,   setShortName]   = useState('MyApp')
  const [description, setDescription] = useState('A progressive web app.')
  const [startUrl,    setStartUrl]    = useState('/')
  const [display,     setDisplay]     = useState('standalone')
  const [orientation, setOrientation] = useState('any')
  const [themeColor,  setThemeColor]  = useState('#3b82f6')
  const [bgColor,     setBgColor]     = useState('#ffffff')
  const [category,    setCategory]    = useState('utilities')
  const [lang,        setLang]        = useState('en')
  const [scope,       setScope]       = useState('/')
  const [includeScreenshots, setIncludeScreenshots] = useState(false)
  const [copied, setCopied] = useState(false)

  const manifest = useMemo(() => {
    const obj = {
      name,
      short_name: shortName,
      description,
      start_url: startUrl,
      scope,
      display,
      orientation,
      theme_color: themeColor,
      background_color: bgColor,
      lang,
      icons: DEFAULT_ICONS,
    }
    if (category) obj.categories = [category]
    if (includeScreenshots) {
      obj.screenshots = [
        { src: '/screenshots/screenshot1.png', sizes: '1280x720', type: 'image/png', label: 'App home screen' },
        { src: '/screenshots/screenshot2.png', sizes: '720x1280', type: 'image/png', form_factor: 'narrow', label: 'App on mobile' },
      ]
    }
    return JSON.stringify(obj, null, 2)
  }, [name, shortName, description, startUrl, display, orientation, themeColor, bgColor, category, lang, scope, includeScreenshots])

  function copy() {
    navigator.clipboard.writeText(manifest).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function download() {
    const blob = new Blob([manifest], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'manifest.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function Field({ label, children }) {
    return (
      <div>
        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{label}</label>
        {children}
      </div>
    )
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>PWA Manifest Generator</h1>
      <p className="tool-description">
        Generate a <code>manifest.json</code> for your Progressive Web App with all standard fields, icon sizes, and optional screenshot metadata.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <Field label="App Name">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="My Awesome App" />
        </Field>
        <Field label="Short Name (home screen)">
          <input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="MyApp" maxLength={12} />
        </Field>
        <Field label="Description">
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description." />
        </Field>
        <Field label="Start URL">
          <input value={startUrl} onChange={e => setStartUrl(e.target.value)} placeholder="/" />
        </Field>
        <Field label="Scope">
          <input value={scope} onChange={e => setScope(e.target.value)} placeholder="/" />
        </Field>
        <Field label="Language">
          <input value={lang} onChange={e => setLang(e.target.value)} placeholder="en" maxLength={10} />
        </Field>
        <Field label="Display Mode">
          <select value={display} onChange={e => setDisplay(e.target.value)}>
            {DISPLAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Orientation">
          <select value={orientation} onChange={e => setOrientation(e.target.value)}>
            {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c || '(none)'}</option>)}
          </select>
        </Field>
        <Field label="Theme Color">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ width: 44, height: 36, padding: 2, cursor: 'pointer' }} />
            <input value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ fontFamily: 'monospace', flex: 1 }} />
          </div>
        </Field>
        <Field label="Background Color">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 44, height: 36, padding: 2, cursor: 'pointer' }} />
            <input value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ fontFamily: 'monospace', flex: 1 }} />
          </div>
        </Field>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', userSelect: 'none' }}>
        <input type="checkbox" checked={includeScreenshots} onChange={e => setIncludeScreenshots(e.target.checked)} />
        Include screenshot entries (for rich install UI)
      </label>

      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label style={{ marginBottom: 0 }}>manifest.json</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={download}>⬇ Download</button>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
        </div>
        <pre className="code-block" style={{ whiteSpace: 'pre', overflowX: 'auto', fontSize: '0.85rem', lineHeight: 1.55, maxHeight: 480 }}>
          {manifest}
        </pre>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        <strong>How to use:</strong> Save as <code>manifest.json</code> in your public folder, then add{' '}
        <code>{'<link rel="manifest" href="/manifest.json">'}</code> inside your HTML <code>&lt;head&gt;</code>.
        Replace icon paths with actual images at the specified sizes.
      </div>

      <RelatedTools tools={[
        { icon: '🏷️', name: 'Meta Tag Generator', path: '/tools/meta-tag-generator' },
        { icon: '⭐', name: 'Favicon Generator',   path: '/tools/favicon-generator' },
        { icon: '🤖', name: 'robots.txt',          path: '/tools/robots-txt' },
        { icon: '🗺️', name: 'Schema Markup',       path: '/tools/schema-markup' },
      ]} />
      <ToolSeo />
    </div>
  )
}
