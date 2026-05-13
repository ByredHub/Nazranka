'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import type { Tag } from '@/lib/types'

interface TagFilterProps {
  tags: Tag[]
  activeTagSlug?: string
}

const CATEGORY_SLUGS = new Set([
  'politika', 'ekonomika', 'obshchestvo', 'kultura', 'sport',
  'proisshestviya', 'narodnye-novosti', 'istoriya', 'obrazovanie',
  'sport-tag',
])

export function TagFilter({ tags, activeTagSlug }: TagFilterProps) {
  const [open, setOpen] = useState(false)

  // Убираем теги, дублирующие категории
  const filteredTags = tags.filter(t => !CATEGORY_SLUGS.has(t.slug))

  if (filteredTags.length === 0) return null

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          open || activeTagSlug
            ? 'bg-brand-600 text-white'
            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
        }`}
        title="Фильтр по тегам"
        aria-label="Фильтр по тегам"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-40 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[280px]">
          <div className="flex flex-wrap gap-2">
            {activeTagSlug && (
              <Link
                href={(typeof window !== 'undefined' ? window.location.pathname : '/') as Route}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={() => setOpen(false)}
              >
                ✕ Сбросить
              </Link>
            )}
            {filteredTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}` as Route}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  tag.slug === activeTagSlug
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700'
                }`}
                onClick={() => setOpen(false)}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
