import Link from 'next/link'
import type { Route } from 'next'
import { getPopularArticles } from '@/lib/queries'
import { formatDateShort } from '@/lib/utils'

export async function PopularArticles() {
  const articles = await getPopularArticles(5)

  if (articles.length === 0) return null

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-accent-600">
        Популярное
      </h2>

      <div className="space-y-4">
        {articles.map((article, index) => {
          const categorySlug = article.category?.slug || 'politika'
          return (
            <article key={article.id} className="flex gap-3 items-start">
              {/* Номер */}
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                {index + 1}
              </span>

              {/* Текст */}
              <div className="flex-1 min-w-0">
                <h3>
                  <Link
                    href={`/${categorySlug}/${article.slug}` as Route}
                    className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
                  >
                    {article.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {article.published_at && (
                    <time className="text-xs text-gray-400" dateTime={article.published_at}>
                      {formatDateShort(article.published_at)}
                    </time>
                  )}
                  <span className="text-xs text-gray-400">
                    {article.views} {article.views === 1 ? 'просмотр' : 'просмотров'}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
