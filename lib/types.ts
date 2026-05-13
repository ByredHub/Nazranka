// === Основные типы данных ===

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  sort_order: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  is_hot: boolean
}

export interface Article {
  id: string
  title: string
  slug: string
  lead: string | null
  content: TiptapNode | null
  cover_image: string | null
  category_id: string
  author_id: string | null
  status: 'draft' | 'published'
  views: number
  is_featured: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  // Joined relations
  category?: Category
  tags?: Tag[]
}

export interface User {
  id: string
  email: string
  display_name: string | null
  role: 'admin' | 'editor'
  avatar_url: string | null
}

export interface Media {
  id: string
  url: string
  filename: string | null
  alt_text: string | null
  uploaded_by: string | null
  created_at: string
}

// === Tiptap JSON Content ===

export interface TiptapMark {
  type: string
  attrs?: Record<string, unknown>
}

export interface TiptapNode {
  type: string
  content?: TiptapNode[]
  text?: string
  attrs?: Record<string, unknown>
  marks?: TiptapMark[]
}

// === Утилитарные типы ===

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  totalPages: number
}
