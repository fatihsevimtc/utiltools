import { useState, useEffect, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const COMMON = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'TRY']

const CURRENCY_NAMES = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  AUD: 'Australian Dollar', CAD: 'Canadian Dollar', CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee', TRY: 'Turkish Lira',
  BRL: 'Brazilian Real', MXN: 'Mexican Peso', KRW: 'South Korean Won',
  SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar', NOK: 'Norwegian Krone',
  SEK: 'Swedish Krona', DKK: 'Danish Krone', NZD: 'New Zealand Dollar',
  ZAR: 'South African Rand', RUB: 'Russian Ruble', PLN: 'Polish Zloty',
  HUF: 'Hungarian Forint', CZK: 'Czech Koruna', ILS: 'Israeli Shekel',
  AED: 'UAE Dirham', SAR: 'Saudi Riyal', THB: 'Thai Baht', MYR: 'Malaysian Ringgit',
  IDR: 'Indonesian Rupiah', PHP: 'Philippine Peso', VND: 'Vietnamese Dong',
  PKR: 'Pakistani Rupee', BDT: 'Bangladeshi Taka', EGP: 'Egyptian Pound',
  RON: 'Romanian Leu', BGN: 'Bulgarian Lev', HRK: 'Croatian Kuna',
  ISK: 'Icelandic Króna', ARS: 'Argentine Peso', CLP: 'Chilean Peso',
  COP: 'Colombian Peso', PEN: 'Peruvian Sol',
}

function sortedCurrencies(allCodes) {
  const common = COMMON.filter(c => allCodes.includes(c))
  const rest = allCodes.filter(c => !COMMON.includes(c)).sort()
  return [...common, ...rest]
}

function CurrencySelect({ id, value, onChange, currencies }) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%' }}>
      {currencies.map(code => (
        <option key={code} value={code}>
          {code}{CURRENCY_NAMES[code] ? ` — ${CURRENCY_NAMES[code]}` : ''}
        </option>
      ))}
    </select>
  )
}

