import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/instagram/9-maya-2026')
await mkdir(OUT, { recursive: true })

const W = 1080, H = 1350

const COL = {
  bg1: '#3b0a0a', bg2: '#7a1414', bg3: '#3a0606',
  gold1: '#fde68a', gold2: '#d97706',
  text: '#ffffff', muted: '#fde68a',
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;') }

function wrap(text, maxChars) {
  const words = text.split(' ')
  const out = []; let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) { out.push(line.trim()); line = w }
    else line = line ? line + ' ' + w : w
  }
  if (line.trim()) out.push(line.trim())
  return out
}

function frame(inner) {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COL.bg1}"/>
      <stop offset="55%" style="stop-color:${COL.bg2}"/>
      <stop offset="100%" style="stop-color:${COL.bg3}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COL.gold1}"/>
      <stop offset="100%" style="stop-color:${COL.gold2}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g opacity="0.10" stroke="${COL.gold1}" stroke-width="1.5" fill="none">
    <line x1="850" y1="80"  x2="1080" y2="900"/>
    <line x1="900" y1="80"  x2="1080" y2="800"/>
    <line x1="950" y1="80"  x2="1080" y2="700"/>
    <line x1="1000" y1="80" x2="1080" y2="600"/>
  </g>
  <rect x="80" y="80" width="240" height="44" rx="22" fill="${COL.gold1}" opacity="0.18"/>
  <text x="100" y="111" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700"
        fill="${COL.gold1}" letter-spacing="2">9 МАЯ · 2026</text>
  ${inner}
  <line x1="80" y1="${H-130}" x2="500" y2="${H-130}" stroke="${COL.gold1}" stroke-width="2" opacity="0.5"/>
  <text x="80" y="${H-90}" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${COL.text}" opacity="0.55" font-weight="500">nazranka.ru</text>
