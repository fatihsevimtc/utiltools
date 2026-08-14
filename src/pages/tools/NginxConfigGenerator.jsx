import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function NginxConfigGenerator() {
  const [domain, setDomain] = useState('')
  const [port, setPort] = useState('80')
  const [ssl, setSsl] = useState(false)
  const [proxy, setProxy] = useState('')

  function generateConfig() {
    let config = `server {
    listen ${port}${ssl ? ' ssl' : ''};
    server_name ${domain || 'example.com'};
    
${ssl ? `    ssl_certificate /path/to/cert.crt;
    ssl_certificate_key /path/to/cert.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
` : ''}    location / {
${proxy ? `        proxy_pass ${proxy};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;` : `        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ =404;`}
    }
    
    access_log /var/log/nginx/${domain || 'access'}.log;
    error_log /var/log/nginx/${domain || 'error'}.log;
}`

    return config
  }

  const config = generateConfig()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Nginx Config Generator / Validator</h1>
      <p className="tool-description">Generate Nginx server block configurations with SSL, proxy, and static file options.</p>

      <label htmlFor="nginx-domain">Server Name / Domain</label>
      <input 
        id="nginx-domain"
        type="text" 
        value={domain} 
        onChange={e => setDomain(e.target.value)} 
        placeholder="example.com"
      />

      <label htmlFor="nginx-port">Port</label>
      <input 
        id="nginx-port"
        type="number" 
        value={port} 
        onChange={e => setPort(e.target.value)} 
        placeholder="80"
      />

      <div style={{ marginTop: '1rem' }}>
        <label>
          <input 
            type="checkbox" 
            checked={ssl} 
            onChange={e => setSsl(e.target.checked)} 
          />
          {' '}Enable SSL/HTTPS
        </label>
      </div>

      <label htmlFor="nginx-proxy">Proxy Pass (optional)</label>
      <input 
        id="nginx-proxy"
        type="text" 
        value={proxy} 
        onChange={e => setProxy(e.target.value)} 
        placeholder="http://localhost:3000"
      />

      <label htmlFor="nginx-output">Generated Config</label>
      <textarea 
        id="nginx-output"
        value={config} 
        readOnly
        rows={20}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      <button className="btn" onClick={() => navigator.clipboard.writeText(config)}>
        Copy Config
      </button>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.875rem' }}>
        <strong>📝 Usage</strong>
        <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Save config to <code>/etc/nginx/sites-available/your-site</code></li>
          <li>Create symlink: <code>sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/</code></li>
          <li>Test: <code>sudo nginx -t</code></li>
          <li>Reload: <code>sudo systemctl reload nginx</code></li>
        </ol>
      </div>

      <RelatedTools category="developer" exclude="/tools/nginx-config" />
      <ToolSeo />
    </div>
  )
}
