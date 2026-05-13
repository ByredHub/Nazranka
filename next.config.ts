import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Типизированные ссылки: TS валидирует href в <Link> и router.push/replace
  // на этапе компиляции, не давая ссылаться на несуществующие роуты.
  typedRoutes: true,

  // Увеличиваем лимит body для Server Actions (загрузка изображений)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Оптимизация изображений: разрешаем Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // SECURITY: Security headers (из WEZARIO Security Review)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Запрет встраивания в iframe (защита от clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Запрет MIME-sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Реферер — только origin
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Strict-Transport-Security (HTTPS only)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Запрет любым прокси/CDN изменять или сжимать ответ —
          // фиксит обрыв стрима на edge кастомного домена nazranka.ru,
          // когда Vercel пытается gzip-стримить большой RSC-ответ.
          { key: 'Cache-Control', value: 'no-transform, public, max-age=0, must-revalidate' },
          { key: 'X-Accel-Buffering', value: 'no' },
        ],
      },
      // Дополнительная защита для админки
      {
        source: '/nz-cp-8f3k/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      {
        source: '/auth/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ]
  },
};

export default nextConfig;
