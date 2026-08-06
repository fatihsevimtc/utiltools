import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const FIRST_NAMES = ['Alice','Bob','Charlie','Diana','Edward','Fiona','George','Hannah','Ivan','Julia','Kevin','Laura','Michael','Nina','Oscar','Paula','Quinn','Rachel','Samuel','Tina','Uma','Victor','Wendy','Xavier','Yvonne','Zachary','Aiden','Bella','Carlos','Daisy','Ethan','Faith','Grace','Henry','Iris','Jack']
const LAST_NAMES  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Robinson','Clark','Lewis','Lee','Walker','Hall','Allen','Young','King','Wright','Scott','Green','Baker','Adams','Nelson','Carter','Mitchell','Perez']
const STREETS  = ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Park Blvd','Lake Dr','Hill Rd','River Rd','Forest Ave','Sunset Blvd','Washington St','Lincoln Ave','Jefferson Rd']
const CITIES   = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte']
const STATES   = ['NY','CA','TX','FL','IL','PA','OH','GA','NC','MI','NJ','VA','WA','AZ','MA']
const DOMAINS  = ['gmail.com','yahoo.com','hotmail.com','outlook.com','example.com','mail.com','icloud.com','proton.me']
const COMPANIES = ['Acme Corp','Globex','Initech','Umbrella Corp','Soylent Corp','Hooli','Pied Piper','Dunder Mifflin','Vandelay Industries','Sterling Cooper','Massive Dynamic','Cyberdyne Systems','Oscorp','Stark Industries','Wayne Enterprises']

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function phone() {
  return `(${randInt(200,999)}) ${randInt(200,999)}-${String(randInt(1000,9999))}`
}

function email(first, last) {
  const sep = rand(['.', '_', ''])
  return `${first.toLowerCase()}${sep}${last.toLowerCase()}${randInt(1, 99)}@${rand(DOMAINS)}`
}

function address() {
  return `${randInt(1,9999)} ${rand(STREETS)}, ${rand(CITIES)}, ${rand(STATES)} ${String(randInt(10000,99999))}`
}

function generateRecord() {
  const first = rand(FIRST_NAMES)
  const last  = rand(LAST_NAMES)
  return {
    'First Name': first,
    'Last Name':  last,
    'Email':      email(first, last),
    'Phone':      phone(),
    'Address':    address(),
    'Company':    rand(COMPANIES),
    'Age':        String(randInt(18, 70)),
  }
}

const FIELDS = ['First Name','Last Name','Email','Phone','Address','Company','Age']

export default function FakeDataGenerator() {
  const [count, setCount] = useState(5)
  const [selected, setSelected] = useState(new Set(FIELDS))
  const [records, setRecords] = useState([])
  const [format, setFormat] = useState('table')
  const [copied, setCopied] = useState(false)

  function toggle(field) {
    setSelected(s => {
      const n = new Set(s)
      n.has(field) ? n.delete(field) : n.add(field)
      return n
    })
  }

  function generate() {
    setRecords(Array.from({ length: count }, generateRecord))
  }

  const activeFields = FIELDS.filter(f => selected.has(f))
  const filteredRecords = records.map(r => Object.fromEntries(activeFields.map(f => [f, r[f]])))

  function getOutput() {
    if (format === 'json') return JSON.stringify(filteredRecords, null, 2)
    if (format === 'csv') {
      const lines = [activeFields.join(','), ...filteredRecords.map(r => activeFields.map(f => `"${r[f]}"`).join(','))]
      return lines.join('\n')
    }
    // table: handled in JSX
    return ''
  }

  function copy() {
    navigator.clipboard.writeText(getOutput()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Fake Data Generator</h1>
      <p className="tool-description">Generate realistic fake names, emails, addresses, and more for testing.</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <label>Count: {count}</label>
          <input type="range" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: 120, accentColor: 'var(--accent)' }} />
        </div>
        <div className="chip-group" style={{ margin: 0 }}>
          {['table', 'json', 'csv'].map(f => (
            <button key={f} className={`chip ${format === f ? 'active' : ''}`} onClick={() => setFormat(f)}>{f.toUpperCase()}</button>
          ))}
        </div>
        <button className="btn" onClick={generate}>Generate</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {FIELDS.map(f => (
          <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text)' }}>
            <input type="checkbox" checked={selected.has(f)} onChange={() => toggle(f)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
            {f}
          </label>
        ))}
      </div>

      {records.length > 0 && (
        <>
          {format === 'table' ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr>{activeFields.map(f => <th key={f} style={{ textAlign: 'left', padding: '0.4rem 0.6rem', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' }}>{f}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                      {activeFields.map(f => <td key={f} style={{ padding: '0.35rem 0.6rem', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{r[f]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem' }}>
                <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
              <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', maxHeight: 400, overflow: 'auto' }}>{getOutput()}</div>
            </div>
          )}
        </>
      )}
      <RelatedTools category="developer" exclude="/tools/fake-data-generator" />
          <ToolSeo />
    </div>
  )
}
