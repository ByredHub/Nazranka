import Link from 'next/link'
import type { Route } from 'next'
import { getLatestArticles } from '@/lib/queries'
import { formatDateShort } from '@/lib/utils'

export async function LatestNews() {
  const articles = await getLatestArticles(5)

  if (articles.length === 0) return null

  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
        Последние новости
      </h3>
      <ul className="space-y-3">
        {articles.map((article) => {
          const categorySlug = article.category?.slug || 'novosti'
          return (
            <li key={article.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
              <Link
                href={`/${categorySlug}/${article.slug}` as Route}
                className="block text-sm font-medium text-gray-800 hover:text-brand-600 transition-colors leading-snug"
              >
                {article.title}
              </Link>
              {article.published_at && (
                <time className="text-xs text-gray-500 mt-1 block" dateTime={article.published_at}>
                  {formatDateShort(article.published_at)}
                </time>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
