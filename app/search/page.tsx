export const revalidate = 0

import Link from 'next/link'
import type { Route } from 'next'
import Image from 'next/image'
import { searchArticles } from '@/lib/queries'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Поиск: ${q}` : 'Поиск',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''
  const articles = query ? await searchArticles(query) : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {query ? (
          <>Результаты поиска: <span className="text-brand-600">&laquo;{query}&raquo;</span></>
        ) : (
          'Поиск'
        )}
      </h1>

      {query && articles.length === 0 && (
        <p className="text-gray-500 text-lg">
          По вашему запросу ничего не найдено. Попробуйте изменить запрос.
        </p>
      )}

      {!query && (
        <p className="text-gray-500 text-lg">
          Введите запрос в поле поиска выше.
        </p>
      )}

      {articles.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-6">
            Найдено: {articles.length} {articles.length === 1 ? 'статья' : articles.length < 5 ? 'статьи' : 'статей'}
          </p>

          <div className="space-y-6">
            {articles.map((article) => {
              const categorySlug = article.category?.slug || 'politika'
              const categoryName = article.category?.name || ''
              return (
                <article key={article.id} className="flex gap-4 items-start border-b border-gray-100 pb-6">
                  <Link
                    href={`/${categorySlug}/${article.slug}` as Route}
                    className="flex-shrink-0 relative w-[160px] h-[100px] rounded-lg overflow-hidden bg-gray-100"
                  >
                    {article.cover_image ? (
                      <Image
                        src={article.cover_image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge name={categoryName} slug={categorySlug} />
                      {article.published_at && (
                        <time className="text-xs text-gray-500" dateTime={article.published_at}>
                          {formatDate(article.published_at)}
                        </time>
                      )}
                    </div>
                    <h2>
                      <Link
                        href={`/${categorySlug}/${article.slug}` as Route}
                        className="text-lg font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    {article.lead && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{article.lead}</p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