export default function CurrencyConverter() {
  const [rates, setRates]         = useState(null)      // { EUR: 0.92, ... } relative to `base`
  const [base, setBase]           = useState('USD')     // current API base
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const [fromCurrency, setFromCurrency] = useState('USD')
  const [amount, setAmount]             = useState('100')
  const [toRows, setToRows]             = useState([
    { id: 1, currency: 'EUR' },
    { id: 2, currency: 'GBP' },
    { id: 3, currency: 'AUD' },
  ])
  const [nextId, setNextId] = useState(4)

  // Fetch rates whenever fromCurrency changes (base = fromCurrency)
  // v2 API: https://api.frankfurter.dev/v2/rates?base=USD
  // Response: array of { date, base, quote, rate } objects
  const fetchRates = useCallback(async (from) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://api.frankfurter.dev/v2/rates?base=${from}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      // Convert array → { quote: rate } map
      const rateMap = {}
      let date = null
      for (const entry of data) {
        rateMap[entry.quote] = entry.rate
        if (!date) date = entry.date
      }
      setRates(rateMap)
      setBase(from)
      setLastUpdated(date)
    } catch (err) {
      setError('Could not load exchange rates. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates(fromCurrency)
  }, [fromCurrency, fetchRates])

  const currencies = rates ? sortedCurrencies(Object.keys(rates)) : COMMON

  // Convert: amount in fromCurrency → toCurrency
  // Since rates are already relative to fromCurrency (base), rate for toCurrency is direct.
  function convert(toCurrency) {
    const n = parseFloat(amount)
    if (!rates || isNaN(n) || n <= 0) return null
    if (toCurrency === fromCurrency) return n
    const rate = rates[toCurrency]
    if (!rate) return null
    return n * rate
  }

  function handleSwap(rowId) {
    const row = toRows.find(r => r.id === rowId)
    if (!row) return
    const oldFrom = fromCurrency
    setFromCurrency(row.currency)
    setToRows(prev => prev.map(r => r.id === rowId ? { ...r, currency: oldFrom } : r))
  }

  function handleFromChange(newFrom) {
    setFromCurrency(newFrom)
    // Remove any "to" row that matches the new from to avoid same-currency rows
    setToRows(prev => prev.map(r =>
      r.currency === newFrom ? { ...r, currency: currencies.find(c => c !== newFrom) || 'EUR' } : r
    ))
  }

  function addRow() {
    const used = new Set([fromCurrency, ...toRows.map(r => r.currency)])
    const next = currencies.find(c => !used.has(c)) || currencies[0]
    setToRows(prev => [...prev, { id: nextId, currency: next }])
    setNextId(n => n + 1)
  }

  function removeRow(id) {
    setToRows(prev => prev.filter(r => r.id !== id))
  }

  function formatResult(val, toCurrency) {
    if (val === null) return '—'
    // JPY, KRW, IDR, VND have no decimals
    const noDecimals = ['JPY', 'KRW', 'IDR', 'VND', 'HUF', 'CLP']
    const decimals = noDecimals.includes(toCurrency) ? 0 : 2
    return val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  const numAmount = parseFloat(amount)
  const hasAmount = !isNaN(numAmount) && numAmount > 0

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Currency Converter</h1>
      <p className="tool-description">Convert between world currencies using live daily exchange rates.</p>

      {/* Error state */}
      {error && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid #ef4444', borderRadius: 8, padding: '0.9rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#ef4444', flex: 1 }}>{error}</span>
          <button className="btn" onClick={() => fetchRates(fromCurrency)}>Retry</button>
        </div>
      )}

      {/* Amount + From currency */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 120px', minWidth: 100 }}>
          <label htmlFor="cc-amount">Amount</label>
          <input
            id="cc-amount"
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="100"
          />
        </div>
        <div style={{ flex: '2 1 180px', minWidth: 150 }}>
          <label htmlFor="cc-from">From</label>
          {loading && !rates ? (
            <div style={{ padding: '0.6rem 0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: '0.9rem' }}>Loading currencies…</div>
          ) : (
            <CurrencySelect id="cc-from" value={fromCurrency} onChange={handleFromChange} currencies={currencies} />
          )}
        </div>
      </div>

      {/* To currency rows */}
      <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {toRows.map(row => {
          const result = convert(row.currency)
          return (
            <div key={row.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>

              {/* Swap button */}
              <button
                onClick={() => handleSwap(row.id)}
                title="Swap currencies"
                disabled={loading}
                style={{ marginBottom: 0, alignSelf: 'flex-end', padding: '0.55rem 0.7rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', color: 'var(--muted)', transition: 'color 0.15s', flexShrink: 0 }}
                aria-label="Swap from and to currencies"
              >⇄</button>

              {/* To selector */}
              <div style={{ flex: '2 1 160px', minWidth: 140 }}>
                <label htmlFor={`cc-to-${row.id}`}>To</label>
                <CurrencySelect
                  id={`cc-to-${row.id}`}
                  value={row.currency}
                  onChange={code => setToRows(prev => prev.map(r => r.id === row.id ? { ...r, currency: code } : r))}
                  currencies={currencies}
                />
              </div>

              {/* Result */}
              <div style={{ flex: '2 1 140px', minWidth: 120, alignSelf: 'flex-end', position: 'relative' }}>
                <div style={{ padding: '0.55rem 0.85rem', paddingRight: toRows.length > 1 ? '2.2rem' : '0.85rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, minHeight: 42, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {loading ? (
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading…</span>
                  ) : !hasAmount ? (
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Enter an amount</span>
                  ) : result === null ? (
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>—</span>
                  ) : (
                    <>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{formatResult(result, row.currency)}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{row.currency}</span>
                    </>
                  )}
                </div>
                {/* Remove button inside result box — always aligned, large touch target on mobile */}
                {toRows.length > 1 && (
                  <button
                    onClick={() => removeRow(row.id)}
                    title="Remove row"
                    style={{ position: 'absolute', top: '50%', right: '0.3rem', transform: 'translateY(-50%)', padding: 0, width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
                    aria-label="Remove this currency row"
                  >✕</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add row */}
      <button
        className="btn"
        onClick={addRow}
        disabled={loading}
        style={{ marginTop: '0.85rem' }}
      >+ Add currency</button>

      {/* Rate info */}
      <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {lastUpdated && (
          <span>Last updated: <strong>{lastUpdated}</strong></span>
        )}
        <span>Exchange rates from <a href="https://frankfurter.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>frankfurter.dev</a> — updated daily.</span>
        <span style={{ marginTop: '0.35rem' }}>🔒 All calculations happen locally in your browser. No data is sent to any server.</span>
      </div>

      <RelatedTools category="math" exclude="/tools/currency-converter" />
      <ToolSeo />
    </div>
  )
}
