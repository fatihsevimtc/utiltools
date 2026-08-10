import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function DisclaimerGenerator() {
  const [type, setType]     = useState('general')
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [site, setSite]     = useState('')
  const [copied, setCopied] = useState(false)

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const TYPES = [
    { id: 'general',    label: 'General' },
    { id: 'affiliate',  label: 'Affiliate' },
    { id: 'medical',    label: 'Medical' },
    { id: 'legal',      label: 'Legal / Financial' },
  ]

  const N = name  || '[Your Name / Company]'
  const E = email || '[email@example.com]'
  const S = site  || '[Website Name]'

  const TEMPLATES = {
    general: `General Disclaimer

Last updated: ${today}

The information provided by ${N} on ${S} is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the site.

Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.

Contact: ${E}`,

    affiliate: `Affiliate Disclaimer

Last updated: ${today}

${S} is a participant in affiliate advertising programs. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission.

Affiliate programs and affiliations include, but are not limited to, Amazon Associates and similar programmes. ${N} is compensated for referring traffic and business to these companies, but this does not impact our reviews and comparisons.

Contact: ${E}`,

    medical: `Medical Disclaimer

Last updated: ${today}

The content on ${S} is provided for general informational purposes only and is not intended as, nor should it be considered a substitute for, professional medical advice, diagnosis, or treatment.

Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on ${S}.

${N} does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on the site.

Contact: ${E}`,

    legal: `Legal & Financial Disclaimer

Last updated: ${today}

The information contained on ${S} is provided by ${N} for general informational and educational purposes only and does not constitute legal, financial, tax, or investment advice.

The information is not a substitute for independent professional advice. Before taking any action based on information on this site, you should obtain appropriate professional advice relevant to your particular circumstances.

${N} makes no representations as to the completeness, accuracy or timeliness of the information contained herein.

Contact: ${E}`,
  }

  const doc = name ? TEMPLATES[type] : ''

  function copy() {
    navigator.clipboard.writeText(doc).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Disclaimer Generator</h1>
      <p className="tool-description">
        Generate a disclaimer for your website — choose from General, Affiliate, Medical, or Legal/Financial templates.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TYPES.map(t => (
          <button key={t.id} className={`chip ${type === t.id ? 'active' : ''}`} onClick={() => setType(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Your name / company', val: name,  set: setName,  ph: 'ACME Ltd.' },
          { label: 'Contact email',       val: email, set: setEmail, ph: 'hello@example.com' },
          { label: 'Website name',        val: site,  set: setSite,  ph: 'My Website' },
        ].map(f => (
          <div key={f.label}>
            <label>{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
          </div>
        ))}
      </div>

      {name && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Generated Disclaimer</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={doc} style={{ minHeight: 300, fontFamily: 'inherit', background: 'var(--surface)', cursor: 'default' }} />
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1rem' }}>
        ⚠ These templates are for informational purposes. Consult a legal professional for jurisdiction-specific disclaimers.
      </p>

      <RelatedTools category="seo" exclude="/tools/disclaimer-generator" />
      <ToolSeo />
    </div>
  )
}
