import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ggzyvxrjdaxerhhrswbc.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CAT = {
  ekonomika:      'c1000000-0000-4000-a000-000000000002',
  obshchestvo:    'c1000000-0000-4000-a000-000000000003',
  obrazovanie:    'c1000000-0000-4000-a000-000000000009',
  afisha:         'c1000000-0000-4000-a000-000000000010',
}
const CAT_NAME = {
  [CAT.ekonomika]: 'Экономика', [CAT.obshchestvo]: 'Общество',
  [CAT.obrazovanie]: 'Образование', [CAT.afisha]: 'Афиша',
}

const p = (t) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] })
const doc = (...x) => ({ type: 'doc', content: x })

const articles = [
  {
    title: 'На перекрёстке Экажево — Али-Юрт займутся проектом водоотведения после жалоб жителей',
    slug: 'ekazhevo-aliyurt-vodootvedenie-proekt-2026',
    category_id: CAT.obshchestvo,
    lead: 'ЦУР республики провёл совещание и согласовал ключевые этапы: проектные решения, смету, конкурс по подрядчику.',
    content: doc(
      p('Центр управления регионом Ингушетии провёл совещание по проблеме водоотведения на перекрёстке между сельскими поселениями Экажево и Али-Юрт. Жители давно жаловались на постоянные подтопления и сток на этом участке — теперь по нему принят отдельный проект.'),
      p('Ближайшие этапы такие: согласование проектных решений с жителями и собственниками недвижимости, подготовка сметных расчётов и далее — конкурсные процедуры по выбору подрядчика. Стоимость и точные сроки на старте работы не называют, обещают публиковать ход работ отдельно.'),
      p('«Ситуация остаётся на постоянном контроле, а информация о ходе работ будет публиковаться дополнительно», — отметили в ЦУР Ингушетии.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-13T08:30:00+00:00',
  },
  {
    title: 'Ингушетия получит 319,4 млн рублей на поддержку малого и среднего бизнеса в 2026 году',
    slug: 'ingushetiya-msp-319-mln-2026',
    category_id: CAT.ekonomika,
    lead: 'Большую часть суммы — 256,9 млн рублей — выделят из федерального бюджета, ещё 62,6 млн добавит регион.',
    content: doc(
      p('В 2026 году Ингушетии направят 319,4 миллиона рублей на развитие малого и среднего предпринимательства. Из них 256,9 миллиона рублей поступят по субсидии из федерального бюджета (Минэкономразвития России), ещё 62,6 миллиона добавит региональный бюджет.'),
      p('Деньги пойдут на укрепление инфраструктуры поддержки бизнеса: льготный доступ предпринимателей к производственным площадям технопарков, индустриальных, агропромышленных и бизнес-парков. Финансирование идёт в рамках реализации национальных проектов.'),
      p('«Рост МСП напрямую влияет на устойчивость экономики. Это новые рабочие места, расширение налоговой базы, развитие производства», — отметил глава Ингушетии Махмуд-Али Калиматов в своём Telegram-канале.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-13T10:00:00+00:00',
  },
  {
    title: '16 мая в Яндаре пройдёт чемпионат СКФО по робототехнике «РобоКвант-2026»',
    slug: 'robokvant-2026-skfo-yandare-litsej-olimp',
    category_id: CAT.obrazovanie,
    lead: 'Школьники из всех регионов Северного Кавказа будут соревноваться в робо-сумо, робо-футболе и инженерных треках.',
    content: doc(
      p('16 мая в Лицее-центре одарённых детей «Олимп» в сельском поселении Яндаре пройдёт чемпионат СКФО по робототехнике «РобоКвант-2026». Соревнования организуют Минобразования и науки Ингушетии, детский технопарк «Кванториум» и сам лицей.'),
      p('Школьники из регионов Северного Кавказа будут соревноваться в четырёх направлениях: робо-сумо (поединки роботов на ринге), робо-футбол (командные матчи), инженерные треки «Большое путешествие» и «Горный маршрут».'),
      p('Организаторы заявляют о цели развить техническое творчество школьников и поддержать интерес к инженерным профессиям. Для участников возможны новые увлечения и контакты с командами других регионов СКФО.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-13T11:30:00+00:00',
  },
  {
    title: 'Первая группа паломников из Ингушетии вылетела в Мекку и Медину',
    slug: 'hadzh-2026-pervaya-gruppa-magas-osanova-2026',
    category_id: CAT.obshchestvo,
    lead: '180 человек улетели в ночь на 13 мая из аэропорта «Магас». Всего в этом году по программе запланировано восемь рейсов.',
    content: doc(
      p('Первая группа паломников из Ингушетии вылетела в Мекку и Медину. Самолёт со 180 пассажирами поднялся в воздух из международного аэропорта «Магас» имени Героя России Суламбека Осканова в 00:30 13 мая.'),
      p('В рамках хадж-кампании 2026 года из Магаса запланировано восемь рейсов. Программу обеспечивают прямые международные авиарейсы, медицинское сопровождение, помощь волонтёров пожилым паломникам и людям с инвалидностью, а также опытные духовные наставники для каждой группы. Организацией занимаются региональные власти совместно с другими субъектами Северного Кавказа.'),
      p('«Желаю всем нашим паломникам спокойной дороги, здоровья, душевного равновесия и чтобы этот путь стал для них временем духовного очищения и добра», — сказал глава Ингушетии Махмуд-Али Калиматов.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-13T13:00:00+00:00',
  },
  {
    title: 'В Ингушетии стартовала подготовка к VI конкурсу «Лучшее ЛПХ» и IV «Фестивалю цветов»',
    slug: 'lpkh-festival-cvetov-2026-startuyut-13-iyunya',
    category_id: CAT.afisha,
    lead: 'Финальный этап пройдёт 13 июня. Призовой фонд — 3 млн рублей у ЛПХ и 1 млн у «Фестиваля цветов».',
    content: doc(
      p('В Ингушетии начали готовиться к двум ежегодным конкурсам — VI «Лучшее личное подсобное хозяйство» и IV «Фестивалю цветов». Финальный этап обоих пройдёт 13 июня 2026 года.'),
      p('Призовой фонд «Лучшего ЛПХ» — 3 миллиона рублей. У «Фестиваля цветов» — 1 миллион. Оценка участников идёт в два этапа: сначала на муниципальном уровне, затем финал проводит Министерство сельского хозяйства республики.'),
      p('Динамика участия растёт от года к году: на первом конкурсе по ЛПХ заявилось 192 человека, в прошлом году — уже 570. За все годы проведения было определено 122 победителя.'),
      p('«Эти проекты уже стали доброй и полезной традицией для жителей республики», — отметил глава Ингушетии Махмуд-Али Калиматов, призвав присоединиться к участию. О порядке подачи заявок будут сообщать дополнительно через районные администрации.'),
      p('Источник: газета «Ингушетия / ГIалгIайче».'),
    ),
    published_at: '2026-05-13T15:00:00+00:00',
  },
]

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;') }

const STYLES = {
  'Экономика':    { from:'#1a365d', to:'#0c1929', accent:'#60a5fa' },
  'Общество':     { from:'#134e4a', to:'#0a2725', accent:'#2dd4bf' },
  'Образование':  { from:'#155e75', to:'#0a2f3b', accent:'#22d3ee' },
  'Афиша':        { from:'#831843', to:'#500724', accent:'#f472b6' },
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
