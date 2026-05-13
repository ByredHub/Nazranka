import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/queries'
import { HeaderClient } from './HeaderClient'
import { SearchBar } from './SearchBar'

export async function Header() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-50 [-webkit-backface-visibility:hidden] [backface-visibility:hidden]" style={{ backgroundColor: '#104992' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Логотип + тэглайн */}
          <Link href="/" className="flex-shrink-0 flex flex-col justify-center h-24 py-1">
            <Image
              src="/images/logo.png"
              alt="Nazranka — Новости Ингушетии"
              width={500}
              height={96}
              className="h-[72px] w-auto object-contain"
              priority
            />
            <span className="text-[11px] font-sans text-white/50 tracking-[0.2em] uppercase mt-0.5 hidden sm:block" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>Корни глубже — дела выше</span>
          </Link>

          {/* Поиск + мобильный бургер */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            {/* Бургер-меню на мобильном */}
            <HeaderClient categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
