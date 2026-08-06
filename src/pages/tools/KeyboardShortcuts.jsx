import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

const APPS = {
  'VS Code': [
    { keys: ['Ctrl','P'], desc: 'Quick open file' },
    { keys: ['Ctrl','Shift','P'], desc: 'Command palette' },
    { keys: ['Ctrl','`'], desc: 'Toggle terminal' },
    { keys: ['Ctrl','B'], desc: 'Toggle sidebar' },
    { keys: ['Ctrl','Shift','E'], desc: 'Explorer panel' },
    { keys: ['Ctrl','Shift','F'], desc: 'Search across files' },
    { keys: ['Ctrl','Shift','G'], desc: 'Source control panel' },
    { keys: ['Ctrl','Shift','X'], desc: 'Extensions panel' },
    { keys: ['Ctrl','/'], desc: 'Toggle line comment' },
    { keys: ['Alt','↑/↓'], desc: 'Move line up/down' },
    { keys: ['Shift','Alt','↑/↓'], desc: 'Copy line up/down' },
    { keys: ['Ctrl','D'], desc: 'Select next occurrence' },
    { keys: ['Ctrl','Shift','L'], desc: 'Select all occurrences' },
    { keys: ['F2'], desc: 'Rename symbol' },
    { keys: ['F12'], desc: 'Go to definition' },
    { keys: ['Alt','F12'], desc: 'Peek definition' },
    { keys: ['Ctrl','Shift','K'], desc: 'Delete line' },
    { keys: ['Ctrl','Enter'], desc: 'Insert line below' },
    { keys: ['Ctrl','Z'], desc: 'Undo' },
    { keys: ['Ctrl','Shift','Z'], desc: 'Redo' },
    { keys: ['Ctrl','F'], desc: 'Find' },
    { keys: ['Ctrl','H'], desc: 'Replace' },
    { keys: ['Ctrl','G'], desc: 'Go to line' },
    { keys: ['Ctrl','K','Ctrl','F'], desc: 'Format selection' },
    { keys: ['Shift','Alt','F'], desc: 'Format document' },
    { keys: ['Ctrl','\\'], desc: 'Split editor' },
    { keys: ['Ctrl','W'], desc: 'Close editor tab' },
    { keys: ['Ctrl','Tab'], desc: 'Switch editor tab' },
    { keys: ['Ctrl','Shift','T'], desc: 'Reopen closed editor' },
    { keys: ['Ctrl','K','Z'], desc: 'Zen mode' },
  ],
  'Chrome DevTools': [
    { keys: ['F12'], desc: 'Open DevTools' },
    { keys: ['Ctrl','Shift','I'], desc: 'Open DevTools' },
    { keys: ['Ctrl','Shift','J'], desc: 'Open Console' },
    { keys: ['Ctrl','Shift','C'], desc: 'Inspect element' },
    { keys: ['Ctrl','['], desc: 'Previous panel' },
    { keys: ['Ctrl',']'], desc: 'Next panel' },
    { keys: ['Ctrl','R'], desc: 'Reload page' },
    { keys: ['Ctrl','Shift','R'], desc: 'Hard reload (clear cache)' },
    { keys: ['Ctrl','F'], desc: 'Search in panel' },
    { keys: ['Esc'], desc: 'Toggle console drawer' },
    { keys: ['Ctrl','P'], desc: 'Open file' },
    { keys: ['Ctrl','Shift','P'], desc: 'Run command' },
    { keys: ['Ctrl','G'], desc: 'Go to line' },
    { keys: ['Ctrl','+/-'], desc: 'Zoom in/out DevTools' },
    { keys: ['F8'], desc: 'Pause / resume script' },
    { keys: ['F10'], desc: 'Step over' },
    { keys: ['F11'], desc: 'Step into' },
    { keys: ['Shift','F11'], desc: 'Step out' },
  ],
  'Windows': [
    { keys: ['Win','D'], desc: 'Show desktop' },
    { keys: ['Win','E'], desc: 'File Explorer' },
    { keys: ['Win','L'], desc: 'Lock screen' },
    { keys: ['Win','I'], desc: 'Settings' },
    { keys: ['Win','S'], desc: 'Search' },
    { keys: ['Win','Tab'], desc: 'Task view' },
    { keys: ['Win','↑/↓'], desc: 'Maximise / restore window' },
    { keys: ['Win','←/→'], desc: 'Snap window left/right' },
    { keys: ['Alt','Tab'], desc: 'Switch apps' },
    { keys: ['Alt','F4'], desc: 'Close window' },
    { keys: ['Ctrl','Alt','Del'], desc: 'Security options' },
    { keys: ['Ctrl','Shift','Esc'], desc: 'Task Manager' },
    { keys: ['Win','.'], desc: 'Emoji picker' },
    { keys: ['Win','Shift','S'], desc: 'Screenshot (snip)' },
    { keys: ['Print Screen'], desc: 'Full screenshot' },
    { keys: ['Win','V'], desc: 'Clipboard history' },
    { keys: ['Win','X'], desc: 'Power menu' },
    { keys: ['Ctrl','Z'], desc: 'Undo' },
    { keys: ['Ctrl','Y'], desc: 'Redo' },
    { keys: ['Ctrl','C/X/V'], desc: 'Copy / Cut / Paste' },
    { keys: ['Ctrl','A'], desc: 'Select all' },
    { keys: ['Ctrl','F'], desc: 'Find' },
    { keys: ['F2'], desc: 'Rename selected item' },
    { keys: ['F5'], desc: 'Refresh' },
    { keys: ['Delete'], desc: 'Delete to Recycle Bin' },
    { keys: ['Shift','Delete'], desc: 'Permanently delete' },
  ],
  'Mac': [
    { keys: ['⌘','Space'], desc: 'Spotlight search' },
    { keys: ['⌘','Tab'], desc: 'Switch apps' },
    { keys: ['⌘','Q'], desc: 'Quit app' },
    { keys: ['⌘','W'], desc: 'Close window' },
    { keys: ['⌘','M'], desc: 'Minimise window' },
    { keys: ['⌘','H'], desc: 'Hide app' },
    { keys: ['⌘',','], desc: 'Preferences' },
    { keys: ['⌘','Z'], desc: 'Undo' },
    { keys: ['⌘','Shift','Z'], desc: 'Redo' },
    { keys: ['⌘','C/X/V'], desc: 'Copy / Cut / Paste' },
    { keys: ['⌘','A'], desc: 'Select all' },
    { keys: ['⌘','F'], desc: 'Find' },
    { keys: ['⌘','N'], desc: 'New window/document' },
    { keys: ['⌘','S'], desc: 'Save' },
    { keys: ['⌘','Shift','S'], desc: 'Save as' },
    { keys: ['⌘','P'], desc: 'Print' },
    { keys: ['⌃','⌘','Space'], desc: 'Emoji picker' },
    { keys: ['⌘','Shift','3'], desc: 'Screenshot full screen' },
    { keys: ['⌘','Shift','4'], desc: 'Screenshot selection' },
    { keys: ['⌘','Shift','5'], desc: 'Screenshot options' },
    { keys: ['⌘','⌥','Esc'], desc: 'Force quit' },
    { keys: ['⌘','`'], desc: 'Switch windows (same app)' },
    { keys: ['F11'], desc: 'Show desktop' },
    { keys: ['⌃','←/→'], desc: 'Switch desktop spaces' },
  ],
  'Vim': [
    { keys: ['i'], desc: 'Insert mode' },
    { keys: ['Esc'], desc: 'Normal mode' },
    { keys: [':w'], desc: 'Save file' },
    { keys: [':q'], desc: 'Quit' },
    { keys: [':wq'], desc: 'Save and quit' },
    { keys: [':q!'], desc: 'Quit without saving' },
    { keys: ['h/j/k/l'], desc: 'Move left/down/up/right' },
    { keys: ['w'], desc: 'Jump to next word' },
    { keys: ['b'], desc: 'Jump to previous word' },
    { keys: ['0'], desc: 'Start of line' },
    { keys: ['$'], desc: 'End of line' },
    { keys: ['gg'], desc: 'Go to first line' },
    { keys: ['G'], desc: 'Go to last line' },
    { keys: ['dd'], desc: 'Delete line' },
    { keys: ['yy'], desc: 'Copy (yank) line' },
    { keys: ['p'], desc: 'Paste after' },
    { keys: ['P'], desc: 'Paste before' },
    { keys: ['u'], desc: 'Undo' },
    { keys: ['Ctrl','R'], desc: 'Redo' },
    { keys: ['/search'], desc: 'Search forward' },
    { keys: ['n/N'], desc: 'Next / previous match' },
    { keys: [':%s/old/new/g'], desc: 'Replace all' },
    { keys: ['v'], desc: 'Visual mode (select)' },
    { keys: ['V'], desc: 'Visual line mode' },
    { keys: ['Ctrl','V'], desc: 'Visual block mode' },
    { keys: ['>>'], desc: 'Indent line' },
    { keys: ['<<'], desc: 'Unindent line' },
    { keys: ['Ctrl','W','W'], desc: 'Switch split pane' },
    { keys: [':sp'], desc: 'Horizontal split' },
    { keys: [':vsp'], desc: 'Vertical split' },
  ],
}