</svg>`
}

function bigText(lines, opts = {}) {
  const { y = 360, size = 64, family = "Georgia, 'Times New Roman', serif", weight = 700, fill = COL.text, lh = 80 } = opts
  return lines.map((l, i) =>
    `<text x="80" y="${y + i*lh}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" letter-spacing="-0.5">${esc(l)}</text>`
  ).join('\n')
}

const slides = [
  // === 1. Cover ===
  {
    name: '01-cover',
    inner: `
      <text x="640" y="900" font-family="Georgia, 'Times New Roman', serif" font-size="900" font-weight="700"
            fill="url(#gold)" opacity="0.15" letter-spacing="-30">9</text>
      <rect x="80" y="380" width="6" height="380" rx="3" fill="url(#gold)"/>
      ${bigText(['Цена', 'Победы', 'и хрупкость', 'мира'], { y: 460, size: 92, lh: 100 })}
      <text x="80" y="900" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="${COL.gold1}" opacity="0.85">Что 9 Мая значит для нас сегодня</text>
      <text x="80" y="950" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="${COL.text}" opacity="0.55">→ листайте</text>
    `,
  },

  // === 2. 1418 / 27 млн ===
  {
    name: '02-tsifry',
    inner: `
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">ЧТО СТОИТ ЗА ДАТОЙ</text>
      <text x="80" y="500" font-family="Georgia, 'Times New Roman', serif" font-size="180" font-weight="700" fill="url(#gold)" letter-spacing="-4">1418</text>
      <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="${COL.text}" opacity="0.85">дней войны</text>
      <text x="80" y="780" font-family="Georgia, 'Times New Roman', serif" font-size="180" font-weight="700" fill="url(#gold)" letter-spacing="-4">~27 млн</text>
      <text x="80" y="840" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="${COL.text}" opacity="0.85">советских граждан не вернулись домой</text>
      <text x="80" y="1080" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${COL.text}" opacity="0.6">Почти в каждой семье — пустое место за столом</text>
    `,
  },

  // === 3. Гайтукиев — цитата ===
  {
    name: '03-gajtukiev-citata',
    inner: `
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">1944 ГОД. ИНГУШЕЙ ДЕПОРТИРУЮТ.</text>
      <text x="80" y="360" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">ЕМУ — 20 ЛЕТ. ОН НА ФРОНТЕ.</text>

      <text x="80" y="540" font-family="Georgia, 'Times New Roman', serif" font-size="200" fill="url(#gold)" opacity="0.5">«</text>
      ${bigText(wrap('Какая разница, под каким именем бить фашистов', 18), { y: 700, size: 58, lh: 76, weight: 700 })}

      <text x="80" y="1080" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.text}" opacity="0.75">Зяудин Джамалдинович Гайтукиев,</text>
      <text x="80" y="1115" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${COL.gold1}" opacity="0.7">связист 169-й стрелковой дивизии</text>
    `,
  },

  // === 4. Гайтукиев — фамилия ===
  {
    name: '04-gajtukiev-familiya',
    inner: `
      <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">ОН СТАЛ НИКОЛАЕМ ДМИТРИЕВИЧЕМ</text>

      ${bigText(['Имя — поменял.'], { y: 420, size: 58, lh: 72, weight: 400 })}
      ${bigText(['Отчество — поменял.'], { y: 500, size: 58, lh: 72, weight: 400 })}
      ${bigText(['Национальность —'], { y: 580, size: 52, lh: 66, weight: 400 })}
      ${bigText(['«русский».'], { y: 646, size: 52, lh: 66, weight: 400 })}

      <rect x="80" y="730" width="920" height="2" fill="${COL.gold1}" opacity="0.45"/>

      ${bigText(['Фамилию — оставил.'], { y: 830, size: 58, lh: 72, weight: 700, fill: COL.gold1 })}
      ${bigText(['Чтобы родные могли'], { y: 920, size: 44, lh: 56, weight: 400, fill: COL.gold1 })}
      ${bigText(['найти его в списках.'], { y: 976, size: 44, lh: 56, weight: 400, fill: COL.gold1 })}

      <text x="80" y="1080" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${COL.text}" opacity="0.55">Прошёл всю войну. Дважды ранен. «За оборону</text>
      <text x="80" y="1110" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${COL.text}" opacity="0.55">Сталинграда», «За отвагу», орден Отечественной войны.</text>
    `,
  },

  // === 5. Что фашизм ===
  {
    name: '05-chto-takoe-fashizm',
    inner: `
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">УРОК, КОТОРЫЙ НЕ СТАРЕЕТ</text>
      ${bigText(wrap('Фашизм — не свастика и парад.', 18), { y: 460, size: 60, lh: 75 })}
      ${bigText(wrap('Это идеология, которая сортирует людей на «полноценных» и «лишних».', 22), { y: 660, size: 44, lh: 58, weight: 400 })}
      <text x="80" y="1100" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${COL.gold1}" opacity="0.75">Освенцим. Бабий Яр. Хатынь.</text>
      <text x="80" y="1135" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${COL.gold1}" opacity="0.75">6 миллионов убитых евреев.</text>
    `,
  },

  // === 6. Главная цитата ===
  {
    name: '06-citata',
    inner: `
      <text x="80" y="380" font-family="Georgia, 'Times New Roman', serif" font-size="220" fill="url(#gold)" opacity="0.5">«</text>
      ${bigText(wrap('Память о войне нужна не для того, чтобы продолжать ненавидеть.', 22), { y: 580, size: 46, lh: 60, weight: 400 })}
      ${bigText(wrap('Она нужна, чтобы каждое поколение заново понимало:', 24), { y: 800, size: 42, lh: 56, weight: 400 })}
      ${bigText(wrap('фашизм начинается не с танков, а с привычки считать соседа человеком второго сорта.', 24), { y: 960, size: 42, lh: 56, weight: 700, fill: COL.gold1 })}
    `,
  },

  // === 7. Победа — общая ===
  {
    name: '07-pobeda-obshchaya',
    inner: `
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">ГЛАВНОЕ</text>
      ${bigText(wrap('Это была не победа одной нации над другой.', 20), { y: 470, size: 56, lh: 72 })}
      ${bigText(wrap('Это победа всего человечества над идеей, что одни люди ценнее других.', 22), { y: 800, size: 50, lh: 64, weight: 700, fill: COL.gold1 })}
    `,
  },

  // === 8. Мир — хрупкая ценность ===
  {
    name: '08-mir-hrupkaya',
    inner: `
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">МИР — САМАЯ ХРУПКАЯ ЦЕННОСТЬ</text>
      ${bigText(wrap('Кавказу мир знаком хорошо.', 16), { y: 460, size: 64, lh: 80 })}
      ${bigText(wrap('И его цена здесь известна не по учебникам.', 22), { y: 660, size: 44, lh: 58, weight: 400 })}
      ${bigText(wrap('«Никогда больше» — здесь не дежурные слова.', 22), { y: 920, size: 44, lh: 58, weight: 700, fill: COL.gold1 })}
    `,
  },

  // === 9. CTA ===
  {
    name: '09-cta',
    inner: `
      <text x="80" y="380" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${COL.gold1}" letter-spacing="3" opacity="0.85">ЧИТАЙТЕ ЦЕЛИКОМ</text>
      ${bigText(['Авторская', 'колонка', 'на сайте'], { y: 500, size: 88, lh: 100 })}
      <rect x="80" y="900" width="920" height="100" rx="50" fill="url(#gold)"/>
      <text x="540" y="965" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="${COL.bg1}">nazranka.ru</text>
      <text x="80" y="1080" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${COL.text}" opacity="0.65">С Днём Победы.</text>
      <text x="80" y="1120" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${COL.text}" opacity="0.65">С праздником, который мы держим вместе.</text>
    `,
  },
]

for (const s of slides) {
  const svg = frame(s.inner)
  const buf = await sharp(Buffer.from(svg)).resize(W, H).png({ quality: 95 }).toBuffer()
  const file = path.join(OUT, `${s.name}.png`)
  await writeFile(file, buf)
  console.log(`✓ ${s.name}.png`)
}

console.log(`\nГотово — ${slides.length} слайдов в ${OUT}`)
