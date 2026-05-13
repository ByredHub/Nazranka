import Link from 'next/link'

export default function ArticleNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">
        Статья не найдена или была удалена.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
      >
        На главную
      </Link>
    </div>
  )
}
