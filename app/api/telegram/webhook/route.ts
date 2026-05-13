import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendMessage, filterMessage, answerCallbackQuery, editMessageText } from '@/lib/telegram'
import { rewriteMessage } from '@/lib/ai'
import { ADMIN_PATH } from '@/lib/constants'
import slugify from 'slugify'

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || ''
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''
const MNENIYA_CATEGORY_ID = 'c1000000-0000-4000-a000-000000000007'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  return NextResponse.json({
    has_bot_token: !!process.env.TELEGRAM_BOT_TOKEN,
    has_channel: !!process.env.TELEGRAM_CHANNEL_ID,
    has_admin: !!process.env.TELEGRAM_ADMIN_CHAT_ID,
    has_secret: !!process.env.TELEGRAM_WEBHOOK_SECRET,
  })
}

export async function POST(request: NextRequest) {
  if (WEBHOOK_SECRET) {
    const secret = request.headers.get('x-telegram-bot-api-secret-token')
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'bad_secret' }, { status: 403 })
    }
  }

  try {
    const update = await request.json()

    if (update.callback_query) {
      return await handleCallback(update.callback_query)
    }

    const message = update.message
    if (!message || !message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = message.text.trim()
    const userName = message.from?.first_name || 'Аноним'
    const userHandle = message.from?.username ? '@' + message.from.username : ''

    if (text === '/me') {
      await sendMessage(chatId, `Ваш chat_id: <code>${chatId}</code>`)
      return NextResponse.json({ ok: true })
    }

    if (text === '/start') {
      await sendMessage(chatId,
        '👋 Ассаламу алейкум! Это бот портала <b>nazranka.ru</b>\n\n' +
        'Напишите своё обращение, мнение или новость из вашего города/села.\n\n' +
        'Ваше сообщение будет рассмотрено редакцией и при одобрении опубликовано в разделе «Мнения людей».\n\n' +
        '📝 Минимум 30 символов, без ссылок и мата.'
      )
      return NextResponse.json({ ok: true })
    }

    const check = filterMessage(text)
    if (!check.ok) {
      const replies: Record<string, string> = {
        too_short: '⚠️ Сообщение слишком короткое. Напишите подробнее (минимум 30 символов).',
        too_long: '⚠️ Сообщение слишком длинное. Сократите до 4000 символов.',
        spam: '⚠️ Сообщение содержит ссылки или рекламу и не может быть опубликовано.',
        profanity: '⚠️ Сообщение содержит нецензурную лексику. Перефразируйте, пожалуйста.',
      }
      await sendMessage(chatId, replies[check.reason!] || '⚠️ Сообщение не прошло модерацию.')
      return NextResponse.json({ ok: true })
    }

    // Сохраняем сырое сообщение в pending (без AI — экономим)
    const supabase = getSupabase()
    const { data: pending, error } = await supabase
      .from('pending_submissions')
      .insert({
        user_name: userName,
        user_telegram_id: chatId,
        user_handle: userHandle,
        text,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error.message)
      await sendMessage(chatId, '❌ Произошла ошибка. Попробуйте позже.')
      return NextResponse.json({ ok: true })
    }

    await sendMessage(chatId,
      '✅ Спасибо! Ваше обращение принято на рассмотрение.\n\n' +
      'Редакция проверит его и при одобрении опубликует на nazranka.ru.'
    )

    // Уведомление админу — оригинал + кнопки
    if (ADMIN_CHAT_ID && pending) {
      const header =
        '📨 <b>Новое обращение на модерацию</b>\n\n' +
        `<b>От:</b> ${userName} ${userHandle}\n\n`

      const maxTextLen = 4096 - header.length - 20
      const preview = text.length > maxTextLen ? text.slice(0, maxTextLen) + '...' : text

      await sendMessage(ADMIN_CHAT_ID, header + preview, {
        inline_keyboard: [[
          { text: '✅ Одобрить (AI перепишет)', callback_data: `ok:${pending.id}` },
          { text: '❌ Отклонить', callback_data: `no:${pending.id}` },
        ]],
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: true })
  }
}

// === Обработчик inline-кнопок ===
async function handleCallback(query: {
  id: string
  data: string
  from: { id: number }
  message: { chat: { id: number }; message_id: number; text: string }
}) {
  const { id: queryId, data, from, message } = query

  if (ADMIN_CHAT_ID && String(from.id) !== ADMIN_CHAT_ID) {
    await answerCallbackQuery(queryId, '⛔ Только администратор')
    return NextResponse.json({ ok: true })
  }

  const supabase = getSupabase()

  // Одобрение — вызываем AI рерайт, создаём черновик, удаляем из pending
  if (data.startsWith('ok:')) {
    const pendingId = data.slice(3)

    const { data: pending } = await supabase
      .from('pending_submissions')
      .select('*')
      .eq('id', pendingId)
      .single()

    if (!pending) {
      await answerCallbackQuery(queryId, '❌ Обращение не найдено')
      return NextResponse.json({ ok: true })
    }

    // Мгновенный ответ админу — AI займёт несколько секунд
    await answerCallbackQuery(queryId, '⏳ Обрабатываю через AI...')

    // AI рерайт
    const rewritten = await rewriteMessage(pending.text)

    if (!rewritten.ok) {
      await editMessageText(message.chat.id, message.message_id,
        message.text + `\n\n🤖 <b>AI отклонил:</b> ${rewritten.reason}`
      )
      await supabase.from('pending_submissions').delete().eq('id', pendingId)
      return NextResponse.json({ ok: true })
    }

    const { title, lead, paragraphs } = rewritten.article
    const slug = slugify(title, { lower: true, strict: true }).slice(0, 60) + '-' + Date.now()

    const content = {
      type: 'doc',
      content: paragraphs.map((para) => ({
        type: 'paragraph',
        content: [{ type: 'text', text: para.trim() }],
      })),
    }

    const { data: article, error: insertErr } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        lead,
        content,
        category_id: MNENIYA_CATEGORY_ID,
        status: 'draft',
        meta_description: `Обращение от ${pending.user_name} через Telegram`,
      })
      .select('id')
      .single()

    if (insertErr) {
      await editMessageText(message.chat.id, message.message_id,
        message.text + `\n\n❌ <b>Ошибка создания черновика:</b> ${insertErr.message}`
      )
      return NextResponse.json({ ok: true })
    }

    await supabase.from('pending_submissions').delete().eq('id', pendingId)

    await editMessageText(message.chat.id, message.message_id,
      message.text +
      `\n\n✅ <b>Одобрено и переписано через AI</b>\n\n` +
      `<b>📰 ${title}</b>\n<i>${lead}</i>\n\n` +
      `<a href="https://nazranka.ru${ADMIN_PATH}/articles/${article?.id}/edit">Открыть в админке</a>`
    )

    // Сообщение автору
    if (pending.user_telegram_id) {
      try {
        await sendMessage(pending.user_telegram_id,
          '✅ Ваше обращение одобрено редакцией и будет опубликовано после финальной проверки.'
        )
      } catch {}
    }
  }

  // Отклонение — просто удаляем из pending
  if (data.startsWith('no:')) {
    const pendingId = data.slice(3)

    const { data: pending } = await supabase
      .from('pending_submissions')
      .select('user_telegram_id')
      .eq('id', pendingId)
      .single()

    await supabase.from('pending_submissions').delete().eq('id', pendingId)

    await answerCallbackQuery(queryId, '❌ Отклонено')
    await editMessageText(message.chat.id, message.message_id,
      message.text + '\n\n❌ <b>Отклонено</b>'
    )

    // Сообщение автору
    if (pending?.user_telegram_id) {
      try {
        await sendMessage(pending.user_telegram_id,
          '❌ К сожалению, ваше обращение не было одобрено редакцией.'
        )
      } catch {}
    }
  }

  return NextResponse.json({ ok: true })
}
