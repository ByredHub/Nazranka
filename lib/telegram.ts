const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || ''
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

// --- Отправка сообщений ---

export async function sendMessage(chatId: number | string, text: string, replyMarkup?: object) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(replyMarkup && { reply_markup: replyMarkup }),
    }),
  })
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  await fetch(`${API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}

export async function editMessageText(chatId: number | string, messageId: number, text: string) {
  await fetch(`${API}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
}

export async function sendPhoto(chatId: number | string, photo: string, caption: string) {
  await fetch(`${API}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, photo, caption, parse_mode: 'HTML' }),
  })
}

// --- Автопост в канал при публикации ---

export async function postArticleToChannel(article: {
  title: string
  slug: string
  lead: string | null
  cover_image: string | null
  category?: { slug: string; name: string } | null
}) {
  const categorySlug = article.category?.slug || 'obshchestvo'
  const url = `https://nazranka.ru/${categorySlug}/${article.slug}`
  const lead = article.lead ? article.lead.slice(0, 200) + (article.lead.length > 200 ? '...' : '') : ''

  const text = [
    `<b>${article.title}</b>`,
    '',
    lead,
    '',
    `<a href="${url}">Читать на nazranka.ru</a>`,
  ].filter(Boolean).join('\n')

  if (article.cover_image) {
    await sendPhoto(CHANNEL_ID, article.cover_image, text)
  } else {
    await sendMessage(CHANNEL_ID, text)
  }
}

// --- Фильтрация сообщений от пользователей ---

const SPAM_PATTERNS = [
  /https?:\/\//i,
  /t\.me\//i,
  /купи/i, /скидк/i, /промокод/i, /акци[яи]/i, /распродаж/i,
  /заработ/i, /доход.*пассив/i, /инвестиц/i,
  /casino/i, /ставк[аи]/i, /букмекер/i,
]

const BAD_WORDS = [
  'блять', 'бля', 'хуй', 'пизд', 'ебать', 'еба', 'сука', 'нахуй', 'пидор', 'мудак',
]

export function filterMessage(text: string): { ok: boolean; reason?: string } {
  if (!text || text.trim().length < 30) {
    return { ok: false, reason: 'too_short' }
  }

  if (text.length > 4000) {
    return { ok: false, reason: 'too_long' }
  }

  const lower = text.toLowerCase()

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return { ok: false, reason: 'spam' }
    }
  }

  for (const word of BAD_WORDS) {
    if (lower.includes(word)) {
      return { ok: false, reason: 'profanity' }
    }
  }

  return { ok: true }
}

// --- Установка webhook ---

export async function setWebhook(url: string, secret: string) {
  const res = await fetch(`${API}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, secret_token: secret }),
  })
  return res.json()
}
