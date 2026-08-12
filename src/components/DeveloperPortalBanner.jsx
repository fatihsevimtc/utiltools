export default function DeveloperPortalBanner({ packageName, showOnMobile = true }) {
  return (
    <div 
      className={`dev-portal-banner${showOnMobile ? '' : ' dev-portal-banner--hide-mobile'}`}
      style={{
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ flex: '1 1 300px' }}>
        <div style={{ 
          fontSize: '0.85rem', 
          fontWeight: 600, 
          marginBottom: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Looking for an npm package?
        </div>
        <p style={{ 
          fontSize: '0.8rem', 
          color: 'var(--muted)', 
          margin: 0,
          lineHeight: 1.5
        }}>
          {packageName 
            ? `Integrate ${packageName} into your project with our npm package.`
            : 'Integrate this functionality into your project with our npm packages.'
          }
        </p>
      </div>
      <a
        href="https://developer.utiltools.org"
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
        style={{
          whiteSpace: 'nowrap',
          fontSize: '0.85rem',
          padding: '0.5rem 1rem'
        }}
      >
        📦 View Packages
      </a>
    </div>
  )
}
