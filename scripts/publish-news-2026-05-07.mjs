import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ggzyvxrjdaxerhhrswbc.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CAT = {
  politika:       'c1000000-0000-4000-a000-000000000001',
  ekonomika:      'c1000000-0000-4000-a000-000000000002',
  obshchestvo:    'c1000000-0000-4000-a000-000000000003',
  kultura:        'c1000000-0000-4000-a000-000000000004',
  sport:          'c1000000-0000-4000-a000-000000000005',
  proisshestviya: 'c1000000-0000-4000-a000-000000000006',
  obrazovanie:    'c1000000-0000-4000-a000-000000000009',
  nasha_zemlya:   'c1000000-0000-4000-a000-000000000011',
}
const CAT_NAME = {
  [CAT.politika]: 'Политика', [CAT.ekonomika]: 'Экономика',
  [CAT.obshchestvo]: 'Общество', [CAT.kultura]: 'Культура',
  [CAT.sport]: 'Спорт', [CAT.proisshestviya]: 'Происшествия',
  [CAT.obrazovanie]: 'Образование', [CAT.nasha_zemlya]: 'Наша земля',
}

const para = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
const doc = (...paras) => ({ type: 'doc', content: paras })

const articles = [
  {
    title: 'Прокуратура Малгобека вернула пенсионерке 107 тысяч рублей незаконно удержанной пенсии',
    slug: 'malgobek-prokuratura-pensiya-107-tysyach-2026',
    category_id: CAT.obshchestvo,
    lead: '71-летней жительнице города восстановили прежний размер пенсии и доплатили удержанные средства.',
    content: doc(
      para('Городская прокуратура Малгобека добилась через суд восстановления пенсионных прав 71-летней горожанки. По данным надзорного ведомства, в апреле 2025 года Отделение Социального фонда России по Волгоградской области без законных оснований уменьшило её ежемесячную выплату на 12 тысяч рублей.'),
      para('Прокурор обратился в суд в интересах пенсионерки. Иск удовлетворили в полном объёме: женщине восстановили прежний размер пенсии и обязали Социальный фонд выплатить 107 тысяч рублей, удержанных за прошедший период.'),
      para('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-07T08:00:00+00:00',
  },
  {
    title: 'Дзюдоисты из Али-Юрта привезли 9 медалей с межрегионального турнира «Кубок пяти гор»',
    slug: 'ingushetiya-dzyudo-kubok-pyati-gor-inozemcevo-2026',
    category_id: CAT.sport,
    lead: 'Воспитанники ДЮСШ имени Албогачиевой завоевали три золота, серебро и пять бронзовых медалей в Иноземцеве.',
    content: doc(
      para('Юные дзюдоисты из спортивной школы имени Л. С. Албогачиевой сельского поселения Али-Юрт успешно выступили на межрегиональных соревнованиях «Кубок пяти гор» в посёлке Иноземцево. В турнире участвовали спортсмены 2012–2019 годов рождения.'),
      para('Золотые медали завоевали Мухаммад Цечоев, Мухаммад Сагов и Салахудин Катиев. Серебряным призёром стал Исмаил Цечоев. Бронзовые награды получили Мухаммад Ганиев, Ислам Дармыгов, Магомед Сагов, Асланбек Нальгиев и Мухаммад Дзангиев.'),
      para('Источник: газета «Ингушетия / ГIалгIайче», администрация Назрановского района.'),
    ),
    published_at: '2026-05-07T09:00:00+00:00',
  },
  {
    title: 'Ингушетия представит культурное наследие на телефестивале «Кунацкая»',
    slug: 'ingushetiya-festival-kunatskaya-2026',
    category_id: CAT.kultura,
    lead: 'Республика участвует в межрегиональном телепроекте о семейных традициях и национальной культуре.',
    content: doc(
      para('Делегация Ингушетии участвует в межрегиональном телевизионном культурном фестивале «Кунацкая». Республику представляют директор «Дома молодёжных организаций» Руслан Часыгов и руководитель центра «Парк ремёсел» Саид Гальмиев.'),
      para('Программа фестиваля включает съёмки с участием семейных творческих коллективов, «визиты дружбы» с обменом подарками, презентацию национальной кухни и демонстрацию традиционных ремёсел. Проект объединяет соседние регионы Северного Кавказа в Год единства народов России.'),
      para('Источник: «Дом молодёжных организаций» Ингушетии, газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-07T10:00:00+00:00',
  },
  {
    title: 'В Яндаре нашли пять домовладений с незаконными врезками в коллекторы',
    slug: 'yandare-prirodookhrana-narusheniya-2026',
    category_id: CAT.proisshestviya,
    lead: 'Совместный рейд администрации, Минприроды и полиции выявил нарушения природоохранного законодательства.',
    content: doc(
      para('В селе Яндаре Назрановского района провели совместный рейд по проверке соблюдения природоохранного законодательства. В мероприятии участвовали сотрудники районной и сельской администраций, Министерства природы и экологии Ингушетии, а также участковые уполномоченные ОМВД России.'),
      para('По итогам проверки на пяти адресах зафиксированы незаконные врезки сливных труб и обустройство коллекторных ям. По данным заместителя главы администрации Назрановского района Бекхана Гагиева, в отношении нарушителей составят протоколы об административных правонарушениях, выдадут предписания об устранении и наложат штрафы.'),
      para('Источник: газета «Ингушетия / ГIалгIайче», администрация Назрановского района.'),
    ),
    published_at: '2026-05-07T11:00:00+00:00',
  },
  {
    title: 'В Назрани построят четырёхзвёздочный отель за 1,9 млрд рублей',
    slug: 'nazran-otel-chetyre-zvezdy-1-9-mlrd-2026',
    category_id: CAT.ekonomika,
    lead: 'В реестр классифицированных объектов размещения уже внесены 28 гостиниц и гостевых домов республики.',
    content: doc(
      para('В Ингушетии 28 объектов размещения прошли обязательную классификацию и внесены в единый реестр. В список вошли гостиницы, гостевые дома и модульные средства размещения.'),
      para('В Назрани планируется строительство четырёхзвёздочного гостиничного комплекса с деловым и выставочным пространством. Объём инвестиций оценивается примерно в 1,9 миллиарда рублей.'),
      para('Глава Ингушетии Махмуд-Али Калиматов отметил, что в республике формируется современный рынок гостеприимства. После объединения Минкультуры и комитета по туризму в одно ведомство усилилось взаимодействие с предпринимателями и местными администрациями.'),
      para('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-07T12:00:00+00:00',
  },
  {
    title: 'Агротехнологические классы откроют ещё в семи школах Ингушетии',
    slug: 'ingushetiya-agroklassy-sem-shkol-2026',
    category_id: CAT.obrazovanie,
    lead: 'Сеть агроклассов расширяется в рамках федерального проекта «Кадры в агропромышленном комплексе».',
    content: doc(
      para('В Ингушетии расширяется сеть агротехнологических классов. С нового учебного года такие классы откроют ещё в семи образовательных учреждениях республики. Проект реализуется Минобразованием Ингушетии совместно с Министерством сельского хозяйства и продовольствия.'),
      para('Новые агроклассы появятся в школах № 17 села Верхние Ачалуки, № 11 села Инарки, № 6 села Троицкое, № 3 села Барсуки, № 5 села Экажево, № 5 села Нестеровское и в Многопрофильном лицее № 1. В трёх учреждениях откроются 7-е классы, в четырёх — 8-е.'),
      para('Школьники с 7 по 11 классы будут углублённо изучать биологию, химию, физику и математику с практической ориентацией и взаимодействием с предприятиями агропромышленного комплекса. С 1 сентября 2025 года в пяти школах региона уже работают шесть агроклассов.'),
      para('Программа входит в федеральный проект «Кадры в агропромышленном комплексе» национального проекта «Технологическое обеспечение продовольственной безопасности», рассчитанного до 2030 года.'),
      para('Источник: Минобразования Ингушетии.'),
    ),
    published_at: '2026-05-07T13:00:00+00:00',
  },
  {
    title: 'В сельском поселении Вежарий обновили братскую могилу к 9 Мая',
    slug: 'vezharii-bratskaya-mogila-9-maya-2026',
    category_id: CAT.nasha_zemlya,
    lead: 'В Малгобекском районе благоустраивают памятники и мемориалы к Дню Победы.',
    content: doc(
      para('В сельском поселении Вежарий Малгобекского района провели полный цикл благоустройства братской могилы. Работы прошли в рамках подготовки к 80-летию Великой Победы.'),
      para('По данным пресс-службы района, у мемориала покрасили ограждения, скосили траву, высадили цветы и деревья. В работах участвовали сотрудники сельской администрации, работники Дома культуры и местные жители.'),
      para('Источник: пресс-служба администрации Малгобекского района, газета «Сердало».'),
    ),
    published_at: '2026-05-07T14:00:00+00:00',
  },
]

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;') }

const STYLES = {
  'Политика':     { from:'#1e3a5f', to:'#0f1f33', accent:'#3b82f6' },
  'Экономика':    { from:'#1a365d', to:'#0c1929', accent:'#60a5fa' },
  'Общество':     { from:'#134e4a', to:'#0a2725', accent:'#2dd4bf' },
  'Культура':     { from:'#4c1d95', to:'#2e1065', accent:'#a78bfa' },
  'Спорт':        { from:'#14532d', to:'#0a2916', accent:'#4ade80' },
  'Происшествия': { from:'#7c2d12', to:'#431407', accent:'#fb923c' },
  'История':      { from:'#78350f', to:'#451a03', accent:'#f59e0b' },
  'Образование':  { from:'#155e75', to:'#0a2f3b', accent:'#22d3ee' },
  'Афиша':        { from:'#831843', to:'#500724', accent:'#f472b6' },
  'Наша земля':   { from:'#064e3b', to:'#022c22', accent:'#34d399' },
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
