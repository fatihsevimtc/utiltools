import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// Curated vocabulary words with definitions
const WORD_SETS = {
  beginner: [
    { word: 'eloquent', definition: 'Fluent or persuasive in speaking or writing', example: 'The speaker gave an eloquent speech.' },
    { word: 'benevolent', definition: 'Well-meaning and kindly', example: 'She was known for her benevolent nature.' },
    { word: 'diligent', definition: 'Having or showing care and conscientiousness', example: 'He was a diligent student.' },
    { word: 'profound', definition: 'Very great or intense; having deep insight', example: 'She had a profound understanding of the issue.' },
    { word: 'resilient', definition: 'Able to withstand or recover quickly from difficulties', example: 'The community proved resilient after the disaster.' },
  ],
  intermediate: [
    { word: 'ephemeral', definition: 'Lasting for a very short time', example: 'The ephemeral beauty of cherry blossoms.' },
    { word: 'ubiquitous', definition: 'Present, appearing, or found everywhere', example: 'Smartphones have become ubiquitous in modern society.' },
    { word: 'pragmatic', definition: 'Dealing with things sensibly and realistically', example: 'She took a pragmatic approach to the problem.' },
    { word: 'ambiguous', definition: 'Open to more than one interpretation; unclear', example: 'His answer was deliberately ambiguous.' },
    { word: 'tenacious', definition: 'Tending to keep a firm hold; persistent', example: 'Her tenacious spirit helped her succeed.' },
  ],
  advanced: [
    { word: 'obfuscate', definition: 'To render obscure, unclear, or unintelligible', example: 'The report seemed designed to obfuscate the truth.' },
    { word: 'sycophant', definition: 'A person who acts obsequiously toward someone to gain advantage', example: 'He was surrounded by sycophants.' },
    { word: 'perspicacious', definition: 'Having a ready insight into things; shrewd', example: 'Her perspicacious observations impressed everyone.' },
    { word: 'truculent', definition: 'Eager or quick to argue or fight; aggressively defiant', example: 'His truculent manner made negotiations difficult.' },
    { word: 'insipid', definition: 'Lacking flavor, vigor, or interest', example: 'The movie received criticism for its insipid plot.' },
  ],
}

export default function VocabularyBuilder() {
  const [level, setLevel] = useState('beginner')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [learned, setLearned] = useState(new Set())
  const [currentWords, setCurrentWords] = useState(WORD_SETS.beginner)

  useEffect(() => {
    setCurrentWords(WORD_SETS[level])
    setCurrentIndex(0)
    setShowDefinition(false)
  }, [level])

  const currentWord = currentWords[currentIndex]

  function nextWord() {
    setCurrentIndex((prev) => (prev + 1) % currentWords.length)
    setShowDefinition(false)
  }

  function previousWord() {
    setCurrentIndex((prev) => (prev - 1 + currentWords.length) % currentWords.length)
    setShowDefinition(false)
  }

  function toggleLearned() {
    const newLearned = new Set(learned)
    if (newLearned.has(currentWord.word)) {
      newLearned.delete(currentWord.word)
    } else {
      newLearned.add(currentWord.word)
    }
    setLearned(newLearned)
  }

  function resetProgress() {
    setLearned(new Set())
  }

  const learnedCount = currentWords.filter(w => learned.has(w.word)).length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Vocabulary Builder</h1>
      <p className="tool-description">
        Expand your vocabulary with curated word lists — learn new words with definitions and examples.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="vb-level">Difficulty Level</label>
        <select
          id="vb-level"
          value={level}
          onChange={e => setLevel(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          Progress: {learnedCount} / {currentWords.length} words learned
        </p>
      </div>

      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--card-bg)',
        border: '2px solid var(--border)',
        borderRadius: 12,
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          {currentWord.word}
          {learned.has(currentWord.word) && (
            <span style={{ marginLeft: '0.5rem', fontSize: '1.5rem' }}>✓</span>
          )}
        </h2>

        <button
          className="btn"
          onClick={() => setShowDefinition(!showDefinition)}
          style={{ marginBottom: '1.5rem' }}
        >
          {showDefinition ? '🙈 Hide' : '👁️ Show'} Definition
        </button>

        {showDefinition && (
          <div style={{ textAlign: 'left', marginTop: '1rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              <strong>Definition:</strong> {currentWord.definition}
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', fontStyle: 'italic' }}>
              <strong>Example:</strong> "{currentWord.example}"
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
        <button className="btn" onClick={previousWord}>
          ← Previous
        </button>
        <button
          className="btn"
          onClick={toggleLearned}
          style={{
            backgroundColor: learned.has(currentWord.word) ? 'var(--success)' : undefined,
          }}
        >
          {learned.has(currentWord.word) ? '✓ Learned' : '📚 Mark as Learned'}
        </button>
        <button className="btn" onClick={nextWord}>
          Next →
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          Word {currentIndex + 1} of {currentWords.length}
        </p>
      </div>

      {learnedCount > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-ghost" onClick={resetProgress}>
            ↻ Reset Progress
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 8 }}>
        <h3>Tips for Learning:</h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
          <li>Try to use each word in your own sentence</li>
          <li>Review learned words regularly to reinforce memory</li>
          <li>Look up words in context by reading articles or books</li>
          <li>Practice using new words in conversation</li>
        </ul>
      </div>

      <RelatedTools
        tools={[
          { icon: '📖', name: 'Dictionary', path: '/tools/dictionary' },
          { icon: '📝', name: 'Word Counter', path: '/tools/word-counter' },
          { icon: '📊', name: 'Word Frequency', path: '/tools/word-frequency' },
          { icon: '📖', name: 'Readability Score', path: '/tools/readability-score' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
