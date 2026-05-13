import { createPublicClient } from '@/lib/supabase-public'

export async function GET() {
  const supabase = createPublicClient()
  const baseUrl = 'https://nazranka.ru'

  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, lead, published_at, category:categories(slug, name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  const items = (articles || []).map((a) => {
    const cat = a.category as unknown as { slug: string; name: string } | null
    const catSlug = cat?.slug || 'politika'
    const catName = cat?.name || ''
    const pubDate = a.published_at ? new Date(a.published_at).toUTCString() : ''

    return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/${catSlug}/${a.slug}</link>
      <description><![CDATA[${a.lead || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${catName}</category>
      <guid isPermaLink="true">${baseUrl}/${catSlug}/${a.slug}</guid>
    </item>`
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>nazranka.ru — Новости Ингушетии</title>
    <link>${baseUrl}</link>
    <description>Новостной портал Ингушетии. Актуальные новости, культура, история.</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
