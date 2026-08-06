import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

const CATEGORIES = {
  Length: {
    units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    // base: metres
    toBase: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  },
  Weight: {
    units: ['mg', 'g', 'kg', 'lb', 'oz', 'tonne'],
    // base: grams
    toBase: { mg: 0.001, g: 1, kg: 1000, lb: 453.592, oz: 28.3495, tonne: 1_000_000 },
  },
  Temperature: {
    units: ['°C', '°F', 'K'],
    // custom logic below
    toBase: null,
  },
  Speed: {
    units: ['m/s', 'km/h', 'mph', 'knots'],
    // base: m/s
    toBase: { 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704, knots: 0.514444 },
  },
  Area: {
    units: ['mm²', 'cm²', 'm²', 'km²', 'in²', 'ft²', 'acre', 'ha'],
    // base: m²
    toBase: { 'mm²': 1e-6, 'cm²': 1e-4, 'm²': 1, 'km²': 1e6, 'in²': 6.4516e-4, 'ft²': 0.092903, acre: 4046.86, ha: 10000 },
  },
}

function convertTemp(value, from, to) {
  let celsius
  if (from === '°C') celsius = value
  else if (from === '°F') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15

  if (to === '°C') return celsius
  if (to === '°F') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

function convert(value, from, to, category) {
  if (isNaN(value)) return ''
  if (from === to) return value
  if (category === 'Temperature') return +convertTemp(value, from, to).toFixed(6)
  const { toBase } = CATEGORIES[category]
  const base = value * toBase[from]
  return +(base / toBase[to]).toFixed(8)
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length')
  const cat = CATEGORIES[category]

  const [fromUnit, setFromUnit] = useState(cat.units[0])
  const [toUnit, setToUnit]     = useState(cat.units[2])
  const [value, setValue]       = useState('')

  function changeCategory(c) {
    setCategory(c)
    setFromUnit(CATEGORIES[c].units[0])
    setToUnit(CATEGORIES[c].units[2])
    setValue('')
  }

  const result = value !== '' ? convert(Number(value), fromUnit, toUnit, category) : ''

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Unit Converter</h1>
      <p className="tool-description">
        Convert length, weight, temperature, speed and area — all offline.
      </p>

      <div className="chip-group">
        {Object.keys(CATEGORIES).map(c => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => changeCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="uc-row">
        <div>
          <label>From</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
            {cat.units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="uc-arrow">→</div>
        <div>
          <label>To</label>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)}>
            {cat.units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="uc-input">Value</label>
        <input
          id="uc-input"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter a number…"
        />
      </div>

      {result !== '' && (
        <div className="stat-card" style={{ marginTop: '1.25rem', display: 'inline-block' }}>
          <div className="stat-value">{result.toLocaleString()}</div>
          <div className="stat-label">{toUnit}</div>
        </div>
      )}
          <ToolSeo />
    </div>
  )
}
