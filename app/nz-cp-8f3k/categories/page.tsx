'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions'
import slugify from 'slugify'
import type { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const supabase = createBrowserClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    setCategories(data || [])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await createCategory({
      name: name.trim(),
      slug: slugify(name.trim(), { lower: true, strict: true }),
      sort_order: categories.length + 1,
    })
    setName('')
    loadCategories()
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return
    await updateCategory(id, {
      name: editName.trim(),
      slug: slugify(editName.trim(), { lower: true, strict: true }),
    })
    setEditingId(null)
    loadCategories()
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить этот раздел?')) return
    await deleteCategory(id)
    loadCategories()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Разделы</h1>

      {/* Форма добавления */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название нового раздела"
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
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-4 py-3">
            {editingId === cat.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 px-2 border border-gray-300 rounded text-sm flex-1 max-w-xs"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                />
                <button onClick={() => handleUpdate(cat.id)} className="text-green-600 text-sm font-medium">Сохранить</button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm">Отмена</button>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  <span className="text-xs text-gray-400 ml-2">/{cat.slug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name) }}
                    className="text-gray-400 hover:text-brand-600 text-sm"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">Разделы не найдены</div>
        )}
      </div>
    </div>
  )
}
