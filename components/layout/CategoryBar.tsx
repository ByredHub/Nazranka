import Link from 'next/link'
import type { Route } from 'next'
import { getCategories } from '@/lib/queries'

const CATEGORY_DOT_COLORS: Record<string, string> = {
  politika: 'bg-red-500',
  ekonomika: 'bg-blue-500',
  obshchestvo: 'bg-teal-500',
  kultura: 'bg-purple-500',
  sport: 'bg-green-500',
  proisshestviya: 'bg-orange-500',
  'mneniya-lyudej': 'bg-yellow-500',
  istoriya: 'bg-amber-600',
  obrazovanie: 'bg-cyan-500',
  afisha: 'bg-pink-500',
  'nasha-zemlya': 'bg-emerald-600',
}

export async function CategoryBar() {
  const categories = await getCategories()

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-10 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}` as Route}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 hover:text-brand-600 uppercase tracking-normal whitespace-nowrap transition-colors"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${CATEGORY_DOT_COLORS[cat.slug] || 'bg-brand-400'}`}
              />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
