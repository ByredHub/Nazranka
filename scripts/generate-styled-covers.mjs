import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ggzyvxrjdaxerhhrswbc.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CATEGORY_STYLES = {
  'Политика':         { from: '#1e3a5f', to: '#0f1f33', accent: '#3b82f6' },
  'Экономика':        { from: '#1a365d', to: '#0c1929', accent: '#60a5fa' },
  'Общество':         { from: '#134e4a', to: '#0a2725', accent: '#2dd4bf' },
  'Культура':         { from: '#4c1d95', to: '#2e1065', accent: '#a78bfa' },
  'Спорт':            { from: '#14532d', to: '#0a2916', accent: '#4ade80' },
  'Происшествия':     { from: '#7c2d12', to: '#431407', accent: '#fb923c' },
  'Народные новости': { from: '#713f12', to: '#3d2208', accent: '#fbbf24' },
  'История':          { from: '#78350f', to: '#451a03', accent: '#f59e0b' },
  'Образование':      { from: '#155e75', to: '#0a2f3b', accent: '#22d3ee' },
  'Афиша':            { from: '#831843', to: '#500724', accent: '#f472b6' },
  'Наша земля':       { from: '#064e3b', to: '#022c22', accent: '#34d399' },
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function wrapText(text, maxChars = 26) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line.trim())
      line = word
    } else {
      line = line ? line + ' ' + word : word
    }
  }
  if (line.trim()) lines.push(line.trim())
  return lines.slice(0, 4)
}

function generateSVG(title, categoryName) {
  const style = CATEGORY_STYLES[categoryName] || { from: '#1e293b', to: '#0f172a', accent: '#64748b' }
  const lines = wrapText(title)
  const lineHeight = 48
  const startY = 340 - ((lines.length - 1) * lineHeight) / 2

  const titleSvg = lines.map((line, i) =>
    `<text x="100" y="${startY + i * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="white" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join('\n    ')

  return `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${style.from}"/>
      <stop offset="100%" style="stop-color:${style.to}"/>
    </linearGradient>
  </defs>

  <!-- Фон -->
  <rect width="1200" height="675" fill="url(#bg)"/>

  <!-- Декоративные элементы -->
  <circle cx="1100" cy="100" r="300" fill="${style.accent}" opacity="0.06"/>
  <circle cx="1000" cy="500" r="200" fill="${style.accent}" opacity="0.04"/>
  <circle cx="100" cy="600" r="150" fill="${style.accent}" opacity="0.05"/>

  <!-- Акцентная линия слева -->
  <rect x="80" y="${startY - 60}" width="4" height="${lines.length * lineHeight + 30}" rx="2" fill="${style.accent}"/>

  <!-- Категория -->
  <rect x="80" y="80" width="${categoryName.length * 14 + 30}" height="32" rx="16" fill="${style.accent}" opacity="0.2"/>
  <text x="95" y="102" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="${style.accent}" letter-spacing="1.5">${escapeXml(categoryName.toUpperCase())}</text>

  <!-- Заголовок -->
  ${titleSvg}

  <!-- Нижняя линия -->
  <line x1="80" y1="600" x2="400" y2="600" stroke="${style.accent}" stroke-width="2" opacity="0.3"/>

  <!-- Логотип -->
  <text x="80" y="640" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="white" opacity="0.3" font-weight="500">nazranka.ru</text>
</svg>`
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, category:categories(name)')
    .eq('status', 'published')
    .is('cover_image', null)

  if (error) { console.error(error.message); return }
  console.log(`Generating covers for ${articles.length} articles\n`)

  let done = 0
  for (const article of articles) {
    const catName = (article.category)?.name || 'Новости'

    console.log(`[${done + 1}/${articles.length}] ${article.title.slice(0, 50)}...`)

    try {
      const svg = generateSVG(article.title, catName)
      const buffer = await sharp(Buffer.from(svg))
        .resize(1200, 675)
        .webp({ quality: 85 })
        .toBuffer()

      const fileName = `styled-${article.slug.slice(0, 30)}-${Date.now()}.webp`

      const { error: upErr } = await supabase.storage
        .from('covers')
        .upload(fileName, buffer, { contentType: 'image/webp' })
      if (upErr) { console.log(`  ✗ ${upErr.message}`); continue }

      const { data: urlData } = supabase.storage.from('covers').getPublicUrl(fileName)
      await supabase.from('articles').update({ cover_image: urlData.publicUrl }).eq('id', article.id)

      console.log(`  ✓`)
      done++
    } catch (err) {
      console.log(`  ✗ ${err.message}`)
    }
  }

  console.log(`\n✓ Updated ${done} covers`)
}

main()
