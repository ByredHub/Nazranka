import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerClient()

  // Загружаем статью
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) notFound()

  // Загружаем категории и теги
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  // Теги статьи
  const { data: articleTags } = await supabase
    .from('article_tags')
    .select('tag_id')
    .eq('article_id', id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактирование</h1>
      <ArticleForm
        article={article}
        categories={categories || []}
        tags={tags || []}
        articleTags={articleTags?.map(t => t.tag_id) || []}
      />
    </div>
  )
}
