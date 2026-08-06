import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

// Lightweight markdown → HTML (no external lib needed for common cases)
function mdToHtml(md) {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // headings
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // horizontal rule
    .replace(/^---$/gm, '<hr>')
    // unordered list
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // ordered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // paragraphs (double newline)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/^(?!<[hH\d]|<ul|<li|<hr|<blockquote)(.+)/, '<p>$1</p>')
    // single line breaks
    .replace(/\n/g, '<br>')
}

const PLACEHOLDER = `# Hello World

This is **bold** and *italic* text.

## Features
- Live preview
- No uploads
- Runs in your browser

> A simple blockquote.

\`inline code\` looks like this.

[Visit utiltools.org](https://utiltools.org)`

export default function MarkdownPreview() {
  const [md, setMd] = useState(PLACEHOLDER)

  return (
    <div className="tool-page" style={{ maxWidth: '100%' }}>
      <BackBar />
      <h1>Markdown Preview</h1>
      <p className="tool-description">Write Markdown on the left, see rendered HTML on the right in real time.</p>

      <div className="diff-grid" style={{ marginTop: '1rem' }}>
        <div>
          <label>Markdown</label>
          <textarea value={md} onChange={e => setMd(e.target.value)} style={{ minHeight: 400, fontFamily: 'monospace' }} />
        </div>
        <div>
          <label>Preview</label>
          <div
            className="code-block md-preview"
            style={{ minHeight: 400, fontFamily: 'var(--font)', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: mdToHtml(md) }}
          />
        </div>
      </div>
          <ToolSeo />
    </div>
  )
}
