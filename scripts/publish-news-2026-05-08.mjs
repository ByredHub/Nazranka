import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ggzyvxrjdaxerhhrswbc.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CAT = {
  ekonomika:      'c1000000-0000-4000-a000-000000000002',
  obshchestvo:    'c1000000-0000-4000-a000-000000000003',
  kultura:        'c1000000-0000-4000-a000-000000000004',
  proisshestviya: 'c1000000-0000-4000-a000-000000000006',
  obrazovanie:    'c1000000-0000-4000-a000-000000000009',
}
const CAT_NAME = {
  [CAT.ekonomika]: 'Экономика', [CAT.obshchestvo]: 'Общество', [CAT.kultura]: 'Культура',
  [CAT.proisshestviya]: 'Происшествия', [CAT.obrazovanie]: 'Образование',
}

const para = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
const doc = (...paras) => ({ type: 'doc', content: paras })

const articles = [
  {
    title: 'Под Малгобеком снесут двухэтажный самострой, возведённый под коммерцию на участке ИЖС',
    slug: 'sagopshi-snos-samostroya-prokuratura-2026',
    category_id: CAT.proisshestviya,
    lead: 'Малгобекский городской суд удовлетворил иск прокуратуры о сносе незаконной постройки в Сагопши.',
    content: doc(
      para('В сельском поселении Сагопши Малгобекского района снесут двухэтажное капитальное здание, возведённое без разрешительных документов на земле, выделенной под индивидуальное жилищное строительство.'),
      para('Прокуратура города Малгобека установила, что местный житель построил объект для ведения коммерческой деятельности. Надзорное ведомство обратилось в суд, и Малгобекский городской суд удовлетворил иск о сносе самостроя. Исполнение решения взято под контроль.'),
      para('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-08T08:00:00+00:00',
  },
  {
    title: 'В Ингушетии запустили проект «Особый потенциал» — детей с ОВЗ учат программированию и видеомонтажу',
    slug: 'osobyy-potencial-deti-ovz-cifrovye-navyki-2026',
    category_id: CAT.obshchestvo,
    lead: '«Дом молодёжных организаций» начал серию мастер-классов по цифровым профессиям при поддержке гранта «Росмолодёжь».',
    content: doc(
      para('В Ингушетии стартовал социальный проект «Особый потенциал», в рамках которого детей с ограниченными возможностями здоровья обучают современным цифровым специальностям. Программу ведёт Центр «Дом молодёжных организаций» республики.'),
      para('Участники осваивают программирование, IT-технологии, видеомонтаж и фотомонтаж. Первое занятие — практический мастер-класс по основам видеомонтажа — провела начальник отдела молодёжной политики Комитета по делам молодёжи Амина Гулиева. Партнёром мероприятия выступило кафе «Caf pizza».'),
      para('Проект реализуется на средства грантового конкурса «Росмолодёжь. Гранты». Цель — дать школьникам с ОВЗ практические навыки и первый опыт работы в сфере цифровых технологий, чтобы помочь им в выборе будущей профессии.'),
      para('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-08T09:00:00+00:00',
  },
  {
    title: 'Молодёжный театральный форум «Национальное единство» соберёт в Ингушетии более 100 артистов СКФО',
    slug: 'teatralnyy-forum-nacionalnoe-edinstvo-skfo-2026',
    category_id: CAT.kultura,
    lead: 'Программа включает спектакли, мастер-классы и творческие встречи. Форум приурочен к 150-летию Союза театральных деятелей.',
    content: doc(
      para('В Ингушетии пройдёт межрегиональный молодёжный театральный форум «Национальное единство». Организаторы ожидают более ста молодых актёров и режиссёров из регионов Северо-Кавказского федерального округа.'),
      para('Программа включает показы спектаклей, мастер-классы, дискуссии и творческие встречи. Форум приурочен к Году единства народов России и 150-летию Союза театральных деятелей страны.'),
      para('По словам Главы Ингушетии Махмуд-Али Калиматова, мероприятие нацелено на поддержку молодых талантов, профессиональный рост и укрепление культурных связей между регионами Северного Кавказа.'),
      para('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-08T10:00:00+00:00',
  },
  {
    title: 'Тепличный комплекс «Сунжа» расширят до 32,5 га — производство овощей вырастет в пять раз',
    slug: 'sunzha-teplichnyy-kompleks-rasshirenie-2026',
    category_id: CAT.ekonomika,
    lead: 'Вторая очередь крупнейшего на Северном Кавказе тепличного хозяйства запустится в 2027 году.',
    content: doc(
      para('Тепличный комплекс «Сунжа» в Ингушетии готовится ввести в строй вторую очередь и многократно увеличить выпуск овощей. Хозяйство уже считается крупнейшим на Северном Кавказе.'),
      para('Первая очередь работает с 2019 года, занимает 10,5 гектара и даёт более 5 тысяч тонн овощей в год. Сейчас завершается строительство второй очереди площадью 22 гектара современных теплиц: проводится пусконаладка и подключение к инженерным сетям, запуск намечен на 2027 год.'),
      para('После полного ввода объёма производства комплекс выйдет на 25–26 тысяч тонн овощей в год. Это увеличит долю местной продукции на рынке, добавит рабочих мест и налоговых поступлений и укрепит продовольственную самодостаточность региона.'),
      para('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-08T11:00:00+00:00',
  },
  {
    title: 'Госархив Ингушетии просит экс-руководителей передать кадровые документы времён ЧИАССР',
    slug: 'gosarkhiv-chiassr-trudovoy-stazh-dokumenty-2026',
    category_id: CAT.obshchestvo,
    lead: 'Без этих бумаг сотни жителей не могут подтвердить трудовой стаж и оформить или пересчитать пенсию.',
    content: doc(
      para('Государственная архивная служба Ингушетии обратилась к бывшим руководителям предприятий, работавших во времена Чечено-Ингушской АССР. Архив просит передать на государственное хранение кадровые и бухгалтерские документы того периода.'),
      para('Значительная часть документации ликвидированных предприятий по-прежнему хранится у частных лиц. Из-за этого госархив не может выдавать справки о трудовом стаже и зарплате, а сотни жителей республики сталкиваются с проблемами при оформлении и перерасчёте пенсий.'),
      para('«Отсутствие этих документов в фондах госархива напрямую бьёт по социальному благополучию граждан», — отметили в ведомстве. Тем, кто передаст бумаги на хранение, выдадут именные сертификаты в знак признания вклада в сохранение исторической памяти.'),
      para('Источник: газета «Сердало».'),
    ),
    published_at: '2026-05-08T12:00:00+00:00',
  },
  {
    title: 'В лицее «Олимп» проходит неделя естественных наук — школьникам показывают практическую химию и биологию',
    slug: 'olimp-nedelya-estestvennyh-nauk-2026',
    category_id: CAT.obrazovanie,
    lead: 'Учителя проводят интерактивные уроки, чтобы помочь ученикам выбрать научную профессию.',
    content: doc(
      para('В Центре-лицее одарённых детей «Олимп» в Ингушетии проходит тематическая неделя естественных наук. Цель — показать школьникам практическую сторону биологии, химии, физики и географии и помочь определиться с будущей профессией.'),
      para('Учитель химии Лейла Чахкиева провела для восьмиклассников интерактивный урок о строении атома, атомных номерах и массовых числах с практическими заданиями. Учитель биологии Аза Азиева у семиклассников разобрала класс земноводных и их роль в природе — урок прошёл с активным обсуждением.'),
      para('По задумке организаторов, такой формат развивает критическое мышление и исследовательские навыки и готовит «новое поколение будущих учёных и первооткрывателей».'),
      para('Источник: Минобразования Ингушетии, газета «Сердало».'),
    ),
    published_at: '2026-05-08T13:00:00+00:00',
  },
]

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;') }
const STYLES = {
  'Экономика':    { from:'#1a365d', to:'#0c1929', accent:'#60a5fa' },
  'Общество':     { from:'#134e4a', to:'#0a2725', accent:'#2dd4bf' },
  'Культура':     { from:'#4c1d95', to:'#2e1065', accent:'#a78bfa' },
  'Происшествия': { from:'#7c2d12', to:'#431407', accent:'#fb923c' },
  'Образование':  { from:'#155e75', to:'#0a2f3b', accent:'#22d3ee' },
}
function wrap(text, maxChars = 26) {
  const words = text.split(' '); const lines = []; let line = ''
  for (const w of words) {
    if ((line+' '+w).trim().length > maxChars && line) { lines.push(line.trim()); line = w }
    else line = line ? line+' '+w : w
  }
  if (line.trim()) lines.push(line.trim())
  return lines.slice(0, 4)
}
function svg(title, cat) {
  const s = STYLES[cat] || { from:'#1e293b', to:'#0f172a', accent:'#64748b' }
  const lines = wrap(title); const lh = 48
  const startY = 340 - ((lines.length-1)*lh)/2
  const t = lines.map((l,i)=>`<text x="100" y="${startY+i*lh}" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="white" letter-spacing="-0.5">${escapeXml(l)}</text>`).join('\n')
  return `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:${s.from}"/><stop offset="100%" style="stop-color:${s.to}"/>
  </linearGradient></defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1100" cy="100" r="300" fill="${s.accent}" opacity="0.06"/>
  <circle cx="1000" cy="500" r="200" fill="${s.accent}" opacity="0.04"/>
  <circle cx="100" cy="600" r="150" fill="${s.accent}" opacity="0.05"/>
  <rect x="80" y="${startY-60}" width="4" height="${lines.length*lh+30}" rx="2" fill="${s.accent}"/>
  <rect x="80" y="80" width="${cat.length*14+30}" height="32" rx="16" fill="${s.accent}" opacity="0.2"/>
  <text x="95" y="102" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="${s.accent}" letter-spacing="1.5">${escapeXml(cat.toUpperCase())}</text>
  ${t}
  <line x1="80" y1="600" x2="400" y2="600" stroke="${s.accent}" stroke-width="2" opacity="0.3"/>
  <text x="80" y="640" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="white" opacity="0.3" font-weight="500">nazranka.ru</text>
</svg>`
}

async function main() {
  for (const a of articles) {
    console.log(`\n→ ${a.title.slice(0, 60)}...`)
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', a.slug).maybeSingle()
    if (existing) { console.log('  ! слаг уже занят, пропускаю'); continue }
    const catName = CAT_NAME[a.category_id] || 'Новости'
    const buf = await sharp(Buffer.from(svg(a.title, catName))).resize(1200, 675).webp({ quality: 85 }).toBuffer()
    const file = `styled-${a.slug.slice(0, 30)}-${Date.now()}.webp`
    const { error: upErr } = await supabase.storage.from('covers').upload(file, buf, { contentType: 'image/webp' })
    if (upErr) { console.log('  ✗ обложка:', upErr.message); continue }
    const cover = supabase.storage.from('covers').getPublicUrl(file).data.publicUrl
    const { error: insErr } = await supabase.from('articles').insert({
      title: a.title, slug: a.slug, lead: a.lead, content: a.content,
      cover_image: cover, category_id: a.category_id, status: 'published',
      published_at: a.published_at,
    })
    if (insErr) { console.log('  ✗ вставка:', insErr.message); continue }
    console.log('  ✓ опубликовано')
  }
}
main().catch(e => { console.error(e); process.exit(1) })
