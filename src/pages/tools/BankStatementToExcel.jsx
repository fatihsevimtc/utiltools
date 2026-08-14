import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function BankStatementToExcel() {
  const [text, setText] = useState('')

  function parseStatement(input) {
    if (!input) return []
    
    // Simple pattern matching for common bank statement formats
    const lines = input.split('\n')
    const transactions = []
    
    lines.forEach(line => {
      // Try to match date, description, amount pattern
      // Format: DD/MM/YYYY Description Amount
      const match = line.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([-+]?\$?\d+[,.]?\d*\.?\d*)/)
      
      if (match) {
        transactions.push({
          date: match[1],
          description: match[2].trim(),
          amount: match[3].replace(/[,$]/g, '')
        })
      }
    })

    return transactions
  }

  function exportToCsv() {
    const transactions = parseStatement(text)
    if (transactions.length === 0) return

    let csv = 'Date,Description,Amount\n'
    transactions.forEach(t => {
      csv += `"${t.date}","${t.description}","${t.amount}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bank-statement.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const transactions = parseStatement(text)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>AI Bank Statement to Excel</h1>
      <p className="tool-description">Convert bank statement text to CSV/Excel format by extracting dates, descriptions, and amounts.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>📝 Pattern Detection</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This tool uses basic pattern matching. For accurate results, consider using OCR tools or bank CSV exports. Expected format: "DD/MM/YYYY Description Amount"
        </p>
      </div>

      <label htmlFor="statement-input">Bank Statement Text</label>
      <textarea 
        id="statement-input"
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="15/01/2024 Grocery Store -$45.50&#10;16/01/2024 Salary Deposit +$2500.00&#10;17/01/2024 Electric Bill -$120.00"
        rows={15}
      />

      {transactions.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="stat-card" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-label">Transactions detected</div>
          </div>

          <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Date</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Description</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '2px solid var(--border)' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>{t.date}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>{t.description}</td>
                    <td style={{ 
                      padding: '0.5rem', 
                      textAlign: 'right', 
                      borderBottom: '1px solid var(--border)',
                      color: parseFloat(t.amount) >= 0 ? 'var(--success)' : 'var(--error)'
                    }}>
                      {t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={exportToCsv} style={{ marginTop: '1rem' }}>
            Download as CSV
          </button>
        </div>
      )}

      <RelatedTools category="converter" exclude="/tools/bank-statement-to-excel" />
      <ToolSeo />
    </div>
  )
}
