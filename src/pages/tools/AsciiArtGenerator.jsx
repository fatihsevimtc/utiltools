import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

// Figlet-style ASCII art using pre-defined 5-row character maps
// Using a simplified "banner" font
const FONT_BANNER = {
  ' ': ['   ','   ','   ','   ','   '],
  'A': [' _ ',' / \\','/_  \\','|  |','|__|'],
  'B': ['|_ ','|_)','|_)','|  ','|__'],
  'C': [' __','/ _','|  ','\\_ ','___/'],
  'D': ['|\\','| \\','|  |','|_/','|__/'],
  'E': ['|_','|_','|  ','|_ ','|__'],
  'F': ['|_','|_','|  ','|  ','|  '],
  'G': [' _ ','/ _','| __ ','\\_ |','___/'],
  'H': ['|  |','|__|','|  |','|  |','|  |'],
  'I': ['|','|','|','|','|'],
  'J': ['  |','  |','  |','\\.|',' _/'],
  'K': ['| /','|/ ','|\\','| \\','|  \\'],
  'L': ['|  ','|  ','|  ','|_ ','|__'],
  'M': ['|\\/|','|  |','|  |','|  |','|  |'],
  'N': ['|\\ |','| \\|','|  |','|  |','|  |'],
  'O': [' _ ','/ \\','|  |','\\_ /',' _/ '],
  'P': ['|_ ','|_)','|   ','|   ','|   '],
  'Q': [' _ ','/ \\','| Q|','\\_ /',' \\ '],
  'R': ['|_ ','|_)','| \\ ','|  \\','|  |'],
  'S': [' _',' _)','|_ ','  )','|__/'],
  'T': ['___','|_|','  |','  |','  |'],
  'U': ['|  |','|  |','|  |','\\  /','\\__/'],
  'V': ['\\  /','\\  /','\\  /','\\  /',' \\/ '],
  'W': ['\\   /','\\   /','\\   /','\\___/','\\   /'],
  'X': ['\\ /','\\/ ','/ \\','/  \\','/   \\'],
  'Y': ['\\  /','\\  /','\\__/','  |','  |'],
  'Z': ['__','  /','/ ','/__','___|'],
  '0': [' 0 ','0 0','0 0','0 0',' 0 '],
  '1': [' 1','11','  1','  1','  1'],
  '2': [' 2 ','   2',' _2','2  ',' ___'],
  '3': ['_3 ','  3',' _3','  3','_3 '],
  '4': ['4 4','4 4','444','  4','  4'],
  '5': ['555','5_ ','_55','  5','55_'],
  '6': [' 6 ','6  ','666','6 6',' 66'],
  '7': ['777','  7',' 7 ','7  ','7  '],
  '8': [' 8 ','8 8',' 8 ','8 8',' 8 '],
  '9': [' 9 ','9 9',' 99','  9',' 9 '],
  '!': ['!','!','!','.',' '],
  '?': [' ?','  )','?_ ','   ','?  '],
  '.': [' ',' ',' ','.',' '],
  ',': [' ',' ',' ',',',' /'],
}

const STYLES = {
  'Banner': FONT_BANNER,
}

