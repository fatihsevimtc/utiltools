import { useState } from 'react'
import BackBar from '../../components/BackBar'

const SIZES = [2, 3, 4]

function makeMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

function det2(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0] }
function det3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  )
}

function addMat(A, B) { return A.map((r, i) => r.map((v, j) => v + B[i][j])) }
function subMat(A, B) { return A.map((r, i) => r.map((v, j) => v - B[i][j])) }
function mulMat(A, B) {
  const rows = A.length, cols = B[0].length, inner = B.length
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) =>
      Array.from({ length: inner }, (__, k) => A[i][k] * B[k][j]).reduce((a, b) => a + b, 0)
    )
  )
}
function transposeMat(A) { return A[0].map((_, j) => A.map(r => r[j])) }

function MatrixInput({ matrix, onChange, label }) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${matrix[0].length}, 60px)`, gap: '4px', marginTop: '0.4rem' }}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={e => {
                const m = matrix.map(r => [...r])
                m[i][j] = parseFloat(e.target.value) || 0
                onChange(m)
              }}
              style={{ width: 56, textAlign: 'center', padding: '4px', fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
          ))
        )}
      </div>
    </div>
  )
}

function MatrixDisplay({ matrix, label }) {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${matrix[0].length}, 60px)`, gap: '4px', marginTop: '0.4rem' }}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <div key={`${i}-${j}`} style={{ width: 56, textAlign: 'center', padding: '4px', fontFamily: 'monospace', fontSize: '0.9rem', background: 'var(--surface2, #f5f5f5)', borderRadius: 4 }}>
              {Number.isInteger(val) ? val : parseFloat(val.toFixed(4))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function MatrixCalculator() {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)
  const [matA, setMatA] = useState(makeMatrix(2, 2))
  const [matB, setMatB] = useState(makeMatrix(2, 2))
  const [op, setOp] = useState('add')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function updateDims(r, c) {
    setRows(r); setCols(c)
    setMatA(makeMatrix(r, c)); setMatB(makeMatrix(r, c))
    setResult(null); setError('')
  }

  function calculate() {
    setError(''); setResult(null)
    try {
      if (op === 'add')       setResult({ type: 'matrix', val: addMat(matA, matB) })
      else if (op === 'sub')  setResult({ type: 'matrix', val: subMat(matA, matB) })
      else if (op === 'mul')  setResult({ type: 'matrix', val: mulMat(matA, matB) })
      else if (op === 'T')    setResult({ type: 'matrix', val: transposeMat(matA) })
      else if (op === 'det') {
        if (rows !== cols) { setError('Determinant requires a square matrix'); return }
        if (rows === 2)    setResult({ type: 'scalar', label: 'Determinant', val: det2(matA) })
        else if (rows === 3) setResult({ type: 'scalar', label: 'Determinant', val: det3(matA) })
        else setError('Determinant supported for 2×2 and 3×3 only')
      }
    } catch (e) {
      setError(e.message)
    }
  }

  const OPS = [
    { id: 'add', label: 'A + B' },
    { id: 'sub', label: 'A − B' },
    { id: 'mul', label: 'A × B' },
    { id: 'T',   label: 'Aᵀ (transpose)' },
    { id: 'det', label: 'det(A)' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Matrix Calculator</h1>
      <p className="tool-description">Add, subtract, multiply matrices and compute determinants — up to 4×4.</p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <label>Rows:</label>
        {SIZES.map(n => (
          <button key={n} className={`chip ${rows === n ? 'active' : ''}`} onClick={() => updateDims(n, cols)}>{n}</button>
        ))}
        <label style={{ marginLeft: '0.5rem' }}>Cols:</label>
        {SIZES.map(n => (
          <button key={n} className={`chip ${cols === n ? 'active' : ''}`} onClick={() => updateDims(rows, n)}>{n}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <MatrixInput matrix={matA} onChange={setMatA} label="Matrix A" />
        {(op === 'add' || op === 'sub' || op === 'mul') && (
          <MatrixInput matrix={matB} onChange={setMatB} label="Matrix B" />
        )}
      </div>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        {OPS.map(o => (
          <button key={o.id} className={`chip ${op === o.id ? 'active' : ''}`} onClick={() => { setOp(o.id); setResult(null); setError('') }}>
            {o.label}
          </button>
        ))}
      </div>

      <button className="btn" onClick={calculate}>Calculate</button>

      {error && <p style={{ color: 'var(--danger, #ef4444)', marginTop: '0.75rem' }}>{error}</p>}

      {result && result.type === 'matrix' && <MatrixDisplay matrix={result.val} label="Result" />}
      {result && result.type === 'scalar' && (
        <div style={{ marginTop: '1rem' }}>
          <label>{result.label}</label>
          <div className="code-block" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{result.val}</div>
        </div>
      )}
    </div>
  )
}
