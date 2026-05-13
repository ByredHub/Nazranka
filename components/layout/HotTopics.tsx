import Link from 'next/link'
import type { Route } from 'next'
import { getHotTags } from '@/lib/queries'

export async function HotTopics() {
  const tags = await getHotTags()

  if (tags.length === 0) return null

  return (
    <div className="bg-accent-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-8 overflow-x-auto">
          <span className="flex-shrink-0 text-xs font-bold uppercase tracking-wider opacity-90">
            Горячее:
          </span>
          <div className="flex items-center gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}` as Route}
                className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
