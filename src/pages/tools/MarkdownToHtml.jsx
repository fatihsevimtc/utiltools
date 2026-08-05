import { useState } from 'react'
import BackBar from '../../components/BackBar'

function markdownToHtml(md) {
  let html = md
    // Headings
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr />')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Images before links
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered list items
    .replace(/^[-*+]\s+(.+)$/gm, '<li>$1</li>')
    // Blockquote
    .replace(/^>\s?(.+)$/gm, '<blockquote>$1</blockquote>')
    // Paragraphs — wrap lines not already tagged
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|pre|div)/.test(block)) return block
      return '<p>' + block.replace(/\n/g, '<br />') + '</p>'
    })
    .join('\n')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, m => `<ul>\n${m}</ul>\n`)

  return html
}

export default function MarkdownToHtml() {
  const [input, setInput] = useState('# Hello\n\nThis is **bold** and _italic_ text.\n\n- Item one\n- Item two\n\n[Visit Google](https://google.com)')
  const [tab, setTab] = useState('html')
  const [copied, setCopied] = useState(false)

  const output = input ? markdownToHtml(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Markdown to HTML</h1>
      <p className="tool-description">Convert Markdown to HTML — see the raw output or a rendered preview.</p>

      <label htmlFor="md2html-input">Markdown input</label>
      <textarea
        id="md2html-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ minHeight: 180, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="chip-group" style={{ margin: 0 }}>
              <button className={`chip ${tab === 'html' ? 'active' : ''}`} onClick={() => setTab('html')}>HTML source</button>
              <button className={`chip ${tab === 'preview' ? 'active' : ''}`} onClick={() => setTab('preview')}>Preview</button>
            </div>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy HTML'}</button>
          </div>

          {tab === 'html' ? (
            <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
          ) : (
            <div
              className="code-block"
              style={{ fontFamily: 'inherit', lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: output }}
            />
          )}
        </div>
      )}
    </div>
  )
}
