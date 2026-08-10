import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TextPadder() {
  const [text, setText] = useState('')
  const [direction, setDirection] = useState('left') // left | right | both
  const [padChar, setPadChar] = useState(' ')
  const [targetLen, setTargetLen] = useState(20)
  const [perLine, setPerLine] = useState(true)
  const [copied, setCopied] = useState(false)

  function padLine(line) {
    const pc = padChar || ' '
    const len = Math.max(line.length, targetLen)
    const needed = len - line.length
    if (needed <= 0) return line
    const padStr = pc.repeat(Math.ceil(needed / pc.length)).slice(0, needed)
    if (direction === 'left') return padStr + line
    if (direction === 'right') return line + padStr
    // both: split pad evenly
    const left = Math.floor(needed / 2)
    const right = needed - left
    return pc.repeat(Math.ceil(left / pc.length)).slice(0, left) + line + pc.repeat(Math.ceil(right / pc.length)).slice(0, right)
  }

  const result = (() => {
    if (!text) return ''
    if (perLine) {
      return text.split('\n').map(padLine).join('\n')
    }
    return padLine(text)
  })()

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Text Padder</h1>
      <p className="tool-description">
        Left-pad, right-pad, or center-align text to a target length using any character. Useful for monospace output, code generation, and formatting tables.
      </p>

      <label htmlFor="tp-input">Input text</label>
      <textarea
        id="tp-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="hello&#10;world&#10;test"
        style={{ minHeight: 120, fontFamily: 'monospace' }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label>Pad direction</label>
          <select value={direction} onChange={e => setDirection(e.target.value)}>
            <option value="left">Left (prepend)</option>
            <option value="right">Right (append)</option>
            <option value="both">Both (centre)</option>
          </select>
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label htmlFor="tp-char">Pad character</label>
          <input id="tp-char" value={padChar} onChange={e => setPadChar(e.target.value || ' ')} maxLength={8} placeholder="Space" />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label htmlFor="tp-len">Target length</label>
          <input
            id="tp-len"
            type="number"
            min={1}
            max={500}
            value={targetLen}
            onChange={e => setTargetLen(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.6rem' }}>
        <input type="checkbox" checked={perLine} onChange={e => setPerLine(e.target.checked)} />
        Apply to each line independently
      </label>

      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Result (monospace)</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{ minHeight: 120, background: 'var(--surface)', cursor: 'default', fontFamily: 'monospace' }}
          />
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/text-padder" />
      <ToolSeo />
    </div>
  )
}
