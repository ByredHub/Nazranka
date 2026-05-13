import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Страница не найдена
      </h2>
      <p className="text-gray-600 mb-8">
        Запрашиваемая страница не существует или была удалена.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
      >
        На главную
      </Link>
    </div>
  )
}
