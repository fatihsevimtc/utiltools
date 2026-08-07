import { useState } from 'react'
import BackBar from '../../components/BackBar'

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function wrapPem(b64, label) {
  const lines = b64.match(/.{1,64}/g).join('\n')
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`
}

export default function RsaGenerator() {
  const [loading, setLoading] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [copiedPub, setCopiedPub] = useState(false)
  const [copiedPriv, setCopiedPriv] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['encrypt', 'decrypt']
      )
      const pubRaw  = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
      const privRaw = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
      setPublicKey(wrapPem(arrayBufferToBase64(pubRaw), 'PUBLIC KEY'))
      setPrivateKey(wrapPem(arrayBufferToBase64(privRaw), 'PRIVATE KEY'))
    } catch (e) {
      setError('Key generation failed: ' + e.message)
    }
    setLoading(false)
  }

  function copy(text, setter) {
    navigator.clipboard.writeText(text).then(() => { setter(true); setTimeout(() => setter(false), 1500) })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>RSA Key Generator</h1>
      <p className="tool-description">Generate RSA-2048 public/private key pairs entirely in your browser using the Web Crypto API.</p>

      <button className="btn" onClick={generate} disabled={loading} style={{ marginBottom: '1.5rem' }}>
        {loading ? 'Generating…' : '⚡ Generate RSA-2048 Key Pair'}
      </button>

      {error && <p style={{ color: 'var(--danger, #ef4444)', marginBottom: '1rem' }}>{error}</p>}

      {publicKey && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Public Key (SPKI / PEM)</label>
            <button className="btn btn-sm" onClick={() => copy(publicKey, setCopiedPub)}>{copiedPub ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.78rem' }}>{publicKey}</div>
        </div>
      )}

      {privateKey && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Private Key (PKCS#8 / PEM)</label>
            <button className="btn btn-sm" onClick={() => copy(privateKey, setCopiedPriv)}>{copiedPriv ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.78rem' }}>{privateKey}</div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.6 }}>⚠ Never share your private key. This is generated locally — nothing is sent to any server.</p>
        </div>
      )}
    </div>
  )
}
