export const dynamic = 'force-dynamic'

import { getCategories } from '@/lib/queries'
import { LatestNewsFull } from '@/components/widgets/LatestNewsFull'
import { CategoryBlock } from '@/components/widgets/CategoryBlock'
import { PopularArticles } from '@/components/widgets/PopularArticles'

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Последние новости — компактный список с иконками */}
      <LatestNewsFull />

      {/* Основной контент + сайдбар */}
      <div className="flex gap-10">
        {/* Блоки по категориям — сетка 2 колонки */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {categories.map((cat) => (
              <CategoryBlock
                key={cat.id}
                categorySlug={cat.slug}
                categoryName={cat.name}
              />
            ))}
          </div>
        </div>

        {/* Сайдбар — Популярное */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-36">
            <PopularArticles />
          </div>
        </aside>
      </div>
    </div>
  )
}
