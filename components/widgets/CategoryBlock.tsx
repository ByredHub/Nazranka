import Link from 'next/link'
import type { Route } from 'next'
import { getArticlesByCategory } from '@/lib/queries'
import { formatDateShort } from '@/lib/utils'

const CATEGORY_DOT_COLORS: Record<string, string> = {
  politika: 'bg-red-500',
  ekonomika: 'bg-blue-500',
  obshchestvo: 'bg-teal-500',
  kultura: 'bg-purple-500',
  sport: 'bg-green-500',
  proisshestviya: 'bg-orange-500',
  'narodnye-novosti': 'bg-yellow-500',
  istoriya: 'bg-amber-600',
  obrazovanie: 'bg-cyan-500',
}

interface CategoryBlockProps {
  categorySlug: string
  categoryName: string
}

export async function CategoryBlock({ categorySlug, categoryName }: CategoryBlockProps) {
  const articles = await getArticlesByCategory(categorySlug, 3)

  return (
    <div>
      {/* Заголовок категории */}
      <Link
        href={`/${categorySlug}` as Route}
        className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 group"
      >
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${CATEGORY_DOT_COLORS[categorySlug] || 'bg-brand-400'}`}
        />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide group-hover:text-brand-600 transition-colors">
          {categoryName}
        </h3>
      </Link>

      {/* Статьи */}
      {articles.length > 0 ? (
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/${categorySlug}/${article.slug}` as Route}
                className="block text-sm font-medium text-gray-800 hover:text-brand-600 transition-colors leading-snug"
              >
                {article.title}
              </Link>
              {article.published_at && (
                <time className="text-xs text-gray-400 mt-0.5 block" dateTime={article.published_at}>
                  {formatDateShort(article.published_at)}
                </time>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">Пока нет материалов</p>
      )}

      {/* Ссылка на все */}
      <Link
        href={`/${categorySlug}` as Route}
        className="inline-block mt-4 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
      >
        Все материалы →
      </Link>
    </div>
  )
}
