import { createPublicClient } from './supabase-public'
import type { Article, Category, Tag, PaginatedResult } from './types'

const ARTICLES_PER_PAGE = 10

// === Статьи ===

interface GetArticlesOptions {
  categorySlug?: string
  tagSlug?: string
  featured?: boolean
  limit?: number
  page?: number
}

export async function getArticles(
  opts: GetArticlesOptions = {}
): Promise<PaginatedResult<Article>> {
  const { categorySlug, tagSlug, featured, limit = ARTICLES_PER_PAGE, page = 1 } = opts
  const offset = (page - 1) * limit

  const supabase = createPublicClient()

  let query = supabase
    .from('articles')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (categorySlug) {
    // Фильтр по категории через подзапрос
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    } else {
      return { data: [], count: 0, page, totalPages: 0 }
    }
  }

  if (tagSlug) {
    // Фильтр по тегу через junction table
    const { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single()

    if (tag) {
      const { data: articleIds } = await supabase
        .from('article_tags')
        .select('article_id')
        .eq('tag_id', tag.id)

      if (articleIds && articleIds.length > 0) {
        query = query.in('id', articleIds.map(a => a.article_id))
      } else {
        return { data: [], count: 0, page, totalPages: 0 }
      }
    } else {
      return { data: [], count: 0, page, totalPages: 0 }
    }
  }

  if (featured) {
    query = query.eq('is_featured', true).order('sort_order', { ascending: true })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    console.error('getArticles error:', error.message)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const totalCount = count ?? 0

  return {
    data: (data as Article[]) || [],
    count: totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  }
}

export async function getArticleBySlug(
  categorySlug: string,
  articleSlug: string
): Promise<Article | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*)')
    .eq('slug', articleSlug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null

  // Проверяем что категория совпадает (SECURITY: предотвращаем доступ по неправильному пути)
  if (data.category && data.category.slug !== categorySlug) return null

  // Загружаем теги статьи
  const { data: tagLinks } = await supabase
    .from('article_tags')
    .select('tag_id, tags(*)')
    .eq('article_id', data.id)

  const article = data as Article
  article.tags = tagLinks?.map(link => (link as unknown as { tags: Tag }).tags).filter(Boolean) || []

  return article
}

// === Категории ===

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getCategories error:', error.message)
    return []
  }

  return (data as Category[]) || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Category
}

// === Статьи по категории (для блоков на главной) ===

export async function getArticlesByCategory(
  categorySlug: string,
  limit: number = 3
): Promise<Article[]> {
  const supabase = createPublicClient()

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, lead, cover_image, published_at, category:categories(slug, name)')
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as unknown as Article[]) || []
}

// === Теги ===

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Tag
}

export async function getHotTags(): Promise<Tag[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('is_hot', true)

  if (error) return []
  return (data as Tag[]) || []
}

// === Все теги ===

export async function getAllTags(): Promise<Tag[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) return []
  return (data as Tag[]) || []
}

// === Виджеты ===

export async function getLatestArticles(limit: number = 5): Promise<Article[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, lead, cover_image, published_at, category:categories(slug, name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as unknown as Article[]) || []
}

export async function getRelatedArticles(
  categoryId: string,
  excludeArticleId: string,
  limit: number = 5
): Promise<Article[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, published_at, category:categories(slug, name)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', excludeArticleId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as unknown as Article[]) || []
}

// === Поиск статей ===

export async function searchArticles(
  query: string,
  limit: number = 20
): Promise<Article[]> {
  const supabase = createPublicClient()

  const searchTerm = `%${query}%`

  // Поиск по title, lead и текстовому содержимому content (JSONB)
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, lead, cover_image, published_at, views, category:categories(slug, name)')
    .eq('status', 'published')
    .or(`title.ilike.${searchTerm},lead.ilike.${searchTerm},content::text.ilike.${searchTerm}`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('searchArticles error:', error.message)
    return []
  }
  return (data as unknown as Article[]) || []
}

// === Популярные статьи ===

export async function getPopularArticles(limit: number = 5): Promise<Article[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, lead, cover_image, published_at, views, category:categories(slug, name)')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as unknown as Article[]) || []
}

// === Медиатека ===

export async function getMediaFiles(): Promise<{ name: string; url: string; created_at: string }[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase.storage
    .from('covers')
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

  if (error || !data) return []

  return data
    .filter(f => !f.name.startsWith('.'))
    .map(f => {
      const { data: urlData } = supabase.storage.from('covers').getPublicUrl(f.name)
      return {
        name: f.name,
        url: urlData.publicUrl,
        created_at: f.created_at || '',
      }
    })
}

// === Инкремент просмотров ===

export async function incrementArticleViews(articleId: string): Promise<void> {
  try {
    const supabase = createPublicClient()
    // Простой инкремент — RPC будет добавлен позже при необходимости
    const { data } = await supabase
      .from('articles')
      .select('views')
      .eq('id', articleId)
      .single()

    if (data) {
      await supabase
        .from('articles')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', articleId)
    }
  } catch {
    // Не критичная ошибка — просто пропускаем
  }
}
