import { useState, useRef } from 'react'
import BackBar from '../../components/BackBar'

/**
 * Minimal EXIF reader for JPEG files.
 * Reads the APP1/EXIF segment and decodes common tags.
 */
const EXIF_TAGS = {
  0x010F: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x011A: 'XResolution',
  0x011B: 'YResolution',
  0x0128: 'ResolutionUnit',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013B: 'Artist',
  0x013E: 'WhitePoint',
  0x013F: 'PrimaryChromaticities',
  0x0213: 'YCbCrPositioning',
  0x8769: 'ExifIFD',
  0x8825: 'GPSIFD',
  0x9000: 'ExifVersion',
  0x9003: 'DateTimeOriginal',
  0x9004: 'DateTimeDigitized',
  0x9201: 'ShutterSpeedValue',
  0x9202: 'ApertureValue',
  0x9203: 'BrightnessValue',
  0x9204: 'ExposureBiasValue',
  0x9205: 'MaxApertureValue',
  0x9207: 'MeteringMode',
  0x9208: 'LightSource',
  0x9209: 'Flash',
  0x920A: 'FocalLength',
  0x9286: 'UserComment',
  0xA002: 'PixelXDimension',
  0xA003: 'PixelYDimension',
  0xA405: 'FocalLengthIn35mmFilm',
  0xA406: 'SceneCaptureType',
  0x0100: 'ImageWidth',
  0x0101: 'ImageLength',
  0x0102: 'BitsPerSample',
  0x0103: 'Compression',
  0x8827: 'ISOSpeedRatings',
}

function readUint16(view, offset, le) { return view.getUint16(offset, le) }
function readUint32(view, offset, le) { return view.getUint32(offset, le) }

function readString(view, offset, length) {
  let s = ''
  for (let i = 0; i < length; i++) {
    const c = view.getUint8(offset + i)
    if (c === 0) break
    s += String.fromCharCode(c)
  }
  return s.trim()
}

function readRational(view, offset, le) {
  const num = readUint32(view, offset, le)
  const den = readUint32(view, offset + 4, le)
  if (den === 0) return '0'
  if (num % den === 0) return String(num / den)
  return `${num}/${den} (${(num / den).toFixed(2)})`
}

function readExif(buffer) {
  const view = new DataView(buffer)
  const tags = {}

  // JPEG starts with FF D8
  if (view.getUint16(0) !== 0xFFD8) return { error: 'Not a JPEG file' }

  let offset = 2
  while (offset < view.byteLength - 1) {
    if (view.getUint8(offset) !== 0xFF) break
    const marker = view.getUint16(offset)
    const length = view.getUint16(offset + 2)

    if (marker === 0xFFE1) {
      // APP1 - check for "Exif\0\0"
      const exifHeader = readString(view, offset + 4, 6)
      if (exifHeader.startsWith('Exif')) {
        const tiffStart = offset + 10
        const byteOrder = view.getUint16(tiffStart)
        const le = byteOrder === 0x4949

        const ifdOffset = readUint32(view, tiffStart + 4, le)
        const ifdCount = readUint16(view, tiffStart + ifdOffset, le)

        for (let i = 0; i < ifdCount; i++) {
          const entryOffset = tiffStart + ifdOffset + 2 + i * 12
          if (entryOffset + 12 > view.byteLength) break
          const tag = readUint16(view, entryOffset, le)
          const type = readUint16(view, entryOffset + 2, le)
          const count = readUint32(view, entryOffset + 4, le)
          const valueOffset = entryOffset + 8

          let value
          try {
            if (type === 2) { // ASCII
              const dataOffset = count > 4 ? tiffStart + readUint32(view, valueOffset, le) : valueOffset
              value = readString(view, dataOffset, count)
            } else if (type === 3) { // SHORT
              value = readUint16(view, valueOffset, le)
            } else if (type === 4) { // LONG
              value = readUint32(view, valueOffset, le)
            } else if (type === 5) { // RATIONAL
              const dataOffset = tiffStart + readUint32(view, valueOffset, le)
              value = readRational(view, dataOffset, le)
            } else {
              value = `(type ${type})`
            }
          } catch {
            value = '(read error)'
          }

          const name = EXIF_TAGS[tag]
          if (name && value !== undefined && value !== '') {
            tags[name] = String(value)
          }
        }
        return tags
      }
    }
    offset += 2 + length
  }
  return { note: 'No EXIF data found in this JPEG.' }
}

export default function ExifViewer() {
  const [data, setData] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  function processFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
    setError('')

    // Read as data URL for preview
    const reader = new FileReader()
    reader.onload = e => setImageSrc(e.target.result)
    reader.readAsDataURL(file)

    // Read as ArrayBuffer for EXIF
    const abReader = new FileReader()
    abReader.onload = e => {
      const result = readExif(e.target.result)
      setData(result)
    }
    abReader.readAsArrayBuffer(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const entries = data ? Object.entries(data).filter(([k]) => k !== 'error' && k !== 'note') : []

  return (
    <div className="tool-page">
      <BackBar />
      <h1>EXIF Viewer</h1>
      <p className="tool-description">
        Extract EXIF metadata from JPEG images — camera make/model, date, GPS, and more. Everything runs in your browser.
      </p>

      <div
        onClick={() => fileRef.current.click()}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 12, padding: '2rem', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(99,102,241,0.05)' : 'var(--surface)',
        }}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/jpg" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
        <p style={{ margin: 0, color: 'var(--muted)' }}>🖼️ Drop a JPEG here or click to browse</p>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {imageSrc && (
        <img src={imageSrc} alt="preview" style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', marginTop: '1rem' }} />
      )}

      {data && (
        <div style={{ marginTop: '1.25rem' }}>
          {data.error && <p style={{ color: 'var(--danger)' }}>⚠ {data.error}</p>}
          {data.note  && <p style={{ color: 'var(--muted)' }}>{data.note}</p>}

          {entries.length > 0 && (
            <div className="code-block" style={{ padding: '0.75rem 1rem' }}>
              {entries.map(([key, value]) => (
                <div key={key} style={{ display: 'flex', gap: '1rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  <span style={{ minWidth: 180, color: 'var(--accent)', fontSize: '0.85rem', flexShrink: 0 }}>{key}</span>
                  <code style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>{value}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
