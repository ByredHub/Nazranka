'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
        className="w-48 lg:w-64 h-9 px-3 rounded-l-md bg-white/15 text-white placeholder-white/50 text-sm border border-white/20 focus:outline-none focus:bg-white/25 focus:border-white/40 transition-colors"
      />
      <button
        type="submit"
        aria-label="Поиск"
        className="h-9 px-3 rounded-r-md bg-white/20 text-white/80 hover:bg-white/30 hover:text-white border border-l-0 border-white/20 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  )
}
