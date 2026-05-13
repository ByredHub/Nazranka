import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ggzyvxrjdaxerhhrswbc.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CAT = {
  ekonomika:      'c1000000-0000-4000-a000-000000000002',
  obshchestvo:    'c1000000-0000-4000-a000-000000000003',
  sport:          'c1000000-0000-4000-a000-000000000005',
  obrazovanie:    'c1000000-0000-4000-a000-000000000009',
  nasha_zemlya:   'c1000000-0000-4000-a000-000000000011',
}
const CAT_NAME = {
  [CAT.ekonomika]: 'Экономика', [CAT.obshchestvo]: 'Общество',
  [CAT.sport]: 'Спорт', [CAT.obrazovanie]: 'Образование',
  [CAT.nasha_zemlya]: 'Наша земля',
}

const p = (t) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] })
const doc = (...x) => ({ type: 'doc', content: x })

const articles = [
  {
    title: 'Школу в Плиево снесут и построят заново — на 420 мест за 600 млн рублей',
    slug: 'plievo-shkola-osnanova-novaya-2028-2026',
    category_id: CAT.obrazovanie,
    lead: 'Старое здание школы имени Суламбека Осканова простояло больше 70 лет. Новое трёхэтажное обещают сдать к концу 2028 года.',
    content: doc(
      p('В селе Плиево Назрановского района начали строительство новой школы имени Суламбека Осканова. Старое здание, прослужившее более 70 лет, демонтируют — оно перестало соответствовать современным требованиям. В сельском поселении проживает свыше 17 тысяч человек.'),
      p('Новое трёхэтажное здание рассчитано на 420 учащихся. В проекте — просторные классы, спортивный и актовый залы, столовая с полным циклом приготовления пищи, библиотека, медицинский блок и помещения для кружков и внеурочных занятий. Завершить строительство планируют к концу 2028 года.'),
      p('На объект выделено более 600 миллионов рублей в рамках национального проекта «Семья». На время стройки учеников перевели в соседнее образовательное учреждение, чтобы не прерывать учебный процесс.'),
      p('«Мы постепенно обновляем всю образовательную инфраструктуру республики, чтобы у каждого ребёнка была возможность учиться рядом с домом», — отметил глава Ингушетии Махмуд-Али Калиматов.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-12T08:30:00+00:00',
  },
  {
    title: 'В Верхних Ачалуках готовят к госэкспертизе проект комплекса по переработке мусора',
    slug: 'verkhnie-achaluki-tko-gosexpertiza-2026',
    category_id: CAT.ekonomika,
    lead: 'Комплекс обработки и захоронения ТКО стоимостью около 4,9 млрд рублей строят по федеральной программе «Экономика замкнутого цикла».',
    content: doc(
      p('Проект комплекса по обработке, утилизации и захоронению твёрдых коммунальных отходов в сельском поселении Верхние Ачалуки Малгобекского района дорабатывают для подачи на государственную экспертизу.'),
      p('Стройку ведут по федеральной программе «Экономика замкнутого цикла» в рамках национального проекта «Экологическое благополучие». Первоначальная стоимость объекта составляла около 4,9 миллиарда рублей, затем смету оптимизировали — итоговая сумма не раскрывалась.'),
      p('К текущему моменту прошли общественные слушания, выбран единый проектировщик и утверждена обновлённая дорожная карта. Параллельно в республике впервые с 2019 года пересматривают территориальную схему обращения с отходами.'),
      p('«Объект позволит навести порядок в сфере обращения с отходами и снизить экологическую нагрузку на населённые пункты», — отметил глава Ингушетии Махмуд-Али Калиматов.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-12T10:00:00+00:00',
  },
  {
    title: 'В Троицком после апрельских ливней укрепили берег Сунжи на улице Шефская',
    slug: 'troickoe-shefskaya-sunzha-bereg-2026',
    category_id: CAT.nasha_zemlya,
    lead: 'Минприроды Ингушетии завершило восстановительные работы — на размытый участок ушло 385 кубометров глины и 70 кубов камня.',
    content: doc(
      p('В сельском поселении Троицкое Сунженского района специалисты Минприроды Ингушетии завершили работы по укреплению берега реки Сунжа на улице Шефская. В начале апреля сильные ливни размыли здесь грунтовую дорогу на участке протяжённостью 10–15 метров.'),
      p('Восстановительные работы заняли два дня. На объекте уложили 385 кубометров глины и 70 кубометров камня. Нижнюю часть берега укрепили каменной наброской, очистили русло реки в месте повреждения и сместили поток от левого берега к правому — чтобы он больше не подмывал дорогу. Само дорожное полотно тоже восстановили.'),
      p('Министр природы и экологии Микаил Мизиев сообщил, что на участке дополнительно планируют высадить деревья для естественного укрепления берега. Работы провели по поручению главы Ингушетии Махмуд-Али Калиматова.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-12T11:30:00+00:00',
  },
  {
    title: 'Назрановские дзюдоисты привезли золото, серебро и бронзу с турнира в Махачкале',
    slug: 'gamurzievskaya-shkola-dzyudo-mahachkala-2026',
    category_id: CAT.sport,
    lead: 'Трое воспитанников Гамурзиевской школы №8 поднялись на пьедестал межрегионального турнира на «Кубок Ризвана Курбанова».',
    content: doc(
      p('Воспитанники Гамурзиевской школы №8 города Назрани взяли три медали на открытом межрегиональном турнире по дзюдо среди юношей до 15 лет в Махачкале. Соревнования проходили в спортивной школе олимпийского резерва имени Магомеда Джафарова и были разыграны на «Кубок депутата Государственной Думы Ризвана Курбанова».'),
      p('Золото завоевал Ахмед Гамурзиев, серебро — Али Гамурзиев, бронза досталась Абдул-Рахиму Гамурзиеву. Готовили спортсменов тренеры Мурад и Джабраил Богатыревы.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-12T13:00:00+00:00',
  },
  {
    title: 'Ингушетия готовится к 34-летию республики — мероприятия пройдут весь июнь',
    slug: 'ingushetiya-34-let-respublike-iyun-2026',
    category_id: CAT.obshchestvo,
    lead: 'Минкультуры представило программу: лекции, выставки, концерты и музейные акции к 4 июня.',
    content: doc(
      p('Министерство культуры и туризма Ингушетии под руководством Залины Льяновой подготовило программу мероприятий к 34-летию со дня образования республики. Главная дата — 4 июня, но активности продлятся весь июнь.'),
      p('В Мемориальном комплексе жертвам репрессий пройдёт лекция об истории ингушской государственности. В музее краеведения имени Мальсагова откроется фотодокументальная экспозиция «Ингушетия сквозь века», в национальной библиотеке — выставка «Славься в веках, Ингушетия». Для молодёжи подготовили видеовыставку «Родного края образ многоликий» с викториной.'),
      p('В Центре театра, кино и креативных индустрий покажут концерт «Са хьамсара мохк» и фильм «Начало». Музей изобразительных искусств проведёт акцию «В музей всей семьёй». В столице запланированы конкурс рисунков и поэтический вечер.'),
      p('«Очень важно, чтобы молодые люди не просто знали дату в календаре, а чувствовали связь с историей своей республики», — отметил премьер-министр региона.'),
      p('Республика Ингушетия была образована 4 июня 1992 года решением Верховного Совета России. Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-12T15:00:00+00:00',
  },
]

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;') }

const STYLES = {
  'Экономика':    { from:'#1a365d', to:'#0c1929', accent:'#60a5fa' },
  'Общество':     { from:'#134e4a', to:'#0a2725', accent:'#2dd4bf' },
  'Спорт':        { from:'#14532d', to:'#0a2916', accent:'#4ade80' },
  'Образование':  { from:'#155e75', to:'#0a2f3b', accent:'#22d3ee' },
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
