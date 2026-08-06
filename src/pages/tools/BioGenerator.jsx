import { useState } from 'react'
import BackBar from '../../components/BackBar'

const TONES = ['Professional', 'Friendly', 'Witty', 'Minimal']
const LENGTHS = ['Short (1 sentence)', 'Medium (2–3 sentences)', 'Long (4–5 sentences)']
const PERSONS = ['Third person (he/she/they)', 'First person (I)']

function generate({ name, role, company, skills, achievement, tone, length, person, pronouns }) {
  const p = person === 'First person (I)'
  const subj   = p ? 'I'    : (pronouns === 'she' ? 'She' : pronouns === 'he' ? 'He' : 'They')
  const subjLow= p ? 'i'    : subj.toLowerCase()
  const obj    = p ? 'me'   : (pronouns === 'she' ? 'her' : pronouns === 'he' ? 'him' : 'them')
  const poss   = p ? 'my'   : (pronouns === 'she' ? 'her' : pronouns === 'he' ? 'his' : 'their')
  const verb3  = p ? ''     : 's' // third-person singular

  const roleStr     = role || 'professional'
  const companyStr  = company ? ` at ${company}` : ''
  const skillsArr   = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []
  const skillsStr   = skillsArr.length > 1
    ? skillsArr.slice(0,-1).join(', ') + ' and ' + skillsArr.slice(-1)
    : skillsArr[0] || 'various disciplines'
  const achieveStr  = achievement || null
  const n = name || (p ? '' : 'They')

  const openers = {
    Professional: p ? `I am a ${roleStr}${companyStr}` : `${name || 'A professional'} is a ${roleStr}${companyStr}`,
    Friendly:     p ? `Hi! I'm a ${roleStr}${companyStr}` : `Meet ${name || 'a'} ${roleStr}${companyStr}`,
    Witty:        p ? `By day I'm a ${roleStr}${companyStr}` : `${name || 'Someone'} is a ${roleStr}${companyStr} — by day`,
    Minimal:      p ? `${roleStr}${companyStr}.` : `${name || ''} — ${roleStr}${companyStr}.`,
  }

  const sentences = []
  sentences.push(openers[tone] + '.')

  if (length !== 'Short (1 sentence)') {
    if (skillsArr.length) sentences.push(`${subj} specialise${verb3} in ${skillsStr}.`)
    if (achieveStr) sentences.push(`${p ? 'My' : poss} recent work includes ${achieveStr}.`)
  }

  if (length === 'Long (4–5 sentences)') {
    if (tone === 'Friendly') sentences.push(`${p ? "I love" : subj + " love" + verb3} connecting with others and sharing knowledge.`)
    if (tone === 'Professional') sentences.push(`${subj} bring${verb3} a results-driven approach to every project.`)
    if (tone === 'Witty') sentences.push(`Off-hours you'll find ${p ? 'me' : obj} exploring new ideas.`)
    sentences.push(`${p ? "I'm" : subj + " is"} always open to new opportunities and collaborations.`)
  }

  return sentences.join(' ')
}

export default function BioGenerator() {
  const [name, setName]         = useState('')
  const [role, setRole]         = useState('')
  const [company, setCompany]   = useState('')
  const [skills, setSkills]     = useState('')
  const [achievement, setAchievement] = useState('')
  const [tone, setTone]         = useState('Professional')
  const [length, setLength]     = useState('Medium (2–3 sentences)')
  const [person, setPerson]     = useState('Third person (he/she/they)')
  const [pronouns, setPronouns] = useState('they')
  const [copied, setCopied]     = useState(false)

  const bio = generate({ name, role, company, skills, achievement, tone, length, person, pronouns })

  function copy() {
    navigator.clipboard.writeText(bio).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Bio Generator</h1>
      <p className="tool-description">Fill in a few fields and get a polished professional bio you can use anywhere.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
          </div>
          <div>
            <label>Job title / role</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Senior Product Designer" />
          </div>
        </div>
        <div>
          <label>Company / organisation (optional)</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div>
          <label>Key skills (comma-separated)</label>
          <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="UX research, prototyping, design systems" />
        </div>
        <div>
          <label>Notable achievement (optional)</label>
          <input type="text" value={achievement} onChange={e => setAchievement(e.target.value)} placeholder="redesigning the checkout flow that boosted conversions by 30%" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label>Tone</label>
          <div className="chip-group">
            {TONES.map(t => <button key={t} className={`chip ${tone===t?'active':''}`} onClick={() => setTone(t)}>{t}</button>)}
          </div>
        </div>
        <div>
          <label>Length</label>
          <div className="chip-group">
            {LENGTHS.map(l => <button key={l} className={`chip ${length===l?'active':''}`} onClick={() => setLength(l)}>{l.split(' ')[0]}</button>)}
          </div>
        </div>
        <div>
          <label>Person</label>
          <div className="chip-group">
            {PERSONS.map(p => <button key={p} className={`chip ${person===p?'active':''}`} onClick={() => setPerson(p)}>{p.split(' ')[0]}</button>)}
          </div>
        </div>
        {person !== 'First person (I)' && (
          <div>
            <label>Pronouns</label>
            <div className="chip-group">
              {['they','she','he'].map(p => <button key={p} className={`chip ${pronouns===p?'active':''}`} onClick={() => setPronouns(p)}>{p}/them</button>)}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ marginBottom: 0 }}>Generated bio</label>
          <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {bio}
        </div>
      </div>
    </div>
  )
}
