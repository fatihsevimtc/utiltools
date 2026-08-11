import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const STYLES = {
  bold:        { label: '𝗕𝗼𝗹𝗱',        map: [0x1D400, 0x1D41A] },
  italic:      { label: '𝘐𝘵𝘢𝘭𝘪𝘤',      map: [0x1D434, 0x1D44E] },
  boldItalic:  { label: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄', map: [0x1D468, 0x1D482] },
  mono:        { label: '𝚖𝚘𝚗𝚘',         map: [0x1D670, 0x1D68A] },
  wide:        { label: 'Ｗｉｄｅ',        map: [0xFF21, 0xFF41] },
  bubble:      { label: 'Ⓑⓤⓑⓑⓛⓔ',    map: [0x24B6, 0x24D0] },
  square:      { label: '🅂🅀🅄🄰🅁🄴', map: [0x1F130, 0x1F150] },
  fraktur:     { label: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',   map: [0x1D504, 0x1D51E] },
  doubleStr:   { label: '𝔻𝕠𝕦𝕓𝕝𝕖',   map: [0x1D538, 0x1D552] },
  smallCaps:   { label: 'Sᴍᴀʟʟ Cᴀᴘs', map: null },
}

const SMALL_CAPS_MAP = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'

function convert(text, style) {
  if (!text) return ''
  if (style === 'smallCaps') {
    return text.split('').map(c => {
      const lc = c.toLowerCase()
      const idx = lc.charCodeAt(0) - 97
      return idx >= 0 && idx < 26 ? SMALL_CAPS_MAP[idx] : c
    }).join('')
  }
  if (style === 'wide') {
    return text.split('').map(c => {
      const code = c.charCodeAt(0)
      if (code >= 65 && code <= 90) return String.fromCodePoint(STYLES.wide.map[0] + (code - 65))
      if (code >= 97 && code <= 122) return String.fromCodePoint(STYLES.wide.map[1] + (code - 97))
      if (code >= 48 && code <= 57) return String.fromCodePoint(0xFF10 + (code - 48))
      return c
    }).join('')
  }
  if (style === 'bubble') {
    return text.split('').map(c => {
      const code = c.charCodeAt(0)
      if (code >= 65 && code <= 90) return String.fromCodePoint(STYLES.bubble.map[0] + (code - 65))
      if (code >= 97 && code <= 122) return String.fromCodePoint(STYLES.bubble.map[1] + (code - 97))
      if (code >= 48 && code <= 57) return ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨'][code - 48]
      return c
    }).join('')
  }
  const [upBase, loBase] = STYLES[style].map
  return text.split('').map(c => {
    const code = c.charCodeAt(0)
    if (code >= 65 && code <= 90) return String.fromCodePoint(upBase + (code - 65))
    if (code >= 97 && code <= 122) return String.fromCodePoint(loBase + (code - 97))
    if (code >= 48 && code <= 57) {
      const digitBase = { bold: 0x1D7CE, mono: 0x1D7F6, doubleStr: 0x1D7D8 }[style]
      return digitBase ? String.fromCodePoint(digitBase + (code - 48)) : c
    }
    return c
  }).join('')
}

export default function UnicodeTextConverter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState('')

  function copy(val, key) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Unicode Text Converter</h1>
      <p className="tool-description">
        Convert text to Unicode font styles — bold, italic, monospace, wide, bubble, fraktur, double-struck, small caps and more. Works anywhere that accepts Unicode text.
      </p>

      <label htmlFor="utc-input">Your text</label>
      <textarea
        id="utc-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your text here…"
        style={{ minHeight: 120 }}
      />

      {text && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(STYLES).map(([key, { label }]) => {
            const result = convert(text, key)
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.65rem 0.85rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontSize: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{result}</span>
                </div>
                <button className="btn btn-sm btn-ghost" style={{ flexShrink: 0 }} onClick={() => copy(result, key)}>
                  {copied === key ? '✓' : 'Copy'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <RelatedTools category="text" exclude="/tools/unicode-text-converter" />
      <ToolSeo />
    </div>
  )
}
