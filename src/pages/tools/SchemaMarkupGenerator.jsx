import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

const SCHEMA_TYPES = [
  'Article', 'BreadcrumbList', 'Event', 'FAQPage', 'HowTo',
  'JobPosting', 'LocalBusiness', 'Organization', 'Person',
  'Product', 'Recipe', 'Review', 'SoftwareApplication', 'WebSite',
]

const DEFAULTS = {
  Article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Your Article Title',
    description: 'A brief description of the article.',
    author: { '@type': 'Person', name: 'Author Name' },
    datePublished: new Date().toISOString().slice(0, 10),
    dateModified: new Date().toISOString().slice(0, 10),
    publisher: { '@type': 'Organization', name: 'Publisher Name', logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' } },
    image: 'https://example.com/article-image.jpg',
    url: 'https://example.com/article',
  },
  BreadcrumbList: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://example.com' },
      { '@type': 'ListItem', position: 2, name: 'Category', item: 'https://example.com/category' },
      { '@type': 'ListItem', position: 3, name: 'Page',     item: 'https://example.com/category/page' },
    ],
  },
  Event: {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Annual Developer Conference',
    startDate: '2025-09-15T09:00:00',
    endDate: '2025-09-15T17:00:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Conference Center', address: { '@type': 'PostalAddress', streetAddress: '123 Main St', addressLocality: 'City', addressCountry: 'US' } },
    description: 'A conference for developers to learn and network.',
    organizer: { '@type': 'Organization', name: 'Dev Events Inc', url: 'https://example.com' },
  },
  FAQPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is your return policy?', acceptedAnswer: { '@type': 'Answer', text: 'We offer a 30-day return policy on all items.' } },
      { '@type': 'Question', name: 'How long does shipping take?', acceptedAnswer: { '@type': 'Answer', text: 'Standard shipping takes 5–7 business days.' } },
    ],
  },
  HowTo: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How To Make a Great Coffee',
    description: 'A step-by-step guide to brewing perfect coffee at home.',
    step: [
      { '@type': 'HowToStep', text: 'Grind your coffee beans to a medium-fine consistency.', name: 'Grind beans' },
      { '@type': 'HowToStep', text: 'Heat water to 93°C (200°F).', name: 'Heat water' },
      { '@type': 'HowToStep', text: 'Pour water over grounds and brew for 4 minutes.', name: 'Brew' },
    ],
  },
  JobPosting: {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Senior Software Engineer',
    description: 'We are looking for an experienced engineer to join our team.',
    datePosted: new Date().toISOString().slice(0, 10),
    validThrough: '2025-12-31',
    employmentType: 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: 'Tech Company', sameAs: 'https://example.com', logo: 'https://example.com/logo.png' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: '123 Main St', addressLocality: 'San Francisco', addressRegion: 'CA', postalCode: '94105', addressCountry: 'US' } },
    baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', value: 150000, unitText: 'YEAR' } },
  },
  LocalBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'The Coffee Corner',
    image: 'https://example.com/photo.jpg',
    telephone: '+1-555-0100',
    email: 'info@example.com',
    address: { '@type': 'PostalAddress', streetAddress: '123 Main St', addressLocality: 'Anytown', addressRegion: 'CA', postalCode: '12345', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 37.774929, longitude: -122.419416 },
    url: 'https://example.com',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    ],
  },
  Organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Acme Corporation',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    contactPoint: { '@type': 'ContactPoint', telephone: '+1-555-0100', contactType: 'customer support' },
    sameAs: ['https://twitter.com/acme', 'https://facebook.com/acme'],
  },
  Person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jane Doe',
    url: 'https://example.com/janedoe',
    image: 'https://example.com/janedoe.jpg',
    jobTitle: 'Software Engineer',
    worksFor: { '@type': 'Organization', name: 'Tech Company' },
    email: 'jane@example.com',
    sameAs: ['https://twitter.com/janedoe', 'https://linkedin.com/in/janedoe'],
  },
  Product: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Wireless Headphones Pro',
    image: ['https://example.com/headphones.jpg'],
    description: 'Premium wireless headphones with 30-hour battery life and noise cancellation.',
    brand: { '@type': 'Brand', name: 'AudioBrand' },
    sku: 'WH-PRO-001',
    offers: { '@type': 'Offer', url: 'https://example.com/headphones', priceCurrency: 'USD', price: 299.99, itemCondition: 'https://schema.org/NewCondition', availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '342' },
  },
  Recipe: {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: 'Classic Chocolate Chip Cookies',
    author: { '@type': 'Person', name: 'Jane Baker' },
    image: 'https://example.com/cookies.jpg',
    description: 'Crispy outside, chewy inside — the perfect chocolate chip cookie.',
    prepTime: 'PT15M',
    cookTime: 'PT12M',
    totalTime: 'PT27M',
    recipeYield: '24 cookies',
    recipeIngredient: ['2 1/4 cups all-purpose flour', '1 tsp baking soda', '1 cup butter', '2 eggs', '2 cups chocolate chips'],
    recipeInstructions: [
      { '@type': 'HowToStep', text: 'Preheat oven to 375°F (190°C).' },
      { '@type': 'HowToStep', text: 'Mix dry ingredients in one bowl, wet in another, then combine.' },
      { '@type': 'HowToStep', text: 'Fold in chocolate chips and drop spoonfuls on baking sheet.' },
      { '@type': 'HowToStep', text: 'Bake 9–11 minutes until golden.' },
    ],
  },
  Review: {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Product', name: 'Wireless Headphones Pro' },
    author: { '@type': 'Person', name: 'John Reviewer' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    name: 'Absolutely amazing sound quality',
    reviewBody: 'I have been using these headphones for a month and the sound quality is outstanding. The battery life is as advertised.',
    datePublished: new Date().toISOString().slice(0, 10),
  },
  SoftwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'My App',
    operatingSystem: 'ANDROID, iOS, Windows',
    applicationCategory: 'UtilitiesApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', ratingCount: '8930' },
  },
  WebSite: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'My Website',
    url: 'https://example.com',
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://example.com/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
  },
}

