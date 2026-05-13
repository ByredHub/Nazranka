'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase'
import { uploadImage } from '@/lib/actions'

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

interface MediaFile {
  name: string
  url: string
}

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!open) return

    async function loadFiles() {
      setLoading(true)
      const supabase = createBrowserClient()

      const { data, error } = await supabase.storage
        .from('covers')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

      if (error || !data) {
        setFiles([])
        setLoading(false)
        return
      }

      const items = data
        .filter(f => !f.name.startsWith('.'))
        .map(f => {
          const { data: urlData } = supabase.storage.from('covers').getPublicUrl(f.name)
          return { name: f.name, url: urlData.publicUrl }
        })

      setFiles(items)
      setLoading(false)
    }

    loadFiles()
  }, [open, reloadKey])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await uploadImage(formData)
      setReloadKey(k => k + 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Выбрать из медиатеки</h2>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors cursor-pointer text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {uploading ? 'Загрузка...' : 'Загрузить'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="text-center text-gray-500 py-12">Загрузка...</div>
          ) : files.length === 0 ? (
            <div className="text-center text-gray-500 py-12">Нет загруженных изображений</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => {
                    onSelect(file.url)
                    onClose()
                  }}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-500 transition-colors bg-gray-100"
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-brand-600 px-2 py-1 rounded transition-opacity">
                      Вставить
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
