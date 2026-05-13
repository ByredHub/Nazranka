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
  sport:          'c1000000-0000-4000-a000-000000000005',
  istoriya:       'c1000000-0000-4000-a000-000000000008',
  obrazovanie:    'c1000000-0000-4000-a000-000000000009',
}
const CAT_NAME = {
  [CAT.ekonomika]: 'Экономика', [CAT.obshchestvo]: 'Общество',
  [CAT.kultura]: 'Культура', [CAT.sport]: 'Спорт',
  [CAT.istoriya]: 'История', [CAT.obrazovanie]: 'Образование',
}

const p = (t) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] })
const doc = (...x) => ({ type: 'doc', content: x })

const articles = [
  {
    title: 'Назрановская художественная школа сделала к 9 Мая войлочный ковёр «Дружбы и мира»',
    slug: 'nazran-hudozhestvennaya-shkola-voylok-9-maya-2026',
    category_id: CAT.obshchestvo,
    lead: 'Над ковром работали ученицы школы и шестиклассники городской гимназии под руководством этнографа Зейнеп Дзараховой.',
    content: doc(
      p('В Назрановской художественной школе закончили войлочный ковёр «Дружбы и мира», приуроченный ко Дню Победы. Работу вели семь воспитанниц школы — Аиша Дзарахова, Хадиджа Яндиева, Хадиджа Оздоева, Аниса Вышегурова, Аделия Балаева, София Баркинхоева и София Чапанова — вместе с учениками 6 «Б» класса городской гимназии.'),
      p('Главные мотивы на полотне — голуби на фоне солнечного круга и обрамление из триколора. По задумке авторов, это образ незыблемого мира и согласия между народами России. Мастер-классы по ковроделию вела этнограф Зейнеп Дзарахова — школа ведёт эту программу с 2016 года.'),
      p('«Наша работа над ковром началась несколько дней назад, и мы завершили её ко Дню Победы», — рассказала директор школы Лидифа Мержоева. Классным руководителем гимназистов выступил Назир Альбертович Точиев.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-09T09:00:00+00:00',
  },
  {
    title: '«Маленький принц» Экзюпери впервые издали на ингушском языке',
    slug: 'malenkii-prinz-ingushskii-yazyk-iraz-2026',
    category_id: CAT.kultura,
    lead: 'Перевод сделала филолог Хяди Даурбекова. Книгу выпустило издательство «Дуне» при поддержке гранта «Таргим-2025».',
    content: doc(
      p('Сказка Антуана де Сент-Экзюпери «Маленький принц» вышла на ингушском языке. Над переводом работала филолог и сооснователь организации «Ираз» Хяди Даурбекова. Редактуру и корректуру делала Тамара Костоева, иллюстрации — художница Екатерина Смирнова-Черненок.'),
      p('Идея перевести «Маленького принца» родилась у Даурбековой ещё несколько лет назад — на курсах английского языка, когда она читала книгу в оригинале. Двоюродный брат попросил выпустить эту версию для семейной коллекции, и проект постепенно перерос в полноценное издание.'),
      p('Книгу выпустило издательство «Дуне» в партнёрстве с «Иразом». Проект поддержала Росмолодёжь, в 2025 году он стал победителем грантового конкурса «Таргим». Тираж распространяется бесплатно по всем библиотекам республики, молодёжным центрам, школам, университету и культурно-просветительским организациям.'),
      p('«Язык живёт до тех пор, пока на нём говорят о вечном», — сформулировала свою мотивацию Даурбекова. Раньше отдельные переводы «Маленького принца» на ингушский уже делались — например, версия Лейлы Плиевой «З1амига аьла». Новое издание не отменяет их, а дополняет.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-09T10:30:00+00:00',
  },
  {
    title: 'Сотрудники Испытательной пожарной лаборатории Ингушетии сдали кровь накануне Дня Победы',
    slug: 'pozharnaya-laboratoriya-donory-9-maya-2026',
    category_id: CAT.obshchestvo,
    lead: 'Десять сотрудников ИПЛ пришли на республиканскую станцию переливания крови 8 мая.',
    content: doc(
      p('Десять сотрудников Испытательной пожарной лаборатории по Республике Ингушетия стали донорами на республиканской станции переливания крови. Акция прошла 8 мая, накануне Дня Победы, и стала ежегодной традицией коллектива.'),
      p('Сданная кровь пойдёт пациентам с тяжёлыми заболеваниями, пострадавшим в авариях и тем, кто готовится к сложным операциям.'),
      p('«Наш коллектив единогласно поддержал идею провести этот день на станции переливания крови, — рассказал руководитель ИПЛ Ахмед Хутиев. — Сдача крови — это малая часть того, что мы можем сделать сегодня для тех, кто находится в больницах».'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-09T12:00:00+00:00',
  },
  {
    title: 'Адам Гаракоев из Долаково взял серебро международного турнира «Динамо» по вольной борьбе в Минске',
    slug: 'garakoev-vol-borba-minsk-serebro-2026',
    category_id: CAT.sport,
    lead: 'Воспитанник ДЮСШ села Долаково выиграл четыре схватки в категории до 60 кг.',
    content: doc(
      p('Воспитанник Детско-юношеской спортивной школы села Долаково Адам Гаракоев завоевал серебро международного турнира БФСО «Динамо» по вольной борьбе в Минске. Соревнования прошли среди юношей до 18 лет.'),
      p('В весовой категории до 60 килограммов ингушский борец провёл четыре схватки и поднялся на вторую ступень пьедестала. Тренирует Адама Шамиль Гаракоев.'),
      p('Турнир длился три дня и собрал команды организаций БФСО «Динамо» из разных регионов и стран.'),
      p('Источник: газета «Сердало».'),
    ),
    published_at: '2026-05-09T14:00:00+00:00',
  },
  {
    title: 'В Средних Ачалуках отметили 90-летие учёного и историка Ахмета Мальсагова',
    slug: 'malsagov-90-let-srednie-achaluki-2026',
    category_id: CAT.istoriya,
    lead: 'Профессор-геофизик и автор книг по ингушской родословной родился 9 мая 1936 года в селе Альтиево.',
    content: doc(
      p('В Доме культуры села Средние Ачалуки прошла встреча школьников, посвящённая 90-летию со дня рождения профессора Ахмета Уматгиреевича Мальсагова. Мероприятие организовали сотрудники Дома культуры и местные библиотекари в рамках проекта «Культура для школьников».'),
      p('Ахмет Мальсагов родился 9 мая 1936 года в селе Альтиево Назрановского района. Окончив в 1960 году Грозненский нефтяной институт, начал карьеру инженером-геофизиком в Грозном, а с 1967 года перешёл на преподавательскую работу. С 1973 по 1988 год возглавлял кафедру физики того же института. Кандидат технических наук, заслуженный деятель науки и техники ЧИАССР.'),
      p('Параллельно с инженерной карьерой Мальсагов многие годы занимался историей ингушского народа. Он автор работ «Ингуши в войнах России», «Ингуши. История и века родословия» (2003), «Ингушские родословия» (2004) и «Ингуши. Краткая история, их участие в войнах России» (2005).'),
      p('На встрече школьникам рассказали о научных трудах Мальсагова и его вкладе в изучение истории Ингушетии. Источник: газета «Сердало».'),
    ),
    published_at: '2026-05-09T16:00:00+00:00',
  },
]

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;') }

const STYLES = {
  'Экономика':    { from:'#1a365d', to:'#0c1929', accent:'#60a5fa' },
  'Общество':     { from:'#134e4a', to:'#0a2725', accent:'#2dd4bf' },
  'Культура':     { from:'#4c1d95', to:'#2e1065', accent:'#a78bfa' },
  'Спорт':        { from:'#14532d', to:'#0a2916', accent:'#4ade80' },
  'История':      { from:'#78350f', to:'#451a03', accent:'#f59e0b' },
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
    console.log(`\n→ ${a.title.slice(0, 70)}...`)
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', a.slug).maybeSingle()
    if (existing) { console.log('  ! слаг уже занят'); continue }

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
