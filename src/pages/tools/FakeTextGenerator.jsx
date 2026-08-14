import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum', 'the', 'of', 'to', 'and', 'a', 'in', 'is', 'it', 'you',
  'that', 'he', 'was', 'for', 'on', 'are', 'with', 'as', 'his', 'they', 'be', 'at',
]

function generateSentence(minWords = 5, maxWords = 15) {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
  const words = []
  for (let i = 0; i < count; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)])
  }
  let sentence = words.join(' ')
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  return sentence
}

function generateParagraph(minSentences = 3, maxSentences = 7) {
  const count = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences
  const sentences = []
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

export default function FakeTextGenerator() {
  const [paragraphs, setParagraphs] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    const result = []
    for (let i = 0; i < paragraphs; i++) {
      result.push(generateParagraph())
    }
    setOutput(result.join('\n\n'))
  }, [paragraphs])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Fake Text Generator</h1>
      <p className="tool-description">
        Generate Lorem Ipsum-style placeholder text for mockups, prototypes, and testing.
      </p>

      <label htmlFor="ftg-paragraphs">Number of paragraphs</label>
      <input
        id="ftg-paragraphs"
        type="number"
        min={1}
        max={50}
        value={paragraphs}
        onChange={e => setParagraphs(Math.max(1, parseInt(e.target.value) || 1))}
      />

      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={generate}>
        ✨ Generate Text
      </button>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Generated text</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {output}
          </div>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '📄', name: 'Lorem Ipsum',         path: '/tools/lorem-ipsum' },
        { icon: '🎭', name: 'Fake Data Generator', path: '/tools/fake-data-generator' },
        { icon: '📝', name: 'Text Repeater',       path: '/tools/text-repeater' },
        { icon: '🎲', name: 'Random Sentence',     path: '/tools/random-sentence' },
      ]} />
      <ToolSeo />
    </div>
  )
}
