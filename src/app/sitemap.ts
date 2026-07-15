import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://shimon-dev.com'

// トップ/一覧など「作品データに紐づかないページ」の最終更新日。
// 内容に意味のある更新を入れたら、ここを手で更新する（毎クロール "今日" と
// 誤申告しないため）。
const SITE_LAST_MODIFIED = new Date('2026-07-12T00:00:00+09:00')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const { data: works } = await supabase
    .from('works')
    .select('slug, category:categories(slug), created_at')
    .eq('published', true)

  // カテゴリごとの最終更新日 = 配下の公開作品の最新 created_at
  const catLatest = new Map<string, number>()
  const allWorkTimes: number[] = []
  for (const w of works ?? []) {
    const cat = (w.category as unknown as { slug: string }).slug
    const t = new Date(w.created_at).getTime()
    allWorkTimes.push(t)
    catLatest.set(cat, Math.max(catLatest.get(cat) ?? 0, t))
  }
  const latestWork = allWorkTimes.length
    ? new Date(Math.max(...allWorkTimes))
    : SITE_LAST_MODIFIED

  const categoryRoutes = (categories ?? []).map((c) => ({
    url: `${BASE_URL}/works/${c.slug}`,
    lastModified: catLatest.has(c.slug)
      ? new Date(catLatest.get(c.slug)!)
      : SITE_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const workRoutes = (works ?? []).map((w) => {
    const cat = w.category as unknown as { slug: string }
    return {
      url: `${BASE_URL}/works/${cat.slug}/${w.slug}`,
      lastModified: new Date(w.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  return [
    {
      url: BASE_URL,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/works`,
      lastModified: latestWork,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...categoryRoutes,
    ...workRoutes,
  ]
}
