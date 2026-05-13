/**
 * Удаляет обложки у статей старше N дней.
 * Статьи остаются, только cover_image обнуляется и файл удаляется из Storage.
 *
 * Использование:
 *   node scripts/cleanup-old-covers.mjs          — по умолчанию 90 дней
 *   node scripts/cleanup-old-covers.mjs 60        — 60 дней
 *   node scripts/cleanup-old-covers.mjs --dry-run — показать что будет удалено, без удаления
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ggzyvxrjdaxerhhrswbc.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const daysArg = args.find(a => /^\d+$/.test(a))
const DAYS_THRESHOLD = parseInt(daysArg || '90', 10)

function extractFileName(url) {
  // URL вида: https://xxx.supabase.co/storage/v1/object/public/covers/filename.webp
  const parts = url.split('/covers/')
  return parts.length > 1 ? parts[1] : null
}

async function main() {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_THRESHOLD)
  const cutoffISO = cutoffDate.toISOString()

  console.log(`Очистка обложек статей старше ${DAYS_THRESHOLD} дней`)
  console.log(`Дата отсечки: ${cutoffISO.split('T')[0]}`)
  if (dryRun) console.log('--- DRY RUN (ничего не удаляется) ---')
  console.log()

  // Находим статьи с обложками старше порога
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, cover_image, published_at')
    .not('cover_image', 'is', null)
    .lt('published_at', cutoffISO)
    .order('published_at', { ascending: true })

  if (error) {
    console.error('Ошибка запроса:', error.message)
    return
  }

  if (articles.length === 0) {
    console.log('Нет статей для очистки.')
    return
  }

  console.log(`Найдено ${articles.length} статей с обложками для очистки:\n`)

  let cleaned = 0
  let freedFiles = []

  for (const article of articles) {
    const fileName = extractFileName(article.cover_image)
    const date = article.published_at?.split('T')[0] || '?'

    console.log(`  ${date}  ${article.title.slice(0, 60)}`)

    if (dryRun) {
      if (fileName) freedFiles.push(fileName)
      cleaned++
      continue
    }

    // Удаляем файл из Storage
    if (fileName) {
      const { error: storageErr } = await supabase.storage
        .from('covers')
        .remove([fileName])

      if (storageErr) {
        console.log(`    ⚠ Storage: ${storageErr.message}`)
      } else {
        freedFiles.push(fileName)
      }
    }

    // Обнуляем cover_image в БД
    const { error: updateErr } = await supabase
      .from('articles')
      .update({ cover_image: null })
      .eq('id', article.id)

    if (updateErr) {
      console.log(`    ✗ DB: ${updateErr.message}`)
    } else {
      cleaned++
    }
  }

  console.log(`\n✓ ${dryRun ? 'Будет очищено' : 'Очищено'}: ${cleaned} статей, ${freedFiles.length} файлов`)
}

main()
