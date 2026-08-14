import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function ChinesePinyin() {
  const [input, setInput] = useState('')

  // Simplified pinyin mapping (sample - real implementation would need full library)
  const pinyinMap = {
    '你': 'nǐ', '好': 'hǎo', '的': 'de', '是': 'shì', '我': 'wǒ', '在': 'zài',
    '人': 'rén', '有': 'yǒu', '他': 'tā', '这': 'zhè', '中': 'zhōng', '大': 'dà',
    '来': 'lái', '上': 'shàng', '国': 'guó', '个': 'gè', '到': 'dào', '说': 'shuō',
    '们': 'men', '为': 'wèi', '子': 'zǐ', '和': 'hé', '你': 'nǐ', '地': 'dì',
    '出': 'chū', '道': 'dào', '也': 'yě', '时': 'shí', '年': 'nián', '得': 'de',
    '就': 'jiù', '那': 'nà', '要': 'yào', '下': 'xià', '以': 'yǐ', '生': 'shēng',
    '会': 'huì', '自': 'zì', '着': 'zhe', '去': 'qù', '之': 'zhī', '过': 'guò',
    '家': 'jiā', '学': 'xué', '对': 'duì', '可': 'kě', '她': 'tā', '里': 'lǐ',
    '后': 'hòu', '小': 'xiǎo', '么': 'me', '心': 'xīn', '多': 'duō', '天': 'tiān',
    '而': 'ér', '能': 'néng', '好': 'hǎo', '都': 'dōu', '然': 'rán', '没': 'méi',
    '日': 'rì', '于': 'yú', '起': 'qǐ', '还': 'hái', '发': 'fā', '成': 'chéng',
    '事': 'shì', '只': 'zhǐ', '作': 'zuò', '当': 'dāng', '想': 'xiǎng', '看': 'kàn',
    '文': 'wén', '无': 'wú', '开': 'kāi', '手': 'shǒu', '十': 'shí', '用': 'yòng',
  }

  function convertToPinyin(text) {
    if (!text) return ''
    
    return text.split('').map(char => {
      return pinyinMap[char] || char
    }).join(' ')
  }

  const output = convertToPinyin(input)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Chinese to Pinyin Converter</h1>
      <p className="tool-description">Convert Chinese characters (汉字) to Pinyin romanization with tone marks.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ Limited Dictionary</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This demo includes ~60 common characters. A production version would require a comprehensive pinyin library with 20,000+ characters.
        </p>
      </div>

      <label htmlFor="chinese-input">Chinese Characters (汉字)</label>
      <textarea 
        id="chinese-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="输入中文..."
        rows={6}
        style={{ fontSize: '1.25rem' }}
      />

      <label htmlFor="pinyin-output">Pinyin Output</label>
      <textarea 
        id="pinyin-output"
        value={output} 
        readOnly
        rows={6}
        style={{ fontSize: '1.125rem' }}
      />

      <button onClick={() => navigator.clipboard.writeText(output)}>
        Copy Pinyin
      </button>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Example</h3>
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>你好</div>
          <div style={{ color: 'var(--muted)' }}>nǐ hǎo</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Hello</div>
        </div>
      </div>

      <RelatedTools category="text" exclude="/tools/chinese-pinyin" />
      <ToolSeo />
    </div>
  )
}
