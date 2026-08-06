import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6']

export default function FlexboxPlayground() {
  const [direction, setDirection]       = useState('row')
  const [wrap, setWrap]                 = useState('wrap')
  const [justifyContent, setJustify]    = useState('flex-start')
  const [alignItems, setAlign]          = useState('stretch')
  const [alignContent, setAlignContent] = useState('normal')
  const [gap, setGap]                   = useState(8)
  const [items, setItems]               = useState(5)
  const [copied, setCopied]             = useState(false)

  const css = [
    `display: flex;`,
    `flex-direction: ${direction};`,
    `flex-wrap: ${wrap};`,
    `justify-content: ${justifyContent};`,
    `align-items: ${alignItems};`,
    alignContent !== 'normal' ? `align-content: ${alignContent};` : null,
    `gap: ${gap}px;`,
  ].filter(Boolean).join('\n')

  function copy() {
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent,
    alignItems,
    alignContent,
    gap,
    minHeight: 160,
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: 10,
    padding: 12,
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Flexbox Playground</h1>
      <p className="tool-description">Experiment with CSS Flexbox properties and copy the generated CSS.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          ['flex-direction', direction, setDirection, ['row','row-reverse','column','column-reverse']],
          ['flex-wrap', wrap, setWrap, ['nowrap','wrap','wrap-reverse']],
          ['justify-content', justifyContent, setJustify, ['flex-start','flex-end','center','space-between','space-around','space-evenly']],
          ['align-items', alignItems, setAlign, ['stretch','flex-start','flex-end','center','baseline']],
          ['align-content', alignContent, setAlignContent, ['normal','flex-start','flex-end','center','space-between','space-around','stretch']],
        ].map(([label, value, setter, options]) => (
          <div key={label}>
            <label style={{ fontSize: '0.82rem' }}>{label}</label>
            <select value={value} onChange={e => setter(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label style={{ fontSize: '0.82rem' }}>gap: {gap}px</label>
          <input type="range" min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Items: {items}</label>
          <input type="range" min={1} max={12} value={items} onChange={e => setItems(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
      </div>

      {/* Preview */}
      <div style={containerStyle}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} style={{
            background: COLORS[i % COLORS.length],
            color: '#fff', borderRadius: 6,
            padding: '0.5rem 0.9rem',
            fontWeight: 700, fontSize: '0.85rem',
            minWidth: 40, textAlign: 'center',
          }}>
            {i + 1}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>CSS output</label>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
        <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{css}</div>
      </div>
      <RelatedTools category="design" exclude="/tools/flexbox-playground" />
          <ToolSeo />
    </div>
  )
}
