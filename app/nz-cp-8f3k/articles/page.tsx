import Link from 'next/link'
import type { Route } from 'next'
import { createServerClient } from '@/lib/supabase-server'
import { formatDateShort } from '@/lib/utils'
import { DeleteArticleButton } from '@/components/admin/DeleteArticleButton'

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; q?: string; page?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerClient()

  // Запрос статей
  let query = supabase
    .from('articles')
    .select('*, category:categories(name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }
  if (params.q) {
    query = query.ilike('title', `%${params.q}%`)
  }
  if (params.category && params.category !== 'all') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  const { data: articles, count } = await query

  // Категории для фильтра
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Публикации</h1>
          <p className="text-sm text-gray-500 mt-1">Всего: {count ?? 0}</p>
        </div>
        <Link
          href="/nz-cp-8f3k/articles/new"
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#104992' }}
        >
          + Новая публикация
        </Link>
      </div>

      {/* Фильтры */}
      <form className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={params.q || ''}
          placeholder="Поиск по заголовку..."
          className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
        />
        <select
          name="status"
          defaultValue={params.status || 'all'}
          className="h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">Все статусы</option>
          <option value="published">Опубликовано</option>
          <option value="draft">Черновик</option>
        </select>
        <select
          name="category"
          defaultValue={params.category || 'all'}
          className="h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">Все разделы</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 px-4 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          Применить
        </button>
      </form>

      {/* Таблица */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Заголовок</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Раздел</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Статус</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Дата</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/nz-cp-8f3k/articles/${article.id}/edit` as Route}
                      className="font-medium text-gray-900 hover:text-brand-600 line-clamp-1"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {(article.category as { name: string } | null)?.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {article.created_at ? formatDateShort(article.created_at) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/nz-cp-8f3k/articles/${article.id}/edit` as Route}
                        className="text-gray-400 hover:text-brand-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <DeleteArticleButton articleId={article.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Публикации не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
