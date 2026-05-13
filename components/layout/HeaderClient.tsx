'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import type { Category } from '@/lib/types'

interface HeaderClientProps {
  categories: Category[]
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Кнопка бургер — только мобильный */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Открыть меню"
        className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Мобильное меню — оверлей */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Затемнение фона */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Панель меню */}
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-bold text-brand-700">Меню</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть меню"
                className="p-2 text-gray-500 hover:text-brand-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base font-medium text-gray-800 hover:text-brand-600 border-b border-gray-100"
              >
                Главная
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}` as Route}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-base font-medium text-gray-800 hover:text-brand-600 border-b border-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