export default function SchemaMarkupGenerator() {
  const [schemaType, setSchemaType] = useState('Article')
  const [copied, setCopied]         = useState(false)

  const generated = useMemo(() => {
    const obj = DEFAULTS[schemaType] || {}
    return JSON.stringify(obj, null, 2)
  }, [schemaType])

  const scriptTag = useMemo(
    () => `<script type="application/ld+json">\n${generated}\n</script>`,
    [generated]
  )
  const [view, setView] = useState('json') // 'json' | 'script'

  function copy() {
    navigator.clipboard.writeText(view === 'script' ? scriptTag : generated).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Schema Markup Generator</h1>
      <p className="tool-description">
        Generate JSON-LD structured data for Schema.org types. Copy the snippet and paste it into your page's <code>&lt;head&gt;</code> to improve search engine understanding.
      </p>

      <label htmlFor="schema-type">Schema Type</label>
      <select
        id="schema-type"
        value={schemaType}
        onChange={e => setSchemaType(e.target.value)}
        style={{ maxWidth: 300 }}
      >
        {SCHEMA_TYPES.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="chip-group" style={{ marginTop: '1rem' }}>
        <button className={`chip ${view === 'json' ? 'active' : ''}`} onClick={() => setView('json')}>
          JSON-LD
        </button>
        <button className={`chip ${view === 'script' ? 'active' : ''}`} onClick={() => setView('script')}>
          {'<script> tag'}
        </button>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>{view === 'script' ? 'HTML script tag' : 'JSON-LD object'}</label>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
        <pre className="code-block" style={{ whiteSpace: 'pre', overflowX: 'auto', fontSize: '0.85rem', lineHeight: 1.55, maxHeight: 480 }}>
          {view === 'script' ? scriptTag : generated}
        </pre>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        <strong>Tip:</strong> Edit the placeholder values, then paste the snippet inside your HTML <code>&lt;head&gt;</code>.
        Validate with <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Google's Rich Results Test</a>.
      </div>

      <RelatedTools tools={[
        { icon: '🏷️', name: 'Meta Tag Generator', path: '/tools/meta-tag-generator' },
        { icon: '👁️', name: 'OG Preview',         path: '/tools/og-preview' },
        { icon: '🤖', name: 'robots.txt',          path: '/tools/robots-txt' },
        { icon: '🗺️', name: 'Sitemap Generator',  path: '/tools/sitemap-generator' },
      ]} />
      <ToolSeo />
    </div>
  )
}
