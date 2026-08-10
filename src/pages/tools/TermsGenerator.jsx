import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function TermsGenerator() {
  const [site, setSite]     = useState('')
  const [owner, setOwner]   = useState('')
  const [email, setEmail]   = useState('')
  const [url, setUrl]       = useState('')
  const [copied, setCopied] = useState(false)

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const doc = (() => {
    if (!site) return ''
    const S = site || '[Site Name]'
    const O = owner || '[Owner Name]'
    const E = email || '[contact@example.com]'
    const U = url || '[https://example.com]'
    return `Terms and Conditions

Last updated: ${today}

Please read these Terms and Conditions ("Terms") carefully before using ${S} ("Service") operated by ${O}.

1. ACCEPTANCE OF TERMS
By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.

2. USE LICENSE
Permission is granted to temporarily access the materials on ${S} for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.

3. DISCLAIMER
The materials on ${S} are provided "as is". ${O} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. LIMITATIONS
In no event shall ${O} be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ${S}.

5. ACCURACY OF MATERIALS
The materials appearing on ${S} could include technical, typographical, or photographic errors. ${O} does not warrant that any of the materials on its website are accurate, complete, or current.

6. LINKS
${O} has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.

7. MODIFICATIONS
${O} may revise these Terms at any time without notice. By using ${S} you are agreeing to be bound by the then-current version of these Terms.

8. GOVERNING LAW
These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions.

9. CONTACT
If you have any questions about these Terms, please contact us at ${E}.

${U}`
  })()

  function copy() {
    navigator.clipboard.writeText(doc).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Terms & Conditions Generator</h1>
      <p className="tool-description">
        Generate a basic Terms &amp; Conditions document for your website. Fill in your details and copy the result. Always review with a legal professional for your specific needs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Website / App name', val: site,  set: setSite,   ph: 'My Awesome App' },
          { label: 'Owner / Company',    val: owner, set: setOwner,  ph: 'John Doe / ACME Inc.' },
          { label: 'Contact email',      val: email, set: setEmail,  ph: 'contact@example.com' },
          { label: 'Website URL',        val: url,   set: setUrl,    ph: 'https://example.com' },
        ].map(f => (
          <div key={f.label}>
            <label>{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
          </div>
        ))}
      </div>

      {doc && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Generated Terms &amp; Conditions</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={doc} style={{ minHeight: 380, fontFamily: 'inherit', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1rem' }}>
        ⚠ This is a template for informational purposes only. Consult a qualified legal professional for legally binding Terms &amp; Conditions.
      </p>

      <RelatedTools category="seo" exclude="/tools/terms-generator" />
      <ToolSeo />
    </div>
  )
}