// Block-style using Unicode block chars (simpler, always looks good)
function toBlock(text) {
  const BLOCK_CHARS = {
    'A':'█▀█\n█▀█\n▀ ▀', 'B':'█▀▄\n█▀▄\n▀▀ ', 'C':'▀▀▀\n█  \n▀▀▀',
    'D':'█▀▄\n█ █\n▀▀ ', 'E':'▀▀▀\n█▀ \n▀▀▀', 'F':'▀▀▀\n█▀ \n█  ',
    'G':'▀▀▀\n█ ▀\n▀▀▀', 'H':'█ █\n███\n█ █', 'I':'▀█▀\n █ \n▀█▀',
    'J':'  █\n  █\n▀▀█', 'K':'█ █\n██ \n█ █', 'L':'█  \n█  \n███',
    'M':'█▄█\n█ █\n█ █', 'N':'██▄\n█▄█\n█ █', 'O':'▀▀▀\n█ █\n▀▀▀',
    'P':'▀▀▄\n█▀▄\n█  ', 'Q':'▀▀▀\n█▄█\n▀▀█', 'R':'▀▀▄\n▀▀▄\n█ █',
    'S':'▀▀▀\n▀▀▄\n▀▀▀', 'T':'▀█▀\n █ \n █ ', 'U':'█ █\n█ █\n▀▀▀',
    'V':'█ █\n█ █\n ▀ ', 'W':'█ █\n█▄█\n▀ ▀', 'X':'█ █\n ▀ \n█ █',
    'Y':'█ █\n ▀ \n █ ', 'Z':'▀▀█\n ▀ \n█▀▀',
    '0':'▀▀▀\n█ █\n▀▀▀', '1':' █ \n██ \n ▀ ', '2':'▀▀▀\n ▀▀\n▀▀▀',
    '3':'▀▀▀\n ▀▀\n▀▀▀', '4':'█ █\n▀▀█\n  █', '5':'▀▀▀\n▀▀ \n▀▀▀',
    '6':'▀  \n▀▀▀\n▀▀▀', '7':'▀▀▀\n  █\n  █', '8':'▀▀▀\n▀▀▀\n▀▀▀',
    '9':'▀▀▀\n▀▀▀\n  ▀', ' ':'   \n   \n   ',
    '!':' █ \n █ \n ▪ ', '?':'▀▀ \n ▀ \n   ', '.':'   \n   \n ▪ ',
  }
  const chars = text.toUpperCase().split('')
  const rows = [[], [], []]
  for (const ch of chars) {
    const g = BLOCK_CHARS[ch] || BLOCK_CHARS[' ']
    const lines = g.split('\n')
    for (let r = 0; r < 3; r++) rows[r].push(lines[r] || '   ')
  }
  return rows.map(r => r.join(' ')).join('\n')
}

// Simple "dots" style
function toDots(text) {
  return text.toUpperCase().split('').map(c => {
    const map = { A:'(^)', B:'[b]', C:'(c', D:'|)', E:'[=', F:'[=', G:'(g)', H:'|-|', I:'|', J:'_|', K:'|<', L:'|_', M:'|V|', N:'|\\|', O:'(0)', P:'|o', Q:'(Q)', R:'|2', S:'$', T:'-|-', U:'|_|', V:'\\/', W:'\\/\\/', X:'><', Y:'`/', Z:'Z', ' ':' ', '0':'0', '1':'1', '2':'2', '3':'3', '4':'4', '5':'5', '6':'6', '7':'7', '8':'8', '9':'9' }
    return map[c] || c
  }).join('')
}

export default function AsciiArtGenerator() {
  const [text, setText]   = useState('HELLO')
  const [style, setStyle] = useState('block')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!text.trim()) return ''
    if (style === 'block') return toBlock(text.slice(0, 20))
    if (style === 'dots')  return toDots(text.slice(0, 30))
    return text
  }, [text, style])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>ASCII Art Generator</h1>
      <p className="tool-description">Convert text into ASCII art using Unicode block characters and symbol styles.</p>

      <label htmlFor="aa-input">Your text</label>
      <input id="aa-input" type="text" value={text} onChange={e => setText(e.target.value)}
        placeholder="HELLO WORLD" maxLength={30} />
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Max 20–30 characters depending on style</p>

      <div className="chip-group" style={{ marginTop: '1rem' }}>
        {[['block','█ Block'],['dots','· Symbols']].map(([v,l]) => (
          <button key={v} className={`chip ${style === v ? 'active' : ''}`} onClick={() => setStyle(v)}>{l}</button>
        ))}
      </div>

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ fontFamily: 'monospace', fontSize: style === 'block' ? '1.1rem' : '1rem', lineHeight: 1.4, letterSpacing: '0.05em', whiteSpace: 'pre' }}>
            {output}
          </div>
        </div>
      )}
      <RelatedTools category="developer" exclude="/tools/ascii-art" />
    </div>
  )
}
