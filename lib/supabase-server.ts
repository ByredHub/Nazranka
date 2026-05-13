import { createServerClient as createServerSupabaseClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Клиент для сервера (Server Components, Server Actions, Route Handlers)
// Использует anon key + cookies для аутентификации через RLS
// SECURITY: НЕ использует service_role_key — все запросы проходят через RLS
export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Вызывается из Server Component — cookies read-only
          }
        },
      },
    }
  )
}
