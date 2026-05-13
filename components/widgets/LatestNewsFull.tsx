import Link from 'next/link'
import type { Route } from 'next'
import Image from 'next/image'
import { getLatestArticles, getAllTags } from '@/lib/queries'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { TagFilter } from '@/components/widgets/TagFilter'
import { formatDate } from '@/lib/utils'

export async function LatestNewsFull() {
  const [articles, tags] = await Promise.all([
    getLatestArticles(6),
    getAllTags(),
  ])

  if (articles.length === 0) return null

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b-2" style={{ borderColor: '#104992' }}>
        <TagFilter tags={tags} />
        <h2 className="text-xl font-bold text-gray-900">
          Последние новости
        </h2>
      </div>

      <div className="space-y-4">
        {articles.map((article) => {
          const categorySlug = article.category?.slug || 'politika'
          const categoryName = article.category?.name || ''
          return (
            <article key={article.id} className="flex gap-4 items-start group">
              {/* Маленькая иконка-превью */}
              <Link
                href={`/${categorySlug}/${article.slug}` as Route}
                className="flex-shrink-0 relative w-[120px] h-[80px] rounded-lg overflow-hidden bg-gray-100"
              >
                {article.cover_image ? (
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Текст */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryBadge name={categoryName} slug={categorySlug} />
                  {article.published_at && (
                    <time className="text-xs text-gray-500" dateTime={article.published_at}>
                      {formatDate(article.published_at)}
                    </time>
                  )}
                </div>
                <h3>
                  <Link
                    href={`/${categorySlug}/${article.slug}` as Route}
                    className="text-base font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
                  >
                    {article.title}
                  </Link>
                </h3>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
