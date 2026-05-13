import Link from 'next/link'
import type { Route } from 'next'
import { createServerClient } from '@/lib/supabase-server'

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  // Статистика
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })

  const { count: publishedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: draftArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const { count: totalTags } = await supabase
    .from('tags')
    .select('*', { count: 'exact', head: true })

  const stats: { label: string; value: number; href: Route; color: string }[] = [
    { label: 'Всего публикаций', value: totalArticles ?? 0, href: '/nz-cp-8f3k/articles', color: 'bg-blue-500' },
    { label: 'Опубликовано', value: publishedArticles ?? 0, href: '/nz-cp-8f3k/articles?status=published' as Route, color: 'bg-green-500' },
    { label: 'Черновиков', value: draftArticles ?? 0, href: '/nz-cp-8f3k/articles?status=draft' as Route, color: 'bg-yellow-500' },
    { label: 'Разделов', value: totalCategories ?? 0, href: '/nz-cp-8f3k/categories', color: 'bg-purple-500' },
    { label: 'Тегов', value: totalTags ?? 0, href: '/nz-cp-8f3k/tags', color: 'bg-teal-500' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <Link
          href="/nz-cp-8f3k/articles/new"
          className="px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ backgroundColor: '#104992' }}
        >
          + Новая публикация
        </Link>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white text-lg font-bold mb-3`}>
              {stat.value}
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Быстрые действия */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/nz-cp-8f3k/articles/new"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Написать статью</span>
        </Link>
        <Link
          href="/nz-cp-8f3k/categories"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Управление разделами</span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Открыть сайт</span>
        </Link>
      </div>
    </div>
  )
}
