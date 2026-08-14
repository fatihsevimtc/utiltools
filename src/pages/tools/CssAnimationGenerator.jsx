import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const PRESETS = [
  { name: 'Fade In',       from: 'opacity: 0;',                             to: 'opacity: 1;' },
  { name: 'Slide In Left', from: 'transform: translateX(-60px); opacity:0;', to: 'transform: translateX(0); opacity:1;' },
  { name: 'Slide In Up',   from: 'transform: translateY(40px); opacity:0;',  to: 'transform: translateY(0); opacity:1;' },
  { name: 'Scale In',      from: 'transform: scale(0.5); opacity:0;',        to: 'transform: scale(1); opacity:1;' },
  { name: 'Rotate In',     from: 'transform: rotate(-180deg); opacity:0;',   to: 'transform: rotate(0); opacity:1;' },
  { name: 'Bounce',        from: 'transform: translateY(0);',                to: 'transform: translateY(-20px);' },
  { name: 'Shake',         from: 'transform: translateX(-8px);',             to: 'transform: translateX(8px);' },
  { name: 'Pulse',         from: 'transform: scale(1);',                     to: 'transform: scale(1.08);' },
  { name: 'Spin',          from: 'transform: rotate(0deg);',                 to: 'transform: rotate(360deg);' },
  { name: 'Flash',         from: 'opacity: 1;',                              to: 'opacity: 0;' },
]

const TIMING_FNS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.68,-0.55,0.27,1.55)']
const FILL_MODES = ['none', 'forwards', 'backwards', 'both']
const DIRECTIONS  = ['normal', 'reverse', 'alternate', 'alternate-reverse']

export default function CssAnimationGenerator() {
  const [name, setName]           = useState('my-animation')
  const [from, setFrom]           = useState(PRESETS[0].from)
  const [to, setTo]               = useState(PRESETS[0].to)
  const [duration, setDuration]   = useState(0.6)
  const [delay, setDelay]         = useState(0)
  const [timingFn, setTimingFn]   = useState('ease')
  const [iterCount, setIterCount] = useState('1')
  const [direction, setDirection] = useState('normal')
  const [fillMode, setFillMode]   = useState('forwards')
  const [selector, setSelector]   = useState('.animated-element')
  const [copied, setCopied]       = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  function applyPreset(p) {
    setFrom(p.from)
    setTo(p.to)
  }

  const css = useMemo(() => {
    return `@keyframes ${name} {
  from {
    ${from.trim().split(';').filter(Boolean).map(l => '    ' + l.trim() + ';').join('\n').trim()}
  }
  to {
    ${to.trim().split(';').filter(Boolean).map(l => '    ' + l.trim() + ';').join('\n').trim()}
  }
}

${selector} {
  animation: ${name} ${duration}s ${timingFn} ${delay}s ${iterCount} ${direction} ${fillMode};
}`
  }, [name, from, to, duration, delay, timingFn, iterCount, direction, fillMode, selector])

  function copy() {
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Inline style for preview
  const previewStyle = useMemo(() => ({
    animationName: name,
    animationDuration: `${duration}s`,
    animationTimingFunction: timingFn,
    animationDelay: `${delay}s`,
    animationIterationCount: iterCount,
    animationDirection: direction,
    animationFillMode: fillMode,
  }), [name, duration, timingFn, delay, iterCount, direction, fillMode])

  // Build keyframe tag text
  const keyframeTag = `@keyframes ${name} { from { ${from} } to { ${to} } }`

  return (
    <div className="tool-page">
      <BackBar />
      <ToolSeo />
      <h1>CSS Animation Generator</h1>
      <p className="tool-description">
        Build CSS @keyframe animations visually with a live preview. Copy the ready-to-use CSS with one click.
      </p>

      {/* Presets */}
      <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Presets</p>
      <div className="chip-group" style={{ flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {PRESETS.map(p => (
          <button key={p.name} className="chip" onClick={() => applyPreset(p)}>{p.name}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-name">Animation name</label>
          <input id="ca-name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-selector">CSS selector</label>
          <input id="ca-selector" value={selector} onChange={e => setSelector(e.target.value)} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-dur">Duration (s)</label>
          <input id="ca-dur" type="number" min={0.1} max={30} step={0.1} value={duration} onChange={e => setDuration(Number(e.target.value))} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-delay">Delay (s)</label>
          <input id="ca-delay" type="number" min={0} max={30} step={0.1} value={delay} onChange={e => setDelay(Number(e.target.value))} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-timing">Timing function</label>
          <select id="ca-timing" value={timingFn} onChange={e => setTimingFn(e.target.value)}>
            {TIMING_FNS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-iter">Iteration count</label>
          <select id="ca-iter" value={iterCount} onChange={e => setIterCount(e.target.value)}>
            {['1','2','3','infinite'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-dir">Direction</label>
          <select id="ca-dir" value={direction} onChange={e => setDirection(e.target.value)}>
            {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="ca-fill">Fill mode</label>
          <select id="ca-fill" value={fillMode} onChange={e => setFillMode(e.target.value)}>
            {FILL_MODES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="ca-from">From (CSS properties)</label>
          <textarea id="ca-from" rows={4} value={from} onChange={e => setFrom(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </div>
        <div>
          <label htmlFor="ca-to">To (CSS properties)</label>
          <textarea id="ca-to" rows={4} value={to} onChange={e => setTo(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </div>
      </div>

      {/* Preview */}
      <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Live preview</p>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '2rem', display: 'flex', justifyContent: 'center',
        alignItems: 'center', minHeight: 140, marginBottom: '1rem', overflow: 'hidden',
      }}>
        <style>{`@keyframes ${name} { from { ${from} } to { ${to} } }`}</style>
        <div
          key={previewKey}
          style={{
            width: 80, height: 80,
            background: 'var(--accent)',
            borderRadius: 12,
            ...previewStyle,
          }}
        />
      </div>
      <button className="btn btn-ghost" style={{ marginBottom: '1.25rem' }} onClick={() => setPreviewKey(k => k + 1)}>
        ↺ Replay
      </button>

      {/* Code output */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
        <label style={{ marginBottom: 0 }}>Generated CSS</label>
        <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy CSS'}</button>
      </div>
      <pre className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', overflowX: 'auto' }}>{css}</pre>

      <RelatedTools tools={[
        { icon: '🌑', name: 'Box Shadow Generator',   path: '/tools/box-shadow' },
        { icon: '🌈', name: 'Gradient Generator',     path: '/tools/gradient-generator' },
        { icon: '📐', name: 'Flexbox Playground',     path: '/tools/flexbox-playground' },
        { icon: '🎨', name: 'CSS Variables Inspector',path: '/tools/css-variables' },
      ]} />
    </div>
  )
}
