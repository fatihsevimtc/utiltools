import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function CharacterCounter() {
  const [text, setText] = useState('')

  const total      = text.length
  const noSpaces   = text.replace(/ /g, '').length
  const letters    = (text.match(/[a-zA-Z]/g) || []).length
  const digits     = (text.match(/\d/g) || []).length
  const spaces     = (text.match(/ /g) || []).length
  const newlines   = (text.match(/\n/g) || []).length
  const special    = (text.match(/[^a-zA-Z0-9\s]/g) || []).length
  const uppercase  = (text.match(/[A-Z]/g) || []).length
  const lowercase  = (text.match(/[a-z]/g) || []).length

  const rows = [
    { label: 'Total characters',               value: total },
    { label: 'Characters (no spaces)',          value: noSpaces },
    { label: 'Letters',                         value: letters },
    { label: 'Uppercase letters',               value: uppercase },
    { label: 'Lowercase letters',               value: lowercase },
    { label: 'Digits',                          value: digits },
    { label: 'Spaces',                          value: spaces },
    { label: 'Newlines',                        value: newlines },
    { label: 'Special characters',              value: special },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Character Counter</h1>
      <p className="tool-description">
        Count characters, letters, digits, spaces, and special characters in any text — with a detailed breakdown.
      </p>

      <label htmlFor="cc-input">Your text</label>
      <textarea
        id="cc-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        style={{ minHeight: 180 }}
      />

      {text && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.25rem', fontSize: '0.9rem' }}>
          <tbody>
            {rows.map(r => (
              <tr key={r.label} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.45rem 0.6rem', color: 'var(--muted)' }}>{r.label}</td>
                <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <RelatedTools category="text" exclude="/tools/character-counter" />
      <ToolSeo />
    </div>
  )
}
