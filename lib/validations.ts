import { z } from 'zod'

// === Статьи ===

export const articleSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(500),
  slug: z.string().min(1).max(500),
  lead: z.string().max(1000).optional().nullable(),
  content: z.any().optional().nullable(), // Tiptap JSON
  cover_image: z.string().url().optional().nullable(),
  category_id: z.string().uuid('Выберите категорию'),
  status: z.enum(['draft', 'published']),
  is_featured: z.boolean().optional().default(false),
  sort_order: z.number().int().min(0).max(1000).optional(),
  meta_title: z.string().max(200).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
  published_at: z.string().optional().nullable(),
})

export type ArticleInput = z.infer<typeof articleSchema>

// === Категории ===

export const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100),
  slug: z.string().min(1).max(100),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().min(0).max(1000).optional().default(0),
})

export type CategoryInput = z.infer<typeof categorySchema>

// === Теги ===

export const tagSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100),
  slug: z.string().min(1).max(100),
  is_hot: z.boolean().optional().default(false),
})

export type TagInput = z.infer<typeof tagSchema>
