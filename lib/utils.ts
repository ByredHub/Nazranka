import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

/**
 * Форматирует дату в русском формате: "1 апреля 2026"
 */
export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: ru })
  } catch {
    return dateString
  }
}

/**
 * Форматирует дату кратко: "1 апр 2026"
 */
export function formatDateShort(dateString: string): string {
  try {
    return format(new Date(dateString), 'd MMM yyyy', { locale: ru })
  } catch {
    return dateString
  }
}

/**
 * Обрезает текст до указанной длины, добавляя многоточие
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

/**
 * Цветовая карта для категорий
 */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  politika: { bg: 'bg-red-100', text: 'text-red-800' },
  ekonomika: { bg: 'bg-blue-100', text: 'text-blue-800' },
  obshchestvo: { bg: 'bg-teal-100', text: 'text-teal-800' },
  kultura: { bg: 'bg-purple-100', text: 'text-purple-800' },
  sport: { bg: 'bg-green-100', text: 'text-green-800' },
  proisshestviya: { bg: 'bg-orange-100', text: 'text-orange-800' },
  'mneniya-lyudej': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  istoriya: { bg: 'bg-amber-100', text: 'text-amber-800' },
  obrazovanie: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  afisha: { bg: 'bg-pink-100', text: 'text-pink-800' },
  'nasha-zemlya': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
}

/**
 * Возвращает цвета для категории по slug
 */
export function getCategoryColor(slug: string): { bg: string; text: string } {
  return CATEGORY_COLORS[slug] || { bg: 'bg-gray-100', text: 'text-gray-800' }
}
