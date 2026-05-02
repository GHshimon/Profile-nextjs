import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://shimon-dev.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const { data: works } = await supabase
    .from('works')
    .select('slug, category:categories(slug), created_at')
    .eq('published', true)

  const categoryRoutes = (categories ?? []).map((c) => ({
    url: `${BASE_URL}/works/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
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
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...categoryRoutes,
    ...workRoutes,
  ]
}
