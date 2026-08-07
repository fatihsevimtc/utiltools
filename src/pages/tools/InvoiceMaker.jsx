import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'

const EMPTY_ITEM = () => ({ id: crypto.randomUUID(), desc: '', qty: 1, rate: 0 })
const fmt = (n) => Number(n).toFixed(2)

// Injected into the popup window — hardcoded light colors, print-safe
const PRINT_CSS = `
  * { box-sizing: border-box; }
  body { font-family: Georgia, serif; font-size: 12pt; color: #111; margin: 0; padding: 2rem; background: #fff; }
  .ph { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
  .pf { font-size: 0.85rem; line-height: 1.7; }
  .pm { text-align: right; font-size: 0.85rem; }
  .pm strong { display: block; font-size: 1.6rem; letter-spacing: 0.06em; margin-bottom: 0.4rem; color: #333; }
  .pa { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; border-top: 2px solid #111; padding-top: 1rem; }
  .pal { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 0.3rem; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
  th { background: #f0f0f0; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #ccc; }
  td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #e5e5e5; font-size: 0.9rem; }
  td.r { text-align: right; }
  .tot { margin-left: auto; width: 280px; }
  .tr { display: flex; justify-content: space-between; padding: 0.28rem 0; font-size: 0.9rem; border-bottom: 1px solid #eee; }
  .tr.grand { font-weight: 700; font-size: 1.05rem; border-top: 2px solid #111; border-bottom: none; padding-top: 0.5rem; margin-top: 0.25rem; }
  .notes { margin-top: 2rem; font-size: 0.82rem; color: #555; border-top: 1px solid #ddd; padding-top: 1rem; }
  img.logo { max-height: 64px; max-width: 160px; object-fit: contain; margin-bottom: 0.4rem; display: block; }
`

const SYMBOLS = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$', AUD: 'A$', CHF: 'CHF ', INR: '₹', TRY: '₺' }

