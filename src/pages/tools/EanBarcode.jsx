import { useState, useRef, useEffect } from 'react'
import BackBar from '../../components/BackBar'

// EAN-13 encoding tables
const L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011']
const G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111']
const R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100']
const PARITY = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL']

function ean13Checksum(digits12) {
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(digits12[i]) * (i % 2 === 0 ? 1 : 3)
  return (10 - (sum % 10)) % 10
}

function drawEan13(canvas, digits13) {
  const ctx = canvas.getContext('2d')
  const modW = 3, height = 120, quietZone = 10, guardH = height - 14, textY = height - 4
  const totalWidth = (quietZone * 2 + 95) * modW + 20
  canvas.width = totalWidth
  canvas.height = height + 10
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const firstDigit = parseInt(digits13[0])
  const parity = PARITY[firstDigit]
  let x = quietZone * modW + 10

  function drawBars(bits, h) {
    for (const b of bits) {
      ctx.fillStyle = b === '1' ? '#000' : '#fff'
      ctx.fillRect(x, 5, modW, h)
      x += modW
    }
  }

  // Left quiet zone + first digit label
  ctx.fillStyle = '#000'
  ctx.font = `bold ${modW * 4}px monospace`
  ctx.textAlign = 'center'
  ctx.fillText(digits13[0], 6, textY)

  // Left guard 101
  drawBars('101', guardH)
  // 6 left digits
  for (let i = 1; i <= 6; i++) {
    const d = parseInt(digits13[i])
    const enc = parity[i - 1] === 'L' ? L[d] : G[d]
    drawBars(enc, height - 20)
    ctx.fillStyle = '#000'
    ctx.font = `bold ${modW * 3.5}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(digits13[i], x - modW * 3.5, textY)
  }
  // Center guard 01010
  drawBars('01010', guardH)
  // 6 right digits
  for (let i = 7; i <= 12; i++) {
    const d = parseInt(digits13[i])
    drawBars(R[d], height - 20)
    ctx.fillStyle = '#000'
    ctx.font = `bold ${modW * 3.5}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(digits13[i], x - modW * 3.5, textY)
  }
  // Right guard 101
  drawBars('101', guardH)
}

export default function EanBarcode() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  const digits12 = input.replace(/\D/g, '').slice(0, 12)
  const check = digits12.length === 12 ? ean13Checksum(digits12) : null
  const digits13 = digits12.length === 12 ? digits12 + check : null

  useEffect(() => {
    if (digits13 && canvasRef.current) {
      setError('')
      drawEan13(canvasRef.current, digits13)
    }
  }, [digits13])

  function handleInput(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 12)
    setInput(v)
    if (v.length > 0 && v.length < 12) setError(`Enter ${12 - v.length} more digit${12 - v.length !== 1 ? 's' : ''}`)
    else setError('')
  }

  function download() {
    if (!canvasRef.current) return
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `ean13-${digits13}.png`
    a.click()
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>EAN Barcode Generator</h1>
      <p className="tool-description">Generate EAN-13 barcodes from 12-digit numbers, rendered entirely in the browser.</p>

      <label htmlFor="ean-input">12-digit number (check digit auto-calculated)</label>
      <input
        id="ean-input"
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="590123412345"
        maxLength={12}
        style={{ fontFamily: 'monospace', fontSize: '1.3rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', letterSpacing: '0.1em' }}
      />

      {error && <p style={{ color: 'var(--danger, #ef4444)', marginTop: '0.3rem' }}>{error}</p>}
      {digits13 && <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', opacity: 0.7 }}>EAN-13: <strong>{digits13}</strong> (check digit: {check})</p>}

      {digits13 && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <canvas ref={canvasRef} style={{ border: '1px solid var(--border, #ddd)', borderRadius: '4px', background: '#fff' }} />
          <button className="btn btn-sm" onClick={download}>⬇ Download PNG</button>
        </div>
      )}
    </div>
  )
}
