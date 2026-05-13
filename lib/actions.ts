'use server'

import { createServerClient } from './supabase-server'
import { articleSchema, categorySchema, tagSchema } from './validations'
import type { ArticleInput, CategoryInput, TagInput } from './validations'
import { revalidatePath } from 'next/cache'
import { postArticleToChannel } from './telegram'
import { ADMIN_PATH } from './constants'

// === Хелпер: проверка авторизации ===

async function getAuthUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Не авторизован')
  return { supabase, user }
}

// === СТАТЬИ ===

export async function createArticle(input: ArticleInput) {
  const { supabase } = await getAuthUser()
  const data = articleSchema.parse(input)

  // Устанавливаем published_at при публикации
  if (data.status === 'published' && !data.published_at) {
    data.published_at = new Date().toISOString()
  }

  const { data: article, error } = await supabase
    .from('articles')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Ошибка создания: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`${ADMIN_PATH}/articles`)
  return article
}

export async function updateArticle(id: string, input: Partial<ArticleInput>) {
  const { supabase } = await getAuthUser()

  // Частичная валидация
  const data = articleSchema.partial().parse(input)

  // Если публикуем впервые и дата явно не указана — ставим текущую
  if (data.status === 'published' && !data.published_at) {
    const { data: existing } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .single()

    if (existing && !existing.published_at) {
      data.published_at = new Date().toISOString()
    }
  }

  const { error } = await supabase
    .from('articles')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(`Ошибка обновления: ${error.message}`)

  // Автопост в Telegram-канал при публикации
  if (data.status === 'published') {
    try {
      const { data: article } = await supabase
        .from('articles')
        .select('title, slug, lead, cover_image, category:categories(slug, name)')
        .eq('id', id)
        .single()

      if (article) {
        const cat = article.category as unknown as { slug: string; name: string } | null
        await postArticleToChannel({ ...article, category: cat })
      }
    } catch (e) {
      // Не блокируем публикацию если Telegram недоступен
      console.error('Telegram post error:', e)
    }
  }

  revalidatePath('/')
  revalidatePath(`${ADMIN_PATH}/articles`)
}

export async function deleteArticle(id: string) {
  const { supabase } = await getAuthUser()

  // Удаляем связи с тегами
  await supabase.from('article_tags').delete().eq('article_id', id)

  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw new Error(`Ошибка удаления: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`${ADMIN_PATH}/articles`)
}

// === Теги статьи ===

export async function updateArticleTags(articleId: string, tagIds: string[]) {
  const { supabase } = await getAuthUser()

  // Удаляем старые связи
  await supabase.from('article_tags').delete().eq('article_id', articleId)

  // Вставляем новые
  if (tagIds.length > 0) {
    const rows = tagIds.map(tag_id => ({ article_id: articleId, tag_id }))
    await supabase.from('article_tags').insert(rows)
  }

  revalidatePath('/')
}

// === КАТЕГОРИИ ===

export async function createCategory(input: CategoryInput) {
  const { supabase } = await getAuthUser()
  const data = categorySchema.parse(input)

  const { data: category, error } = await supabase
    .from('categories')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Ошибка создания: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`${ADMIN_PATH}/categories`)
  return category
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const { supabase } = await getAuthUser()
  const data = categorySchema.partial().parse(input)

  const { error } = await supabase.from('categories').update(data).eq('id', id)
  if (error) throw new Error(`Ошибка обновления: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`${ADMIN_PATH}/categories`)
}

export async function deleteCategory(id: string) {
  const { supabase } = await getAuthUser()

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(`Ошибка удаления: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`${ADMIN_PATH}/categories`)
}

// === ТЕГИ ===

export async function createTag(input: TagInput) {
  const { supabase } = await getAuthUser()
  const data = tagSchema.parse(input)

  const { data: tag, error } = await supabase
    .from('tags')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Ошибка создания: ${error.message}`)

  revalidatePath(`${ADMIN_PATH}/tags`)
  return tag
}

export async function updateTag(id: string, input: Partial<TagInput>) {
  const { supabase } = await getAuthUser()
  const data = tagSchema.partial().parse(input)

  const { error } = await supabase.from('tags').update(data).eq('id', id)
  if (error) throw new Error(`Ошибка обновления: ${error.message}`)

  revalidatePath(`${ADMIN_PATH}/tags`)
}

export async function deleteTag(id: string) {
  const { supabase } = await getAuthUser()

  // Удаляем связи
  await supabase.from('article_tags').delete().eq('tag_id', id)

  const { error } = await supabase.from('tags').delete().eq('id', id)
  if (error) throw new Error(`Ошибка удаления: ${error.message}`)

  revalidatePath(`${ADMIN_PATH}/tags`)
}

// === МЕДИАТЕКА ===

export async function deleteMedia(fileName: string) {
  const { supabase } = await getAuthUser()

  const { error } = await supabase.storage
    .from('covers')
    .remove([fileName])

  if (error) throw new Error(`Ошибка удаления: ${error.message}`)

  revalidatePath(`${ADMIN_PATH}/media`)
}

// === ЗАГРУЗКА ИЗОБРАЖЕНИЙ ===

export async function uploadImage(formData: FormData): Promise<string> {
  const { supabase } = await getAuthUser()

  const file = formData.get('file') as File
  if (!file) throw new Error('Файл не выбран')

  // SECURITY: проверка MIME и размера
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Разрешены только изображения (JPEG, PNG, WebP, GIF)')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Максимальный размер файла — 10 МБ')
  }

  // Генерируем безопасное имя файла
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('covers')
    .upload(safeName, file)

  if (error) throw new Error(`Ошибка загрузки: ${error.message}`)

  // Получаем публичный URL
  const { data: urlData } = supabase.storage
    .from('covers')
    .getPublicUrl(safeName)

  return urlData.publicUrl
}