export default function KeyboardShortcuts() {
  const [app, setApp]     = useState('VS Code')
  const [query, setQuery] = useState('')

  const shortcuts = useMemo(() => {
    const all = APPS[app] || []
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all.filter(s =>
      s.keys.join(' ').toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q)
    )
  }, [app, query])

  return (
    <div className="tool-page" style={{ maxWidth: 800 }}>
      <BackBar />
      <h1>Keyboard Shortcut Cheatsheets</h1>
      <p className="tool-description">Quick reference for VS Code, Chrome DevTools, Windows, Mac, and Vim shortcuts.</p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        {Object.keys(APPS).map(a => (
          <button key={a} className={`chip ${app===a?'active':''}`} onClick={() => { setApp(a); setQuery('') }}>{a}</button>
        ))}
      </div>

      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder={`Search ${app} shortcuts…`} style={{ marginBottom: '1rem' }} />

      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', background: 'var(--surface2)', padding: '0.5rem 1rem', fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span>Shortcut</span><span>Description</span>
        </div>
        {shortcuts.length === 0 && (
          <div style={{ padding: '1.5rem', color: 'var(--muted)', textAlign: 'center' }}>No shortcuts match "{query}"</div>
        )}
        {shortcuts.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', padding: '0.55rem 1rem', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {s.keys.map((k, ki) => (
                <kbd key={ki} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.1rem 0.45rem', fontSize: '0.8rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{k}</kbd>
              ))}
            </div>
            <span style={{ fontSize: '0.875rem' }}>{s.desc}</span>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
        {shortcuts.length} of {APPS[app].length} shortcuts shown
      </p>
    </div>
  )
}
