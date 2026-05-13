import Link from 'next/link'
import type { Route } from 'next'
import { getCategories } from '@/lib/queries'

export async function Footer() {
  const categories = await getCategories()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Колонка 1: Логотип и описание */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-white">nazranka</span>
              <span className="text-xl font-light text-gray-500">.ru</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Новости Ингушетии. Культура, история и события республики.
            </p>
          </div>

          {/* Колонка 2: Разделы (динамически из БД) */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Разделы
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}` as Route}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: Соцсети и правовая информация */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Мы в соцсетях
            </h3>
            <div className="flex gap-4 mb-6">
              {/* Telegram */}
              <a
                href="https://t.me/nazranka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              {/* VK */}
              <a
                href="https://vk.com/nazranka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="ВКонтакте"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.524-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.564c0 .426-.136.677-1.252.677-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.339-2.763-5.802 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.491 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z" />
                </svg>
              </a>
            </div>

            {/* 152-ФЗ: Ссылка на политику конфиденциальности */}
            <div className="flex flex-col gap-1">
              <Link
                href="/about"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                О портале
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2025 nazranka.ru. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
