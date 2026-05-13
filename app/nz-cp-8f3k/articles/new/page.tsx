import { createServerClient } from '@/lib/supabase-server'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function NewArticlePage() {
  const supabase = await createServerClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Новая публикация</h1>
      <ArticleForm
        categories={categories || []}
        tags={tags || []}
      />
    </div>
  )
}
