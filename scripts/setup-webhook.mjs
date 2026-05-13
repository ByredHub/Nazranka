// Установка Telegram webhook для бота nazranka_bot
// Запуск: node scripts/setup-webhook.mjs

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!BOT_TOKEN) { console.error('Set TELEGRAM_BOT_TOKEN'); process.exit(1) }

const WEBHOOK_URL = 'https://nazranka.ru/api/telegram/webhook'
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET
if (!SECRET) { console.error('Set TELEGRAM_WEBHOOK_SECRET'); process.exit(1) }

async function main() {
  // Установить webhook
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      secret_token: SECRET,
      allowed_updates: ['message'],
    }),
  })
  const data = await res.json()
  console.log('setWebhook:', data)

  // Проверить
  const info = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
  const infoData = await info.json()
  console.log('getWebhookInfo:', JSON.stringify(infoData.result, null, 2))
}

main()
