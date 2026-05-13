'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { createTag, updateTag, deleteTag } from '@/lib/actions'
import slugify from 'slugify'
import type { Tag } from '@/lib/types'

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    loadTags()
  }, [])

  async function loadTags() {
    const supabase = createBrowserClient()
    const { data } = await supabase
      .from('tags')
      .select('*')
      .order('name')
    setTags(data || [])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await createTag({
      name: name.trim(),
      slug: slugify(name.trim(), { lower: true, strict: true }),
      is_hot: false,
    })
    setName('')
    loadTags()
  }

  async function handleToggleHot(id: string, currentValue: boolean) {
    await updateTag(id, { is_hot: !currentValue })
    loadTags()
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить этот тег?')) return
    await deleteTag(id)
    loadTags()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Теги</h1>

      {/* Форма добавления */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название нового тега"
          className="flex-1 max-w-sm h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="px-4 h-10 text-white text-sm font-medium rounded-lg"
          style={{ backgroundColor: '#104992' }}
        >
          Добавить
        </button>
      </form>

      {/* Список */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">{tag.name}</span>
              <span className="text-xs text-gray-400">/{tag.slug}</span>
              {tag.is_hot && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">
                  HOT
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleHot(tag.id, tag.is_hot)}
                className={`text-xs font-medium ${tag.is_hot ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                {tag.is_hot ? 'Убрать HOT' : 'Сделать HOT'}
              </button>
              <button
                onClick={() => handleDelete(tag.id)}
                className="text-gray-400 hover:text-red-600 text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
        {tags.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">Теги не найдены</div>
        )}
      </div>
    </div>
  )
}
