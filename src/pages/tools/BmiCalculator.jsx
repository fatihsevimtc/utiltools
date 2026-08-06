import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const CATEGORIES = [
  { max: 18.5, label: 'Underweight',      color: '#3b82f6' },
  { max: 25,   label: 'Normal weight',    color: '#10b981' },
  { max: 30,   label: 'Overweight',       color: '#f59e0b' },
  { max: 35,   label: 'Obese (Class I)',  color: '#ef4444' },
  { max: 40,   label: 'Obese (Class II)', color: '#dc2626' },
  { max: Infinity, label: 'Obese (Class III)', color: '#7f1d1d' },
]

function getBmi(weight, height) {
  return weight / (height * height)
}

function getCategory(bmi) {
  return CATEGORIES.find(c => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1]
}

function idealWeightRange(height) {
  // BMI 18.5–24.9
  const min = (18.5 * height * height).toFixed(1)
  const max = (24.9 * height * height).toFixed(1)
  return { min, max }
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('')   // kg or lbs
  const [height, setHeight] = useState('')   // cm or inches

  let bmi = null, category = null, ideal = null
  const w = parseFloat(weight), h = parseFloat(height)
  if (w > 0 && h > 0) {
    const wKg = unit === 'metric' ? w : w * 0.453592
    const hM  = unit === 'metric' ? h / 100 : h * 0.0254
    bmi = getBmi(wKg, hM)
    category = getCategory(bmi)
    ideal = idealWeightRange(hM)
  }

  const percent = bmi ? Math.min((bmi / 45) * 100, 100) : 0

  return (
    <div className="tool-page">
      <BackBar />
      <h1>BMI Calculator</h1>
      <p className="tool-description">Calculate your Body Mass Index and see which category you fall in.</p>

      <div className="chip-group">
        <button className={`chip ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>Metric (kg / cm)</button>
        <button className={`chip ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>Imperial (lbs / in)</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label htmlFor="bmi-weight">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input id="bmi-weight" type="number" min={1} value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? '70' : '154'} />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label htmlFor="bmi-height">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input id="bmi-height" type="number" min={1} value={height} onChange={e => setHeight(e.target.value)} placeholder={unit === 'metric' ? '175' : '69'} />
        </div>
      </div>

      {bmi !== null && (
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: category.color, lineHeight: 1 }}>{bmi.toFixed(1)}</div>
            <div style={{ fontSize: '1.1rem', color: category.color, fontWeight: 600, marginTop: '0.3rem' }}>{category.label}</div>
          </div>

          {/* Visual gauge */}
          <div style={{ position: 'relative', height: 12, borderRadius: 6, background: 'linear-gradient(to right, #3b82f6, #10b981, #f59e0b, #ef4444, #7f1d1d)', marginBottom: '0.4rem' }}>
            <div style={{ position: 'absolute', top: -4, left: `${percent}%`, transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: category.color, border: '3px solid var(--bg)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)' }}>
            <span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span>
          </div>

          {ideal && (
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--muted)', textAlign: 'center' }}>
              Healthy weight range: {unit === 'metric' ? `${ideal.min}–${ideal.max} kg` : `${(parseFloat(ideal.min) * 2.20462).toFixed(1)}–${(parseFloat(ideal.max) * 2.20462).toFixed(1)} lbs`}
            </p>
          )}
        </div>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
        BMI is a screening tool, not a diagnostic measure. Consult a healthcare professional for medical advice.
      </p>
      <RelatedTools category="math" exclude="/tools/bmi" />
          <ToolSeo />
    </div>
  )
}
