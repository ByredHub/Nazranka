import { createClient } from '@supabase/supabase-js'

// Публичный клиент для server-side чтения (главная, категории, статьи).
// НЕ использует cookies() — это позволяет Next.js статически рендерить и
// ISR-revalidate страницы. Подходит для всех публичных запросов через anon-key
// (RLS пропускает чтение опубликованных материалов).
//
// Для админки и auth используется createServerClient из supabase-server.ts —
// он читает cookies для проверки сессии.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}
