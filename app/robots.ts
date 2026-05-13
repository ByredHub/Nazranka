import type { MetadataRoute } from 'next'
import { ADMIN_PATH } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [`${ADMIN_PATH}/`, '/auth/', '/api/'],
    },
    sitemap: 'https://nazranka.ru/sitemap.xml',
  }
}
