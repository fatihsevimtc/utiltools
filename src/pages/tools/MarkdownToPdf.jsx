import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState('')

  function convertToHtml(md) {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }

  function generatePdf() {
    const html = convertToHtml(markdown)
    
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Markdown PDF</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 2rem; margin-bottom: 1rem; }
          h2 { font-size: 1.5rem; margin-bottom: 0.75rem; margin-top: 1.5rem; }
          h3 { font-size: 1.25rem; margin-bottom: 0.5rem; margin-top: 1rem; }
          p { line-height: 1.6; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Markdown to PDF</h1>
      <p className="tool-description">Convert Markdown to PDF via your browser's print function — no server upload required.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>💡 How it works</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This tool converts Markdown to HTML, opens a print dialog, then lets you "Print to PDF" using your browser's built-in feature.
        </p>
      </div>

      <label htmlFor="md-input">Markdown Content</label>
      <textarea 
        id="md-input"
        value={markdown} 
        onChange={e => setMarkdown(e.target.value)} 
        placeholder="# Your Markdown Here..."
        rows={15}
        style={{ fontFamily: 'monospace' }}
      />

      <button className="btn" onClick={generatePdf} disabled={!markdown}>
        🖨️ Generate PDF (Print Dialog)
      </button>

      {markdown && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Preview</h3>
          <div 
            style={{ 
              padding: '1.5rem', 
              background: 'white', 
              color: 'black', 
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}
            dangerouslySetInnerHTML={{ __html: convertToHtml(markdown) }}
          />
        </div>
      )}

      <RelatedTools category="converter" exclude="/tools/markdown-to-pdf" />
      <ToolSeo />
    </div>
  )
}
