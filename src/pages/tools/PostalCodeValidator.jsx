import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PostalCodeValidator() {
  const [code, setCode] = useState('')
  const [country, setCountry] = useState('US')

  const patterns = {
    US: { regex: /^\d{5}(-\d{4})?$/, name: 'United States', example: '12345 or 12345-6789' },
    CA: { regex: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, name: 'Canada', example: 'K1A 0B1' },
    UK: { regex: /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i, name: 'United Kingdom', example: 'SW1A 1AA' },
    DE: { regex: /^\d{5}$/, name: 'Germany', example: '10115' },
    FR: { regex: /^\d{5}$/, name: 'France', example: '75001' },
    JP: { regex: /^\d{3}-\d{4}$/, name: 'Japan', example: '100-0001' },
    AU: { regex: /^\d{4}$/, name: 'Australia', example: '2000' },
    IN: { regex: /^\d{6}$/, name: 'India', example: '110001' },
    BR: { regex: /^\d{5}-?\d{3}$/, name: 'Brazil', example: '01310-100' },
    CN: { regex: /^\d{6}$/, name: 'China', example: '100000' },
  }

  function validate() {
    if (!code) return null
    const pattern = patterns[country]
    if (!pattern) return null
    
    return pattern.regex.test(code.trim())
  }

  const isValid = validate()
  const currentPattern = patterns[country]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Postal Code Validator</h1>
      <p className="tool-description">Validate postal codes (ZIP codes) for different countries using regex patterns.</p>

      <label htmlFor="country-select">Country</label>
      <select id="country-select" value={country} onChange={e => setCountry(e.target.value)}>
        {Object.entries(patterns).map(([code, info]) => (
          <option key={code} value={code}>{info.name}</option>
        ))}
      </select>

      <label htmlFor="postal-code">Postal Code</label>
      <input 
        id="postal-code"
        type="text" 
        value={code} 
        onChange={e => setCode(e.target.value)} 
        placeholder={currentPattern.example}
        style={{ 
          borderColor: isValid === null ? undefined : isValid ? 'var(--success)' : 'var(--error)'
        }}
      />

      {isValid !== null && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: isValid ? 'var(--success-bg)' : 'var(--error-bg)', 
          color: isValid ? 'var(--success)' : 'var(--error)',
          borderRadius: '8px'
        }}>
          {isValid ? `✓ Valid ${currentPattern.name} postal code` : `✗ Invalid format for ${currentPattern.name}`}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.875rem' }}>
        <strong>Format for {currentPattern.name}:</strong>
        <div style={{ marginTop: '0.5rem' }}>Example: <code>{currentPattern.example}</code></div>
      </div>

      <RelatedTools category="validator" exclude="/tools/postal-code-validator" />
      <ToolSeo />
    </div>
  )
}
