import Link from 'next/link'
import type { Route } from 'next'
import { getCategoryColor } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  slug: string
}

export function CategoryBadge({ name, slug }: CategoryBadgeProps) {
  const { bg, text } = getCategoryColor(slug)

  return (
    <Link
      href={`/${slug}` as Route}
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} hover:opacity-80 transition-opacity`}
    >
      {name}
    </Link>
  )
}
