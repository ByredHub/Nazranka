export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryBySlug, getArticles, getAllTags } from '@/lib/queries'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { Pagination } from '@/components/ui/Pagination'
import { TagFilter } from '@/components/widgets/TagFilter'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)

  if (!category) return { title: 'Раздел не найден' }

  return {
    title: category.name,
    description: `${category.name} — материалы на nazranka.ru`,
    openGraph: {
      title: `${category.name} — nazranka.ru`,
      description: `${category.name} — материалы на nazranka.ru`,
      type: 'website',
      siteName: 'nazranka.ru',
      locale: 'ru_RU',
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const { page: pageParam } = await searchParams

  const category = await getCategoryBySlug(categorySlug)
  if (!category) notFound()

  // SECURITY: валидация параметра страницы
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)

  const [{ data: articles, totalPages }, tags] = await Promise.all([
    getArticles({ categorySlug, page, limit: 10 }),
    getAllTags(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        <TagFilter tags={tags} />
      </div>

      <ArticleGrid articles={articles} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/${categorySlug}`}
      />
    </div>
  )
}
