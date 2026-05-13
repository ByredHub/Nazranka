'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Произошла ошибка
      </h1>
      <p className="text-gray-600 mb-8">
        Что-то пошло не так при загрузке страницы. Попробуйте обновить.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  )
}
