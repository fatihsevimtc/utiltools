import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'

const EMPTY_ITEM = () => ({ id: crypto.randomUUID(), desc: '', qty: 1, rate: 0 })

const fmt = (n) => Number(n).toFixed(2)

export default function InvoiceMaker() {
  const [from, setFrom] = useState({ name: '', address: '', email: '', phone: '' })
  const [to, setTo]     = useState({ name: '', address: '', email: '' })
  const [meta, setMeta] = useState({
    number: 'INV-001',
    date: new Date().toISOString().slice(0, 10),
    due:  '',
    currency: 'USD',
  })
  const [items, setItems]   = useState([EMPTY_ITEM()])
  const [tax, setTax]       = useState(0)
  const [notes, setNotes]   = useState('')
  const [logo, setLogo]     = useState('')
  const printRef = useRef(null)

  const updateItem = useCallback((id, field, val) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it))
  }, [])
  const addItem    = () => setItems(prev => [...prev, EMPTY_ITEM()])
  const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id))

  const subtotal = items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate)), 0)
  const taxAmt   = subtotal * (Number(tax) / 100)
  const total    = subtotal + taxAmt

  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$', AUD: 'A$', CHF: 'CHF ', INR: '₹', TRY: '₺' }
  const sym = symbols[meta.currency] || meta.currency + ' '

  function handlePrint() { window.print() }

  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogo(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Invoice Maker</h1>
      <p className="tool-description">Create professional invoices in your browser and print or save as PDF — nothing is uploaded anywhere.</p>

      <style>{`
        @media print {
          body > * { display: none !important; }
          .invoice-print-area { display: block !important; }
          .no-print { display: none !important; }
        }
        .invoice-print-area { display: block; }
        .invoice-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        @media (max-width: 640px) { .invoice-form-grid { grid-template-columns: 1fr; } }
        .invoice-section-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; }
        .invoice-items-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .invoice-items-table th { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-align: left; padding: 0.4rem 0.5rem; border-bottom: 1px solid var(--border); }
        .invoice-items-table td { padding: 0.35rem 0.5rem; vertical-align: middle; }
        .invoice-items-table input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 4px; color: var(--text); padding: 0.3rem 0.4rem; font-size: 0.875rem; }
        .invoice-items-table input[type=number] { text-align: right; }
        .invoice-totals { margin-left: auto; width: min(100%, 280px); }
        .invoice-totals-row { display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.875rem; }
        .invoice-totals-row.total { font-weight: 700; font-size: 1rem; border-top: 2px solid var(--border); padding-top: 0.5rem; margin-top: 0.25rem; }

        /* ── Printable invoice ── */
        .print-invoice { font-family: Georgia, serif; font-size: 12pt; color: #111; max-width: 750px; margin: 0 auto; padding: 2rem; }
        .print-invoice h2 { font-size: 2rem; margin: 0 0 0.25rem; }
        .print-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .print-from { font-size: 0.85rem; line-height: 1.6; }
        .print-meta { text-align: right; font-size: 0.85rem; }
        .print-meta strong { display: block; font-size: 1.4rem; letter-spacing: 0.04em; margin-bottom: 0.5rem; }
        .print-addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .print-address-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin-bottom: 0.25rem; }
        .print-table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .print-table th { background: #f5f5f5; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .print-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #e5e5e5; font-size: 0.9rem; }
        .print-table td.num { text-align: right; }
        .print-totals { margin-left: auto; width: 260px; }
        .print-totals-row { display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.9rem; }
        .print-totals-row.grand { font-weight: 700; font-size: 1.05rem; border-top: 2px solid #111; padding-top: 0.5rem; }
        .print-notes { margin-top: 2rem; font-size: 0.85rem; color: #444; border-top: 1px solid #ddd; padding-top: 1rem; }
        .print-logo { max-height: 70px; max-width: 180px; object-fit: contain; margin-bottom: 0.5rem; }
      `}</style>

      {/* ── FORM (no-print) ── */}
      <div className="no-print">
        {/* Logo + meta */}
        <div className="invoice-form-grid" style={{ marginBottom: '1rem' }}>
          <div>
            <div className="invoice-section-label">Logo (optional)</div>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: '0.82rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem' }}>Invoice #</label>
              <input value={meta.number} onChange={e => setMeta(m => ({ ...m, number: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem' }}>Currency</label>
              <select value={meta.currency} onChange={e => setMeta(m => ({ ...m, currency: e.target.value }))} style={{ width: '100%' }}>
                {Object.keys(symbols).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem' }}>Invoice Date</label>
              <input type="date" value={meta.date} onChange={e => setMeta(m => ({ ...m, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem' }}>Due Date</label>
              <input type="date" value={meta.due} onChange={e => setMeta(m => ({ ...m, due: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="invoice-form-grid">
          <div>
            <div className="invoice-section-label">From (your details)</div>
            {[['name','Company / Your Name'],['address','Address'],['email','Email'],['phone','Phone']].map(([k,ph]) => (
              <input key={k} placeholder={ph} value={from[k]} onChange={e => setFrom(f => ({ ...f, [k]: e.target.value }))} style={{ marginBottom: '0.4rem' }} />
            ))}
          </div>
          <div>
            <div className="invoice-section-label">Bill To (client details)</div>
            {[['name','Client Name / Company'],['address','Address'],['email','Email']].map(([k,ph]) => (
              <input key={k} placeholder={ph} value={to[k]} onChange={e => setTo(t => ({ ...t, [k]: e.target.value }))} style={{ marginBottom: '0.4rem' }} />
            ))}
          </div>
        </div>

        {/* Line items */}
        <div className="invoice-section-label" style={{ marginTop: '1rem' }}>Line Items</div>
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Description</th>
              <th style={{ width: '12%' }}>Qty</th>
              <th style={{ width: '18%' }}>Unit Price</th>
              <th style={{ width: '18%' }}>Amount</th>
              <th style={{ width: '7%' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td><input value={it.desc} placeholder="Item description" onChange={e => updateItem(it.id, 'desc', e.target.value)} /></td>
                <td><input type="number" min="0" value={it.qty} onChange={e => updateItem(it.id, 'qty', e.target.value)} /></td>
                <td><input type="number" min="0" step="0.01" value={it.rate} onChange={e => updateItem(it.id, 'rate', e.target.value)} /></td>
                <td><input readOnly value={fmt(it.qty * it.rate)} style={{ background: 'transparent', border: 'none', fontWeight: 600 }} /></td>
                <td><button className="btn btn-sm" style={{ padding: '0.2rem 0.4rem', background: 'none', color: 'var(--muted)' }} onClick={() => removeItem(it.id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-sm" onClick={addItem}>+ Add item</button>

        {/* Tax + totals */}
        <div className="invoice-totals" style={{ marginTop: '1rem' }}>
          <div className="invoice-totals-row">
            <span>Subtotal</span><span>{sym}{fmt(subtotal)}</span>
          </div>
          <div className="invoice-totals-row" style={{ alignItems: 'center' }}>
            <span>Tax (<input type="number" min="0" max="100" value={tax} onChange={e => setTax(e.target.value)} style={{ width: 45, textAlign: 'center', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--surface2)', color: 'var(--text)', padding: '0.1rem 0.25rem' }} />%)</span>
            <span>{sym}{fmt(taxAmt)}</span>
          </div>
          <div className="invoice-totals-row total">
            <span>Total</span><span>{sym}{fmt(total)}</span>
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginTop: '1.25rem' }}>
          <div className="invoice-section-label">Notes / Payment Terms</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Payment due within 30 days. Thank you for your business!" style={{ minHeight: 80 }} />
        </div>

        <button className="btn" style={{ marginTop: '1.25rem' }} onClick={handlePrint}>🖨️ Print / Save as PDF</button>
      </div>

      {/* ── PRINTABLE INVOICE ── */}
      <div className="print-invoice invoice-print-area" ref={printRef}>
        <div className="print-header">
          <div>
            {logo && <img src={logo} alt="Logo" className="print-logo" />}
            <div className="print-from">
              <strong style={{ fontSize: '1.1rem' }}>{from.name || 'Your Company'}</strong>
              {from.address && <div style={{ whiteSpace: 'pre-line' }}>{from.address}</div>}
              {from.email && <div>{from.email}</div>}
              {from.phone && <div>{from.phone}</div>}
            </div>
          </div>
          <div className="print-meta">
            <strong>INVOICE</strong>
            <div><b>Invoice #:</b> {meta.number}</div>
            <div><b>Date:</b> {meta.date}</div>
            {meta.due && <div><b>Due:</b> {meta.due}</div>}
          </div>
        </div>

        <div className="print-addresses">
          <div>
            <div className="print-address-label">Bill To</div>
            <strong>{to.name || 'Client Name'}</strong>
            {to.address && <div style={{ whiteSpace: 'pre-line', marginTop: 4 }}>{to.address}</div>}
            {to.email && <div>{to.email}</div>}
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.filter(it => it.desc || it.qty || it.rate).map(it => (
              <tr key={it.id}>
                <td>{it.desc || '—'}</td>
                <td className="num">{it.qty}</td>
                <td className="num">{sym}{fmt(it.rate)}</td>
                <td className="num">{sym}{fmt(it.qty * it.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-totals">
          <div className="print-totals-row"><span>Subtotal</span><span>{sym}{fmt(subtotal)}</span></div>
          {Number(tax) > 0 && <div className="print-totals-row"><span>Tax ({tax}%)</span><span>{sym}{fmt(taxAmt)}</span></div>}
          <div className="print-totals-row grand"><span>Total</span><span>{sym}{fmt(total)}</span></div>
        </div>

        {notes && (
          <div className="print-notes">
            <strong>Notes</strong>
            <p style={{ marginTop: '0.4rem', whiteSpace: 'pre-line' }}>{notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
