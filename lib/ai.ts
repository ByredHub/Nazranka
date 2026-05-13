// AI-рерайт сообщений пользователей в новостные статьи через Claude API

const API_KEY = process.env.ANTHROPIC_API_KEY || ''
const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

export interface RewrittenArticle {
  title: string
  lead: string
  paragraphs: string[]
}

const SYSTEM_PROMPT = `Ты — редактор регионального новостного портала nazranka.ru (Ингушетия).

Твоя задача: переписать сырое обращение читателя в нейтральную новостную заметку для раздела «Мнения людей».

ПРАВИЛА:
1. Заголовок — короткий (до 100 символов), по сути, без восклицаний и эмоций
2. Лид — одно предложение (до 250 символов), суть обращения
3. Параграфы — 2-4 абзаца, сухим новостным стилем, без первого лица ("я", "мне")
4. Убери эмоции, мат, оскорбления
5. Сохрани все факты: имена, даты, места, цифры
6. Пиши на русском языке, грамотно
7. НЕ добавляй фактов, которых нет в оригинале
8. НЕ пиши про войну, СВО, политику, религию, экстремизм — если сообщение об этом, верни {"reject": true, "reason": "причина"}
9. Если сообщение бессвязное или бессмысленное — верни {"reject": true, "reason": "причина"}

ФОРМАТ ОТВЕТА — строго JSON, без markdown:
{"title":"...","lead":"...","paragraphs":["...","..."]}

Или для отклонения:
{"reject":true,"reason":"..."}`

export async function rewriteMessage(text: string): Promise<
  { ok: true; article: RewrittenArticle } | { ok: false; reason: string }
> {
  if (!API_KEY) return { ok: false, reason: 'AI не настроен' }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Перепиши это сообщение в новостную заметку:\n\n${text}` },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Claude API error:', res.status, err)
      return { ok: false, reason: 'AI недоступен' }
    }

    const data = await res.json()
    const content = data.content?.[0]?.text?.trim() || ''

    // Парсим JSON из ответа
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON in Claude response:', content)
      return { ok: false, reason: 'Не удалось разобрать ответ AI' }
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (parsed.reject) {
      return { ok: false, reason: parsed.reason || 'Отклонено AI' }
    }

    if (!parsed.title || !parsed.lead || !Array.isArray(parsed.paragraphs)) {
      return { ok: false, reason: 'Неполный ответ AI' }
    }

    return {
      ok: true,
      article: {
        title: String(parsed.title).slice(0, 200),
        lead: String(parsed.lead).slice(0, 500),
        paragraphs: parsed.paragraphs.map((p: unknown) => String(p)).filter(Boolean).slice(0, 10),
      },
    }
  } catch (err) {
    console.error('Claude rewrite error:', err)
    return { ok: false, reason: 'Ошибка AI' }
  }
}
