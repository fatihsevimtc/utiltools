import { useState } from 'react'
import BackBar from '../../components/BackBar'

function optimizeSVG(svg) {
  return svg
    // Remove XML declaration
    .replace(/<\?xml[^>]*\?>/g, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove empty lines and excessive whitespace
    .replace(/\n\s*\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    // Remove unnecessary whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove default values
    .replace(/\s*fill="black"/g, '')
    .replace(/\s*stroke="none"/g, '')
    .replace(/\s*fill-rule="nonzero"/g, '')
    .replace(/\s*xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, '')
    // Remove empty attributes
    .replace(/\s+\w+=""/g, '')
    // Remove inkscape/sodipodi namespaces
    .replace(/\s*xmlns:inkscape="[^"]*"/g, '')
    .replace(/\s*xmlns:sodipodi="[^"]*"/g, '')
    .replace(/\s*inkscape:[^=]+="[^"]*"/g, '')
    .replace(/\s*sodipodi:[^=]+="[^"]*"/g, '')
    // Remove <metadata> blocks
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    // Remove <defs> if empty
    .replace(/<defs\s*\/>/g, '')
    .replace(/<defs>\s*<\/defs>/g, '')
    .trim()
}

export default function SvgOptimizer() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function optimize() {
    setOutput(optimizeSVG(input))
  }

  const saved = input.length > 0 && output.length > 0
    ? Math.round((1 - output.length / input.length) * 100)
    : 0

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function download() {
    const blob = new Blob([output], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'optimized.svg'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>SVG Optimizer</h1>
      <p className="tool-description">
        Remove comments, metadata, empty attributes, and Inkscape/Sodipodi namespaces to shrink SVG files.
      </p>

      <label htmlFor="svgo-input">Input SVG</label>
      <textarea
        id="svgo-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput('') }}
        placeholder="<svg xmlns=...>...</svg>"
        style={{ minHeight: 180, fontFamily: 'monospace', fontSize: '0.82rem' }}
      />

      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={optimize}>Optimize</button>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>
              Optimized output
              <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                {saved}% smaller ({output.length} chars)
              </span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
              <button className="btn btn-sm" onClick={download}>⬇ Download</button>
            </div>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', maxHeight: 260, overflow: 'auto' }}>{output}</div>

          {/* Preview */}
          <div style={{ marginTop: '1rem' }}>
            <label>Preview</label>
            <div
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', display: 'flex', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
