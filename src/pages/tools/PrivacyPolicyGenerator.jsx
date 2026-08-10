import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PrivacyPolicyGenerator() {
  const [form, setForm] = useState({
    companyName: '',
    website: '',
    email: '',
    effectiveDate: new Date().toISOString().slice(0, 10),
    collectsEmail: true,
    collectsName: true,
    collectsAnalytics: true,
    collectsCookies: true,
    sharesWith3rd: false,
    usesGoogleAnalytics: false,
    country: 'UK',
  })
  const [copied, setCopied] = useState(false)

  function set(key, value) { setForm(f => ({ ...f, [key]: value })) }
  function toggle(key) { setForm(f => ({ ...f, [key]: !f[key] })) }

  const policy = generatePolicy(form)

  function copy() {
    navigator.clipboard.writeText(policy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Privacy Policy Generator</h1>
      <p className="tool-description">
        Generate a plain-English privacy policy for your website or app. Fill in your details and copy the text. Not a substitute for legal advice.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
        {[
          ['companyName', 'Company / Site name', 'text', 'Acme Inc.'],
          ['website', 'Website URL', 'url', 'https://example.com'],
          ['email', 'Privacy contact email', 'email', 'privacy@example.com'],
          ['effectiveDate', 'Effective date', 'date', ''],
        ].map(([key, label, type, placeholder]) => (
          <div key={key}>
            <label htmlFor={`pp-${key}`}>{label}</label>
            <input
              id={`pp-${key}`}
              type={type}
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}
        <div>
          <label htmlFor="pp-country">Jurisdiction</label>
          <select id="pp-country" value={form.country} onChange={e => set('country', e.target.value)}>
            <option value="UK">UK (GDPR/UK GDPR)</option>
            <option value="EU">EU (GDPR)</option>
            <option value="US">United States</option>
            <option value="AU">Australia</option>
            <option value="CA">Canada (PIPEDA)</option>
            <option value="Other">Other / Generic</option>
          </select>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem' }}>What do you collect?</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem' }}>
        {[
          ['collectsEmail', 'Email addresses'],
          ['collectsName', 'Names'],
          ['collectsAnalytics', 'Usage / analytics data'],
          ['collectsCookies', 'Cookies'],
          ['sharesWith3rd', 'Share data with third parties'],
          ['usesGoogleAnalytics', 'Google Analytics'],
        ].map(([key, label]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={form[key]} onChange={() => toggle(key)} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600 }}>Generated Privacy Policy</span>
          <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy text'}</button>
        </div>
        <textarea readOnly value={policy} style={{ minHeight: 440, background: 'var(--surface)', cursor: 'default', fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: 1.7 }} />
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
        ⚠️ This generator produces a template for informational purposes only. Consult a qualified legal professional for advice specific to your situation.
      </p>

      <RelatedTools category="seo" exclude="/tools/privacy-policy-generator" />
      <ToolSeo />
    </div>
  )
}

function generatePolicy(f) {
  const name = f.companyName || '[Your Company]'
  const site = f.website || '[Your Website URL]'
  const email = f.email || '[privacy@yourdomain.com]'
  const date = f.effectiveDate || '[Date]'

  const collectItems = [
    f.collectsEmail && 'Email addresses',
    f.collectsName && 'Names',
    f.collectsAnalytics && 'Usage and analytics data (e.g. pages visited, time on site, browser type)',
    f.collectsCookies && 'Cookie identifiers',
  ].filter(Boolean)

  const gdpr = f.country === 'UK' || f.country === 'EU'

  return `PRIVACY POLICY

${name} — ${site}
Effective date: ${date}

1. INTRODUCTION
${name} ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you visit ${site}.

2. INFORMATION WE COLLECT
${collectItems.length > 0 ? `We may collect the following types of information:\n${collectItems.map(i => `• ${i}`).join('\n')}` : 'We collect minimal information necessary to operate our service.'}

3. HOW WE USE YOUR INFORMATION
We use the information we collect to:
• Operate and improve our website
• Respond to your enquiries and requests
• Send service-related communications${f.collectsAnalytics ? '\n• Analyse usage patterns to improve user experience' : ''}${f.collectsEmail ? '\n• Send updates or newsletters (with your consent)' : ''}

4. COOKIES
${f.collectsCookies ? `We use cookies and similar tracking technologies to improve your experience. You can control cookie settings through your browser. Our cookies may include:\n• Essential cookies (required for the site to function)\n${f.collectsAnalytics ? '• Analytics cookies (to understand how visitors use our site)\n' : ''}Continuing to use our site without changing your cookie settings means you agree to our use of cookies.` : 'We do not use tracking cookies.'}

${f.usesGoogleAnalytics ? `5. GOOGLE ANALYTICS
We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information such as how often users visit the site, what pages they visit, and what other sites they visited before coming here. We use the information we get from Google Analytics to improve our services. Google Analytics collects only the IP address assigned to you on the date you visit this site, rather than your name or other identifying information. Learn more at https://policies.google.com/privacy.\n\n` : ''}${f.sharesWith3rd ? `${f.usesGoogleAnalytics ? '6' : '5'}. SHARING WITH THIRD PARTIES
We may share your information with trusted third-party service providers who assist in operating our website and services, under confidentiality agreements. We do not sell or rent your personal information to third parties for their marketing purposes.\n\n` : ''}${gdpr ? `GDPR RIGHTS (UK/EU users)
If you are located in the UK or EU, you have the following rights under the UK GDPR / GDPR:
• The right to access your personal data
• The right to rectify inaccurate data
• The right to erasure ("right to be forgotten")
• The right to restrict processing
• The right to data portability
• The right to object to processing
To exercise any of these rights, contact us at ${email}.\n\n` : ''}${f.country === 'CA' ? `CANADIAN USERS (PIPEDA)
In accordance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you may request access to, and correction of, your personal information. Contact us at ${email}.\n\n` : ''}DATA RETENTION
We retain your information only as long as necessary for the purposes outlined in this policy, or as required by law.

SECURITY
We implement appropriate technical and organisational measures to protect your information against unauthorised access, alteration, disclosure, or destruction.

CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a notice on ${site} or by email.

CONTACT US
If you have questions about this Privacy Policy, please contact:
${name}
Email: ${email}
Website: ${site}

© ${new Date().getFullYear()} ${name}. All rights reserved.`
}
