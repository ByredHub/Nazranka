'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from './TiptapEditor'
import { createArticle, updateArticle, uploadImage, updateArticleTags } from '@/lib/actions'
import { ADMIN_PATH } from '@/lib/constants'
import type { Article, Category, Tag } from '@/lib/types'
import type { Route } from 'next'
import slugify from 'slugify'

interface ArticleFormProps {
  article?: Article | null
  categories: Category[]
  tags: Tag[]
  articleTags?: string[] // tag IDs
}

export function ArticleForm({ article, categories, tags, articleTags = [] }: ArticleFormProps) {
  const router = useRouter()
  const isEdit = !!article

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [lead, setLead] = useState(article?.lead || '')
  const [content, setContent] = useState<object | null>(article?.content as object || null)
  const [coverImage, setCoverImage] = useState(article?.cover_image || '')
  const [categoryId, setCategoryId] = useState(article?.category_id || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(articleTags)
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft')
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || '')
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false)
  // Дата публикации: для формы datetime-local (YYYY-MM-DDTHH:mm)
  const [publishedAt, setPublishedAt] = useState(
    article?.published_at
      ? new Date(article.published_at).toISOString().slice(0, 16)
      : ''
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Автогенерация slug из заголовка
  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit || !article?.slug) {
      setSlug(slugify(value, { lower: true, strict: true }))
    }
  }

  // Автосжатие и загрузка обложки
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const compressed = await compressImage(file, 1200, 0.85)
      const formData = new FormData()
      formData.append('file', compressed)

      const url = await uploadImage(formData)
      setCoverImage(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    }
  }

  // Сжатие изображения через Canvas
  async function compressImage(file: File, maxWidth: number, quality: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Масштабируем если шире maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' }))
          },
          'image/webp',
          quality
        )
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  // Переключение тегов (максимум 2)
  function toggleTag(tagId: string) {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      }
      if (prev.length >= 2) {
        // Убираем первый, добавляем новый
        return [prev[1], tagId]
      }
      return [...prev, tagId]
    })
  }

  // Сохранение
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = {
      title,
      slug,
      lead: lead || null,
      content,
      cover_image: coverImage || null,
      category_id: categoryId,
      status,
      is_featured: isFeatured,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    }

    try {
      if (isEdit && article) {
        await updateArticle(article.id, data)
        await updateArticleTags(article.id, selectedTags)
      } else {
        const newArticle = await createArticle(data)
        if (newArticle && selectedTags.length > 0) {
          await updateArticleTags(newArticle.id, selectedTags)
        }
      }
      router.push(`${ADMIN_PATH}/articles` as Route)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Заголовок */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Введите заголовок статьи"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL (slug)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-500"
        />
      </div>

      {/* Лид */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание (лид)</label>
        <textarea
          value={lead}
          onChange={(e) => setLead(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          placeholder="Краткое описание для карточки"
        />
      </div>

      {/* Обложка */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Обложка</label>
        <p className="text-xs text-gray-400 mb-2">Рекомендуемый размер: 1200×675 px (16:9). Горизонтальные фото работают лучше всего.</p>
        {coverImage && (
          <div className="mb-2 relative inline-block">
            <img src={coverImage} alt="Обложка" className="h-32 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      {/* Контент — Tiptap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Текст статьи</label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      {/* Категория + Статус + Дата */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Раздел</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Выберите раздел</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата публикации</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-gray-400 mt-1">Оставить пустым — авто при публикации</p>
        </div>
      </div>

      {/* Теги */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Теги</label>
        <p className="text-xs text-gray-400 mb-2">Максимум 2 тега. Выбрано: {selectedTags.length}/2</p>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Закрепить на главной */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <label htmlFor="featured" className="text-sm text-gray-700">
          Закрепить на главной
        </label>
      </div>

      {/* SEO */}
      <details className="bg-gray-50 rounded-lg p-4">
        <summary className="text-sm font-medium text-gray-700 cursor-pointer">SEO-настройки</summary>
        <div className="mt-3 space-y-3">
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Meta Title"
            className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm"
          />
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Meta Description"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
          />
        </div>
      </details>

      {/* Кнопки */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#104992' }}
        >
          {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
