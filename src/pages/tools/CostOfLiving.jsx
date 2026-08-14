import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function CostOfLiving() {
  const [city1, setCity1] = useState('New York')
  const [city2, setCity2] = useState('London')

  // Sample data (in production, this would come from an API like Numbeo)
  const cityData = {
    'New York': { rent: 3500, food: 500, transport: 130, utilities: 150, index: 100 },
    'London': { rent: 2800, food: 450, transport: 180, utilities: 200, index: 87 },
    'Tokyo': { rent: 2000, food: 400, transport: 100, utilities: 180, index: 83 },
    'Berlin': { rent: 1500, food: 350, transport: 90, utilities: 250, index: 71 },
    'Mumbai': { rent: 600, food: 200, transport: 30, utilities: 50, index: 42 },
    'Dubai': { rent: 2200, food: 450, transport: 80, utilities: 120, index: 75 },
  }

  const cities = Object.keys(cityData)
  const data1 = cityData[city1] || cityData['New York']
  const data2 = cityData[city2] || cityData['London']

  function calculateDifference(val1, val2) {
    const diff = ((val2 - val1) / val1) * 100
    return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Cost of Living Comparison</h1>
      <p className="tool-description">Compare cost of living between cities worldwide including rent, food, transport, and utilities.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>📊 Sample Data</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This demo uses sample data. For real-time cost of living data, visit{' '}
          <a href="https://www.numbeo.com" target="_blank" rel="noopener">Numbeo.com</a> or{' '}
          <a href="https://www.expatistan.com" target="_blank" rel="noopener">Expatistan.com</a>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label htmlFor="city1-select">City 1</label>
          <select id="city1-select" value={city1} onChange={e => setCity1(e.target.value)}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="city2-select">City 2</label>
          <select id="city2-select" value={city2} onChange={e => setCity2(e.target.value)}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Monthly Costs (USD)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>Category</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--border)' }}>{city1}</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--border)' }}>{city2}</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--border)' }}>Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Rent (1BR city center)</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data1.rent.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data2.rent.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>
                  {calculateDifference(data1.rent, data2.rent)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Food (groceries)</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data1.food.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data2.food.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>
                  {calculateDifference(data1.food, data2.food)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Transport (pass)</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data1.transport.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data2.transport.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>
                  {calculateDifference(data1.transport, data2.transport)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Utilities</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data1.utilities.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>${data2.utilities.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>
                  {calculateDifference(data1.utilities, data2.utilities)}
                </td>
              </tr>
              <tr style={{ fontWeight: '600', background: 'var(--bg-secondary)' }}>
                <td style={{ padding: '0.75rem' }}>Total</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  ${(data1.rent + data1.food + data1.transport + data1.utilities).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  ${(data2.rent + data2.food + data2.transport + data2.utilities).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  {calculateDifference(
                    data1.rent + data1.food + data1.transport + data1.utilities,
                    data2.rent + data2.food + data2.transport + data2.utilities
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3>Cost of Living Index</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            (New York = 100, higher = more expensive)
          </p>
          <div className="stats-row" style={{ marginTop: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value">{data1.index}</div>
              <div className="stat-label">{city1}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{data2.index}</div>
              <div className="stat-label">{city2}</div>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools category="misc" exclude="/tools/cost-of-living" />
      <ToolSeo />
    </div>
  )
}
