import Link from 'next/link'
import type { Route } from 'next'
import Image from 'next/image'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatDate, truncateText } from '@/lib/utils'
import type { Article } from '@/lib/types'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const categorySlug = article.category?.slug || 'novosti'
  const categoryName = article.category?.name || 'Новости'
  const articleUrl = `/${categorySlug}/${article.slug}` as Route

  return (
    <article className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Обложка */}
      <Link href={articleUrl} className="block bg-gray-100">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            width={800}
            height={450}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Контент */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge name={categoryName} slug={categorySlug} />
          {article.published_at && (
            <time className="text-xs text-gray-500" dateTime={article.published_at}>
              {formatDate(article.published_at)}
            </time>
          )}
        </div>

        <h3 className="mb-2">
          <Link
            href={articleUrl}
            className="text-lg font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2"
          >
            {article.title}
          </Link>
        </h3>

        {article.lead && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {truncateText(article.lead, 150)}
          </p>
        )}
      </div>
    </article>
  )
}