export default function InvoiceMaker() {
  const [from, setFrom] = useState({ name: '', address: '', email: '', phone: '' })
  const [to, setTo]     = useState({ name: '', address: '', email: '' })
  const [meta, setMeta] = useState({
    number: 'INV-001',
    date: new Date().toISOString().slice(0, 10),
    due: '',
    currency: 'USD',
  })
  const [items, setItems] = useState([EMPTY_ITEM()])
  const [tax, setTax]     = useState(0)
  const [notes, setNotes] = useState('')
  const [logo, setLogo]   = useState('')
  const printRef = useRef(null)

  const sym = SYMBOLS[meta.currency] || meta.currency + ' '

  const updateItem = useCallback((id, field, val) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it))
  }, [])

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const taxAmt   = subtotal * (Number(tax) / 100)
  const total    = subtotal + taxAmt

  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogo(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handlePrint() {
    const w = window.open('', '_blank', 'width=840,height=700')
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${meta.number}</title><style>${PRINT_CSS}</style></head><body>${printRef.current.innerHTML}</body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 350)
  }

  const iStyle = { width: '100%', marginBottom: '0.4rem' }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Invoice Maker</h1>
      <p className="tool-description">Create professional invoices and save as PDF — nothing is uploaded anywhere.</p>

      <div className="invoice-form-grid" style={{ marginBottom: '1rem' }}>
        <div>
          <div className="invoice-section-label">Logo (optional)</div>
          <label className="file-upload-label">
            {logo ? '✓ Logo loaded — click to change' : '📁 Choose image…'}
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </label>
          {logo && <img src={logo} alt="logo preview" style={{ marginTop: '0.5rem', maxHeight: 48, maxWidth: 140, objectFit: 'contain', display: 'block', borderRadius: 4 }} />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label>Invoice #</label>
            <input value={meta.number} onChange={e => setMeta(m => ({ ...m, number: e.target.value }))} />
          </div>
          <div>
            <label>Currency</label>
            <select value={meta.currency} onChange={e => setMeta(m => ({ ...m, currency: e.target.value }))} style={{ width: '100%' }}>
              {Object.keys(SYMBOLS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Invoice Date</label>
            <input type="date" value={meta.date} onChange={e => setMeta(m => ({ ...m, date: e.target.value }))} />
          </div>
          <div>
            <label>Due Date</label>
            <input type="date" value={meta.due} onChange={e => setMeta(m => ({ ...m, due: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="invoice-form-grid">
        <div>
          <div className="invoice-section-label">From (your details)</div>
          {[['name','Company / Your Name'],['address','Address'],['email','Email'],['phone','Phone']].map(([k, ph]) => (
            <input key={k} placeholder={ph} value={from[k]} onChange={e => setFrom(f => ({ ...f, [k]: e.target.value }))} style={iStyle} />
          ))}
        </div>
        <div>
          <div className="invoice-section-label">Bill To</div>
          {[['name','Client Name / Company'],['address','Address'],['email','Email']].map(([k, ph]) => (
            <input key={k} placeholder={ph} value={to[k]} onChange={e => setTo(t => ({ ...t, [k]: e.target.value }))} style={iStyle} />
          ))}
        </div>
      </div>

      <div className="invoice-section-label" style={{ marginTop: '1.25rem' }}>Line Items</div>
      <table className="invoice-items-table">
        <thead>
          <tr>
            <th style={{ width: '45%' }}>Description</th>
            <th style={{ width: '12%' }}>Qty</th>
            <th style={{ width: '18%' }}>Unit Price</th>
            <th style={{ width: '18%', textAlign: 'right' }}>Amount</th>
            <th style={{ width: '7%' }} />
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td><input value={it.desc} placeholder="Item description" onChange={e => updateItem(it.id, 'desc', e.target.value)} style={{ width: '100%' }} /></td>
              <td><input type="number" min="0" value={it.qty} onChange={e => updateItem(it.id, 'qty', e.target.value)} style={{ width: '100%', textAlign: 'right' }} /></td>
              <td><input type="number" min="0" step="0.01" value={it.rate} onChange={e => updateItem(it.id, 'rate', e.target.value)} style={{ width: '100%', textAlign: 'right' }} /></td>
              <td style={{ textAlign: 'right', fontWeight: 600, padding: '0 0.5rem', color: 'var(--text)' }}>{sym}{fmt(it.qty * it.rate)}</td>
              <td><button className="btn btn-sm" style={{ padding: '0.2rem 0.5rem', background: 'none', color: 'var(--muted)' }} onClick={() => setItems(p => p.filter(x => x.id !== it.id))}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-sm" onClick={() => setItems(p => [...p, EMPTY_ITEM()])}>+ Add item</button>

      <div className="invoice-totals" style={{ marginTop: '1rem' }}>
        <div className="invoice-totals-row"><span>Subtotal</span><span>{sym}{fmt(subtotal)}</span></div>
        <div className="invoice-totals-row" style={{ alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Tax
            <input type="number" min="0" max="100" value={tax} onChange={e => setTax(e.target.value)} style={{ width: 52, textAlign: 'center' }} />
            %
          </span>
          <span>{sym}{fmt(taxAmt)}</span>
        </div>
        <div className="invoice-totals-row total"><span>Total</span><span>{sym}{fmt(total)}</span></div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div className="invoice-section-label">Notes / Payment Terms</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Payment due within 30 days. Thank you for your business!"
          style={{ minHeight: 80 }} />
      </div>

      <button className="btn" style={{ marginTop: '1.25rem' }} onClick={handlePrint}>🖨️ Print / Save as PDF</button>

      {/* Live preview — always light-mode colors so it matches the PDF output */}
      <div style={{ marginTop: '2rem' }}>
        <div className="invoice-section-label">Preview</div>
        <div style={{
          background: '#fff', color: '#111', borderRadius: 8,
          border: '1px solid #d0d0d0', padding: '2rem',
          fontFamily: 'Georgia, serif', fontSize: '12pt',
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              {logo && <img src={logo} alt="logo" style={{ maxHeight: 56, maxWidth: 140, objectFit: 'contain', display: 'block', marginBottom: 6 }} />}
              <div style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#222' }}>
                <strong style={{ fontSize: '1.05rem' }}>{from.name || <span style={{ color: '#aaa' }}>Your Company</span>}</strong>
                {from.address && <div style={{ whiteSpace: 'pre-line' }}>{from.address}</div>}
                {from.email && <div>{from.email}</div>}
                {from.phone && <div>{from.phone}</div>}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#333' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.06em', color: '#111', marginBottom: 4 }}>INVOICE</div>
              <div><b>Invoice #:</b> {meta.number}</div>
              <div><b>Date:</b> {meta.date || '—'}</div>
              {meta.due && <div><b>Due:</b> {meta.due}</div>}
            </div>
          </div>

          {/* Bill To */}
          <div style={{ borderTop: '2px solid #111', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 4 }}>Bill To</div>
            <div style={{ color: '#111', fontSize: '0.9rem' }}>
              <strong>{to.name || <span style={{ color: '#aaa' }}>Client Name</span>}</strong>
              {to.address && <div style={{ whiteSpace: 'pre-line', marginTop: 2, color: '#333' }}>{to.address}</div>}
              {to.email && <div style={{ color: '#333' }}>{to.email}</div>}
            </div>
          </div>

          {/* Items table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                {['Description','Qty','Unit Price','Amount'].map((h, i) => (
                  <th key={h} style={{ padding: '0.45rem 0.65rem', textAlign: i === 0 ? 'left' : 'right', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#444', borderBottom: '2px solid #ccc', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                  <td style={{ padding: '0.45rem 0.65rem', color: '#111', fontSize: '0.88rem' }}>{it.desc || <span style={{ color: '#bbb' }}>—</span>}</td>
                  <td style={{ padding: '0.45rem 0.65rem', textAlign: 'right', color: '#333', fontSize: '0.88rem' }}>{it.qty}</td>
                  <td style={{ padding: '0.45rem 0.65rem', textAlign: 'right', color: '#333', fontSize: '0.88rem' }}>{sym}{fmt(it.rate)}</td>
                  <td style={{ padding: '0.45rem 0.65rem', textAlign: 'right', color: '#111', fontWeight: 600, fontSize: '0.88rem' }}>{sym}{fmt(Number(it.qty) * Number(it.rate))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ marginLeft: 'auto', width: 'min(100%, 260px)' }}>
            {[
              ['Subtotal', sym + fmt(subtotal)],
              ...(Number(tax) > 0 ? [[`Tax (${tax}%)`, sym + fmt(taxAmt)]] : []),
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.88rem', color: '#333', borderBottom: '1px solid #eee' }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#111', borderTop: '2px solid #111', marginTop: 4 }}>
              <span>Total</span><span>{sym}{fmt(total)}</span>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem', fontSize: '0.82rem', color: '#555' }}>
              <strong style={{ color: '#333' }}>Notes</strong>
              <p style={{ marginTop: '0.35rem', whiteSpace: 'pre-line' }}>{notes}</p>
            </div>
          )}
        </div>
      </div>
      <div ref={printRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div className="ph">
          <div>
            {logo && <img src={logo} className="logo" alt="logo" />}
            <div className="pf">
              <strong style={{ fontSize: '1.1rem' }}>{from.name || 'Your Company'}</strong>
              {from.address && <div style={{ whiteSpace: 'pre-line' }}>{from.address}</div>}
              {from.email && <div>{from.email}</div>}
              {from.phone && <div>{from.phone}</div>}
            </div>
          </div>
          <div className="pm">
            <strong>INVOICE</strong>
            <div><b>Invoice #:</b> {meta.number}</div>
            <div><b>Date:</b> {meta.date}</div>
            {meta.due && <div><b>Due:</b> {meta.due}</div>}
          </div>
        </div>

        <div className="pa">
          <div>
            <div className="pal">Bill To</div>
            <strong>{to.name || '—'}</strong>
            {to.address && <div style={{ whiteSpace: 'pre-line', marginTop: 4 }}>{to.address}</div>}
            {to.email && <div>{to.email}</div>}
          </div>
          <div />
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.filter(it => it.desc || Number(it.qty) || Number(it.rate)).map(it => (
              <tr key={it.id}>
                <td>{it.desc || '—'}</td>
                <td className="r">{it.qty}</td>
                <td className="r">{sym}{fmt(it.rate)}</td>
                <td className="r">{sym}{fmt(Number(it.qty) * Number(it.rate))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tot">
          <div className="tr"><span>Subtotal</span><span>{sym}{fmt(subtotal)}</span></div>
          {Number(tax) > 0 && <div className="tr"><span>Tax ({tax}%)</span><span>{sym}{fmt(taxAmt)}</span></div>}
          <div className="tr grand"><span>Total</span><span>{sym}{fmt(total)}</span></div>
        </div>

        {notes && (
          <div className="notes">
            <strong>Notes</strong>
            <p style={{ marginTop: '0.4rem', whiteSpace: 'pre-line' }}>{notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
