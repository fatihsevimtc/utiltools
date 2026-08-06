import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

const WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum','curabitur','pretium','tincidunt','lacus','nunc','purus','accumsan','turpis','suspendisse','potenti','viverra','venenatis','eleifend','ultrices','posuere','cubilia','curae','proin','vel','ante','porta','dictum','ultrices']

function randomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)] }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function genWords(n) {
  return Array.from({ length: n }, randomWord).join(' ')
}
function genSentence() {
  const len = 8 + Math.floor(Math.random() * 12)
  return capitalize(genWords(len)) + '.'
}
function genParagraph() {
  const count = 4 + Math.floor(Math.random() * 4)
  return Array.from({ length: count }, genSentence).join(' ')
}

export default function LoremIpsum() {
  const [type, setType]     = useState('paragraphs')
  const [count, setCount]   = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    let result = ''
    if (type === 'paragraphs') result = Array.from({ length: count }, genParagraph).join('\n\n')
    else if (type === 'sentences') result = Array.from({ length: count }, genSentence).join(' ')
    else result = genWords(count)
    setOutput(result)
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Lorem Ipsum Generator</h1>
      <p className="tool-description">Generate placeholder text for designs and mockups.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <label>Count</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(Math.max(1, Number(e.target.value)))} />
        </div>
        <button className="btn" onClick={generate} style={{ flexShrink: 0 }}>Generate</button>
      </div>

      {output && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font)' }}>{output}</div>
        </>
      )}
          <ToolSeo />
    </div>
  )
}
