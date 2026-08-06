import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

// Lightweight JSON Schema validator (draft-07 subset)
function validate(data, schema, path = '#') {
  const errors = []

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type]
    const jsType = data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data
    if (!types.includes(jsType)) {
      errors.push({ path, message: `Expected type "${types.join('|')}", got "${jsType}"` })
      return errors
    }
  }

  if (schema.enum && !schema.enum.some(v => JSON.stringify(v) === JSON.stringify(data))) {
    errors.push({ path, message: `Value must be one of: ${schema.enum.map(v => JSON.stringify(v)).join(', ')}` })
  }

  if (schema.const !== undefined && JSON.stringify(data) !== JSON.stringify(schema.const)) {
    errors.push({ path, message: `Value must be ${JSON.stringify(schema.const)}` })
  }

  // String validations
  if (typeof data === 'string') {
    if (schema.minLength !== undefined && data.length < schema.minLength)
      errors.push({ path, message: `String too short (min ${schema.minLength}, got ${data.length})` })
    if (schema.maxLength !== undefined && data.length > schema.maxLength)
      errors.push({ path, message: `String too long (max ${schema.maxLength}, got ${data.length})` })
    if (schema.pattern) {
      try { if (!new RegExp(schema.pattern).test(data)) errors.push({ path, message: `Does not match pattern: ${schema.pattern}` }) }
      catch { errors.push({ path, message: `Invalid pattern: ${schema.pattern}` }) }
    }
    if (schema.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data))
      errors.push({ path, message: 'Invalid email format' })
    if (schema.format === 'uri' && !/^https?:\/\/.+/.test(data))
      errors.push({ path, message: 'Invalid URI format' })
  }

  // Number validations
  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum)
      errors.push({ path, message: `Value ${data} < minimum ${schema.minimum}` })
    if (schema.maximum !== undefined && data > schema.maximum)
      errors.push({ path, message: `Value ${data} > maximum ${schema.maximum}` })
    if (schema.multipleOf !== undefined && data % schema.multipleOf !== 0)
      errors.push({ path, message: `Value must be a multiple of ${schema.multipleOf}` })
  }

  // Object validations
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    if (schema.required) {
      for (const req of schema.required) {
        if (!(req in data)) errors.push({ path, message: `Missing required property: "${req}"` })
      }
    }
    if (schema.properties) {
      for (const [key, subSchema] of Object.entries(schema.properties)) {
        if (key in data) errors.push(...validate(data[key], subSchema, `${path}.${key}`))
      }
    }
    if (schema.additionalProperties === false && schema.properties) {
      const allowed = new Set(Object.keys(schema.properties))
      for (const key of Object.keys(data)) {
        if (!allowed.has(key)) errors.push({ path: `${path}.${key}`, message: `Additional property "${key}" not allowed` })
      }
    }
    if (schema.minProperties !== undefined && Object.keys(data).length < schema.minProperties)
      errors.push({ path, message: `Object must have at least ${schema.minProperties} properties` })
    if (schema.maxProperties !== undefined && Object.keys(data).length > schema.maxProperties)
      errors.push({ path, message: `Object must have at most ${schema.maxProperties} properties` })
  }

  // Array validations
  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems)
      errors.push({ path, message: `Array too short (min ${schema.minItems}, got ${data.length})` })
    if (schema.maxItems !== undefined && data.length > schema.maxItems)
      errors.push({ path, message: `Array too long (max ${schema.maxItems}, got ${data.length})` })
    if (schema.items) {
      data.forEach((item, i) => errors.push(...validate(item, schema.items, `${path}[${i}]`)))
    }
    if (schema.uniqueItems) {
      const seen = new Set()
      data.forEach((item, i) => {
        const key = JSON.stringify(item)
        if (seen.has(key)) errors.push({ path: `${path}[${i}]`, message: 'Duplicate item (uniqueItems violated)' })
        seen.add(key)
      })
    }
  }

  return errors
}

const EXAMPLE_SCHEMA = `{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age":  { "type": "number", "minimum": 0, "maximum": 150 },
    "email": { "type": "string", "format": "email" }
  },
  "additionalProperties": false
}`

const EXAMPLE_DATA = `{
  "name": "Alice",
  "age": 30,
  "email": "alice@example.com"
}`

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState(EXAMPLE_SCHEMA)
  const [data, setData]     = useState(EXAMPLE_DATA)

  const result = useMemo(() => {
    let parsedSchema, parsedData
    try { parsedSchema = JSON.parse(schema) } catch { return { schemaError: 'Invalid JSON in schema' } }
    try { parsedData   = JSON.parse(data)   } catch { return { dataError:   'Invalid JSON in data'   } }
    const errors = validate(parsedData, parsedSchema)
    return { errors, parsedData }
  }, [schema, data])

  const isValid = result.errors?.length === 0

  return (
    <div className="tool-page" style={{ maxWidth: 1000 }}>
      <BackBar />
      <h1>JSON Schema Validator</h1>
      <p className="tool-description">Validate JSON data against a JSON Schema (draft-07 subset). All validation runs in your browser.</p>

      <div className="diff-grid" style={{ marginBottom: '1rem' }}>
        <div>
          <label htmlFor="jsv-schema">JSON Schema</label>
          <textarea id="jsv-schema" value={schema} onChange={e => setSchema(e.target.value)}
            style={{ minHeight: 260, fontFamily: 'monospace', fontSize: '0.85rem' }} />
          {result.schemaError && <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: '0.3rem' }}>{result.schemaError}</p>}
        </div>
        <div>
          <label htmlFor="jsv-data">JSON Data</label>
          <textarea id="jsv-data" value={data} onChange={e => setData(e.target.value)}
            style={{ minHeight: 260, fontFamily: 'monospace', fontSize: '0.85rem' }} />
          {result.dataError && <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: '0.3rem' }}>{result.dataError}</p>}
        </div>
      </div>

      {result.errors !== undefined && (
        <div>
          {isValid ? (
            <div className="notice" style={{ background: 'rgba(46,204,113,0.1)', border: '1px solid var(--success)', color: 'var(--success)' }}>
              ✓ Valid — data matches the schema perfectly.
            </div>
          ) : (
            <>
              <div className="notice notice-error" style={{ marginBottom: '1rem' }}>
                ✗ {result.errors.length} validation error{result.errors.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {result.errors.map((e, i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', padding: '0.65rem 1rem', display: 'grid', gap: '0.2rem' }}>
                    <code style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{e.path}</code>
                    <span style={{ fontSize: '0.875rem' }}>{e.message}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
