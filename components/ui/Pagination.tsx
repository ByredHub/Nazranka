'use client'

import Link from 'next/link'
import type { Route } from 'next'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  // Генерируем массив страниц для отображения
  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  function getPageUrl(page: number): Route {
    if (page === 1) return basePath as Route
    return `${basePath}?page=${page}` as Route
  }

  return (
    <nav aria-label="Пагинация" className="flex justify-center mt-8">
      <ul className="flex items-center gap-1">
        {/* Назад */}
        {currentPage > 1 && (
          <li>
            <Link
              href={getPageUrl(currentPage - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Предыдущая страница"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </li>
        )}

        {/* Номера страниц */}
        {pages.map((page, index) =>
          page === '...' ? (
            <li key={`ellipsis-${index}`}>
              <span className="flex items-center justify-center w-10 h-10 text-gray-400">
                ...
              </span>
            </li>
          ) : (
            <li key={page}>
              <Link
                href={getPageUrl(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            </li>
          )
        )}

        {/* Вперёд */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={getPageUrl(currentPage + 1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Следующая страница"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
