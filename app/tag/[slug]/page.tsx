export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTagBySlug, getArticles } from '@/lib/queries'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { LatestNews } from '@/components/widgets/LatestNews'
import { Sidebar } from '@/components/layout/Sidebar'
import { Pagination } from '@/components/ui/Pagination'

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)

  if (!tag) return { title: 'Тег не найден' }

  return {
    title: tag.name,
    description: `Материалы по теме "${tag.name}" на nazranka.ru`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams

  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  // SECURITY: валидация параметра страницы
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)

  const { data: articles, totalPages } = await getArticles({
    tagSlug: slug,
    page,
    limit: 10,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          <span className="text-brand-600">#</span> {tag.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ArticleGrid articles={articles} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/tag/${slug}`}
          />
        </div>

        <Sidebar>
          <LatestNews />
        </Sidebar>
      </div>
    </div>
  )
}
