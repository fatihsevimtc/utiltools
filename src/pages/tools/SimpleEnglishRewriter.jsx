import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function SimpleEnglishRewriter() {
  const [input, setInput] = useState('')

  const replacements = {
    'utilize': 'use',
    'utilise': 'use',
    'utilization': 'use',
    'facilitate': 'help',
    'implement': 'do',
    'demonstrate': 'show',
    'numerous': 'many',
    'sufficient': 'enough',
    'commence': 'start',
    'terminate': 'end',
    'acquire': 'get',
    'purchase': 'buy',
    'assist': 'help',
    'endeavor': 'try',
    'approximately': 'about',
    'regarding': 'about',
    'concerning': 'about',
    'notwithstanding': 'despite',
    'nonetheless': 'however',
    'nevertheless': 'however',
    'consequently': 'so',
    'therefore': 'so',
    'furthermore': 'also',
    'moreover': 'also',
    'subsequently': 'later',
    'prior to': 'before',
    'in order to': 'to',
    'due to the fact that': 'because',
    'for the reason that': 'because',
    'in the event that': 'if',
    'at this point in time': 'now',
    'with regards to': 'about',
  }

  function simplify(text) {
    if (!text) return ''
    let result = text
    
    Object.entries(replacements).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi')
      result = result.replace(regex, simple)
    })

    // Remove double spaces
    result = result.replace(/\s{2,}/g, ' ')
    
    return result
  }

  const output = simplify(input)
  const changesMade = input !== output

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Simple English Rewriter</h1>
      <p className="tool-description">Automatically replace complex words and phrases with simpler alternatives for clearer communication.</p>

      <label htmlFor="simple-input">Complex Text</label>
      <textarea 
        id="simple-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Paste text with complex language..."
        rows={8}
      />

      <label htmlFor="simple-output">Simplified Text</label>
      <textarea 
        id="simple-output"
        value={output} 
        readOnly
        rows={8}
        style={{ background: changesMade ? 'var(--bg-tertiary)' : undefined }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigator.clipboard.writeText(output)}>
          Copy Simplified Text
        </button>
        {changesMade && (
          <span style={{ padding: '0.5rem 1rem', color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
            ✓ Text simplified
          </span>
        )}
      </div>

      <details style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '600' }}>View all simplifications (click to expand)</summary>
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.875rem' }}>
          {Object.entries(replacements).map(([c, s]) => (
            <div key={c}>
              <span style={{ color: 'var(--muted)' }}>{c}</span> → <strong>{s}</strong>
            </div>
          ))}
        </div>
      </details>

      <RelatedTools category="text" exclude="/tools/simple-english-rewriter" />
      <ToolSeo />
    </div>
  )
}
