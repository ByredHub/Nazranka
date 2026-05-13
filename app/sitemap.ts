import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase-public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()

  // Все опубликованные статьи
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, updated_at, category:categories(slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Все категории
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const baseUrl = 'https://nazranka.ru'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((article) => {
    const catSlug = (article.category as unknown as { slug: string } | null)?.slug || 'politika'
    return {
      url: `${baseUrl}/${catSlug}/${article.slug}`,
      lastModified: new Date(article.updated_at || article.published_at || ''),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }
  })

  return [...staticPages, ...categoryPages, ...articlePages]
}
