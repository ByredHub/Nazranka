import { notFound } from 'next/navigation'
import type { Metadata, Route } from 'next'
import Image from 'next/image'
import { getArticleBySlug, incrementArticleViews } from '@/lib/queries'
import { TiptapRenderer } from '@/components/articles/TiptapRenderer'
import { Breadcrumbs } from '@/components/articles/Breadcrumbs'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { RelatedArticles } from '@/components/widgets/RelatedArticles'
import { Sidebar } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import type { TiptapNode } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params
  const article = await getArticleBySlug(category, slug)

  if (!article) return { title: 'Статья не найдена' }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.lead || undefined,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.lead || undefined,
      images: article.cover_image ? [{ url: article.cover_image, width: 1200, height: 675 }] : undefined,
      type: 'article',
      publishedTime: article.published_at || undefined,
      siteName: 'nazranka.ru',
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title || article.title,
      description: article.meta_description || article.lead || undefined,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug } = await params
  const article = await getArticleBySlug(categorySlug, slug)

  if (!article) notFound()

  // Инкремент просмотров (fire-and-forget, не блокирует рендер)
  incrementArticleViews(article.id)

  const categoryName = article.category?.name || 'Раздел'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.lead || undefined,
    image: article.cover_image || undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    author: { '@type': 'Organization', name: 'nazranka.ru' },
    publisher: {
      '@type': 'Organization',
      name: 'nazranka.ru',
      logo: { '@type': 'ImageObject', url: 'https://nazranka.ru/images/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nazranka.ru/${categorySlug}/${article.slug}`,
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' as Route },
          { label: categoryName, href: `/${categorySlug}` as Route },
          { label: article.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основной контент статьи */}
        <article className="lg:col-span-2">
          {/* Обложка */}
          {article.cover_image && (
            <div className="relative w-full rounded-lg overflow-hidden mb-6">
              <Image
                src={article.cover_image}
                alt={article.title}
                width={1200}
                height={675}
                className="w-full h-auto rounded-lg"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {/* Мета: категория + дата */}
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge name={categoryName} slug={categorySlug} />
            {article.published_at && (
              <time className="text-sm text-gray-500" dateTime={article.published_at}>
                {formatDate(article.published_at)}
              </time>
            )}
          </div>

          {/* Заголовок */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Лид */}
          {article.lead && (
            <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
              {article.lead}
            </p>
          )}

          {/* Контент статьи */}
          {article.content && (
            <TiptapRenderer content={article.content as TiptapNode} />
          )}

          {/* Теги */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Боковая колонка */}
        <Sidebar>
          <RelatedArticles
            categoryId={article.category_id}
            excludeArticleId={article.id}
          />
        </Sidebar>
      </div>
    </div>
  )
}
