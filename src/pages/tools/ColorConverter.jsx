import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return { r, g, b }
}
function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255
  const max=Math.max(r,g,b), min=Math.min(r,g,b)
  let h,s,l=(max+min)/2
  if(max===min){h=s=0}else{
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min)
    switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break}
    h/=6
  }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)}
}
function hslToRgb(h,s,l) {
  s/=100;l/=100
  const k=n=>(n+h/30)%12, a=s*Math.min(l,1-l)
  const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)))
  return {r:Math.round(f(0)*255),g:Math.round(f(8)*255),b:Math.round(f(4)*255)}
}
function rgbToHex(r,g,b) {
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#6c63ff')

  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  function fromRgb(field, val) {
    const v = Math.max(0, Math.min(255, Number(val)))
    const updated = { ...rgb, [field]: v }
    setHex(rgbToHex(updated.r, updated.g, updated.b))
  }
  function fromHsl(field, val) {
    const limits = { h: 360, s: 100, l: 100 }
    const v = Math.max(0, Math.min(limits[field], Number(val)))
    const updated = { ...hsl, [field]: v }
    const r2 = hslToRgb(updated.h, updated.s, updated.l)
    setHex(rgbToHex(r2.r, r2.g, r2.b))
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Color Converter</h1>
      <p className="tool-description">Convert between HEX, RGB, and HSL color formats.</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <input type="color" value={hex} onChange={e => setHex(e.target.value)}
          style={{ width: 64, height: 64, border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', background: 'none', padding: 0 }} />
        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius)', background: hex, border: '2px solid var(--border)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{hex.toUpperCase()}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div>
          <label>HEX</label>
          <input type="text" value={hex} onChange={e => { if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setHex(e.target.value) }} style={{ fontFamily: 'monospace' }} />
        </div>
        {[['r','R'],['g','G'],['b','B']].map(([k,l]) => (
          <div key={k}>
            <label>RGB — {l} (0–255)</label>
            <input type="number" min={0} max={255} value={rgb[k]} onChange={e => fromRgb(k, e.target.value)} />
          </div>
        ))}
        <div>
          <label>HSL — Hue (0–360)</label>
          <input type="number" min={0} max={360} value={hsl.h} onChange={e => fromHsl('h', e.target.value)} />
        </div>
        <div>
          <label>HSL — Saturation (0–100)</label>
          <input type="number" min={0} max={100} value={hsl.s} onChange={e => fromHsl('s', e.target.value)} />
        </div>
        <div>
          <label>HSL — Lightness (0–100)</label>
          <input type="number" min={0} max={100} value={hsl.l} onChange={e => fromHsl('l', e.target.value)} />
        </div>
      </div>
      <RelatedTools category="design" exclude="/tools/color-converter" />
          <ToolSeo />
    </div>
  )
}
