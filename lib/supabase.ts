import { createBrowserClient as createBrowserSupabaseClient } from '@supabase/ssr'

// Клиент для браузера (Client Components)
// Использует ТОЛЬКО anon key — безопасен на клиенте
export function createBrowserClient() {
  return createBrowserSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
