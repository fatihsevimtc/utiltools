import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const SUBJECTS = [
  'The cat', 'A wizard', 'The engineer', 'A curious child', 'The robot', 'An old sailor',
  'The professor', 'A brave knight', 'The scientist', 'A lonely astronaut', 'The chef',
  'A mysterious stranger', 'The detective', 'An unlikely hero', 'The inventor',
  'A sleepy dragon', 'The librarian', 'A talking parrot', 'The archaeologist',
  'A mischievous goblin',
]
const VERBS = [
  'discovered', 'invented', 'forgot', 'questioned', 'celebrated', 'demolished', 'painted',
  'whispered to', 'accidentally summoned', 'proudly defeated', 'secretly admired',
  'reluctantly befriended', 'carefully studied', 'loudly protested', 'cheerfully fixed',
  'nervously approached', 'brilliantly solved', 'completely ignored', 'swiftly outran',
  'inexplicably collected',
]
const OBJECTS = [
  'a quantum sandwich', 'the last known penguin', 'seventeen invisible hats', 'an enchanted toaster',
  'a dictionary of sighs', 'the world\'s softest brick', 'a rainbow-coloured spreadsheet',
  'the concept of Tuesday', 'an extremely well-read fish', 'a polite avalanche',
  'the second-smallest moon', 'a jar of bottled thunder', 'the forgotten theorem',
  'an overly optimistic cloud', 'a very late birthday card', 'three philosophical spoons',
  'a self-aware algorithm', 'the loudest silence ever recorded', 'a borrowed sunset',
  'the manual for everything',
]
const LOCATIONS = [
  'in the middle of a cloud', 'on a Tuesday afternoon', 'beneath the old lighthouse',
  'during a solar eclipse', 'at the edge of the internet', 'inside a recursive function',
  'while nobody was watching', 'on top of a frozen waterfall', 'in a library with no books',
  'at the world\'s busiest crossroads', 'deep inside a forgotten algorithm',
  'somewhere between breakfast and lunch', 'right before the deadline',
  'in the quietest room on Earth', 'moments before the storm',
]
const ENDINGS = [
  'and nobody questioned it.', 'which changed everything.', 'much to everyone\'s surprise.',
  'and wrote a blog post about it.', 'but forgot to save the file.',
  'though nobody fully understood why.', 'and filed it under "miscellaneous".',
  'which went viral immediately.', 'for reasons still under investigation.',
  'and somehow it worked.', 'resulting in three new problems.',
  'while simultaneously eating a sandwich.', 'to the applause of absolutely no one.',
  'and lived to tell the tale.', 'after consulting seven different tutorials.',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateSentence() {
  return `${pick(SUBJECTS)} ${pick(VERBS)} ${pick(OBJECTS)} ${pick(LOCATIONS)}, ${pick(ENDINGS)}`
}

export default function RandomSentenceGenerator() {
  const [count, setCount] = useState(5)
  const [sentences, setSentences] = useState(() =>
    Array.from({ length: 5 }, generateSentence)
  )
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    setSentences(Array.from({ length: count }, generateSentence))
  }, [count])

  function copy() {
    navigator.clipboard.writeText(sentences.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Random Sentence Generator</h1>
      <p className="tool-description">
        Generate random, quirky sentences — great for creative writing prompts, placeholder text, or just a laugh.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="sent-count" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Number of sentences:</label>
          <input
            id="sent-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            style={{ width: 70, padding: '0.4rem 0.6rem', fontSize: '0.95rem' }}
          />
        </div>
        <button className="btn" onClick={generate}>🎲 Generate</button>
      </div>

      {sentences.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>{sentences.length} sentence{sentences.length !== 1 ? 's' : ''}</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy all'}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sentences.map((s, i) => (
              <div
                key={i}
                className="code-block"
                style={{ fontFamily: 'inherit', fontSize: '0.95rem', lineHeight: 1.55, padding: '0.6rem 0.9rem' }}
              >
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                  {i + 1}.
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🎲', name: 'Random Picker',      path: '/tools/random-picker' },
        { icon: '🔢', name: 'Random Number',       path: '/tools/random-number' },
        { icon: '📄', name: 'Lorem Ipsum',         path: '/tools/lorem-ipsum' },
        { icon: '🔀', name: 'Word Randomizer',     path: '/tools/word-randomizer' },
      ]} />
      <ToolSeo />
    </div>
  )
}
