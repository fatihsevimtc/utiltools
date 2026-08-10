import { useState, useEffect, useCallback, useRef } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

const LS_KEY = 'ut_simple_note'
const MAX_NOTES = 10

function loadNotes() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEY) || 'null')
    if (Array.isArray(data) && data.length > 0) return data
  } catch {}
  return [{ id: 1, title: 'My Note', content: '', updated: Date.now() }]
}

let _nextId = Date.now()

export default function SimpleNote() {
  const [notes, setNotes] = useState(loadNotes)
  const [activeId, setActiveId] = useState(() => loadNotes()[0]?.id)
  const [copied, setCopied] = useState(false)
  const saveTimer = useRef(null)

  // Persist to localStorage on change (debounced)
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(notes))
    }, 500)
    return () => clearTimeout(saveTimer.current)
  }, [notes])

  const active = notes.find(n => n.id === activeId) || notes[0]

  function updateActive(field, value) {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, [field]: value, updated: Date.now() } : n))
  }

  function newNote() {
    const id = ++_nextId
    const note = { id, title: 'New note', content: '', updated: Date.now() }
    setNotes(prev => [note, ...prev].slice(0, MAX_NOTES))
    setActiveId(id)
  }

  function deleteNote(id) {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      if (next.length === 0) {
        const fresh = { id: ++_nextId, title: 'My Note', content: '', updated: Date.now() }
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  function copy() {
    if (!active) return
    navigator.clipboard.writeText(active.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const wordCount = active?.content.trim() ? active.content.trim().split(/\s+/).length : 0
  const charCount = active?.content.length ?? 0

  function formatDate(ts) {
    return new Date(ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Simple Note</h1>
      <p className="tool-description">
        A browser-based scratchpad that saves automatically to your local storage. No account, no uploads — your notes stay on your device.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        {/* Note list */}
        <div style={{ flex: '0 0 200px', minWidth: 150 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{notes.length}/{MAX_NOTES} notes</span>
            <button className="btn btn-sm" onClick={newNote} disabled={notes.length >= MAX_NOTES}>+ New</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {notes.map(n => (
              <div
                key={n.id}
                style={{ padding: '0.5rem 0.7rem', borderRadius: 7, border: '1px solid var(--border)', cursor: 'pointer', background: n.id === activeId ? 'var(--accent)' : 'var(--surface)', color: n.id === activeId ? '#fff' : 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setActiveId(n.id)}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title || 'Untitled'}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.75 }}>{formatDate(n.updated)}</div>
                </div>
                {notes.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(n.id) }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7, padding: '0.1rem 0.3rem', fontSize: '0.8rem', flexShrink: 0 }}
                    aria-label="Delete note"
                  >✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            value={active?.title || ''}
            onChange={e => updateActive('title', e.target.value)}
            placeholder="Note title"
            style={{ fontWeight: 700, fontSize: '1rem' }}
          />
          <textarea
            value={active?.content || ''}
            onChange={e => updateActive('content', e.target.value)}
            placeholder="Start typing your note here… It saves automatically."
            style={{ flex: 1, minHeight: 320, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)' }}>
            <span>{wordCount} words · {charCount} chars</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
              <button className="btn btn-sm btn-ghost" onClick={() => updateActive('content', '')}>Clear</button>
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }}>
        🔒 All notes are stored in your browser's local storage only. Clearing browser data will remove them.
      </p>

      <ToolSeo />
    </div>
  )
}
