import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import JsonLd from '@/components/JsonLd'
import { BASE_URL } from '@/lib/structuredData'

export const revalidate = 600

type WorkDetail = {
  slug: string
  number: string
  title: string
  description: string
  detail: string
  tags: string[]
  thumbnail_url: string | null
  created_at: string
  category: { slug: string; name: string }
}

// generateMetadata とページ本体で共有し、リクエストあたりのクエリを1回に抑える
const getWork = cache(async (slug: string): Promise<WorkDetail | null> => {
  const { data } = await supabase
    .from('works')
    .select(
      'slug, number, title, description, detail, tags, thumbnail_url, created_at, category:categories(slug, name)',
    )
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return (data as unknown as WorkDetail) ?? null
})

const toAbsolute = (u: string) =>
  u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`

export async function generateStaticParams() {
  const { data: works } = await supabase
    .from('works')
    .select('slug, category:categories(slug)')
    .eq('published', true)

  const list = (works ?? []) as unknown as Array<{
    slug: string
    category: { slug: string }
  }>
  return list.map((w) => ({
    'category-slug': w.category.slug,
    slug: w.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'category-slug': string; slug: string }>
}): Promise<Metadata> {
  const { 'category-slug': categorySlug, slug } = await params
  const work = await getWork(slug)
  if (!work || work.category.slug !== categorySlug) {
    return { title: '実績が見つかりません' }
  }

  const url = `${BASE_URL}/works/${work.category.slug}/${work.slug}`
  const title = `${work.title} — ${work.category.name}`
  const description =
    work.description || `${work.title}｜craft.（道地志門）の制作事例`
  const ogImage = work.thumbnail_url || '/assets/craft-banner.png'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ 'category-slug': string; slug: string }>
}) {
  const { 'category-slug': categorySlug, slug } = await params

  const work = await getWork(slug)
  if (!work) notFound()
  if (work.category.slug !== categorySlug) notFound()

  const url = `${BASE_URL}/works/${work.category.slug}/${work.slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Works', item: `${BASE_URL}/works` },
      {
        '@type': 'ListItem',
        position: 3,
        name: work.category.name,
        item: `${BASE_URL}/works/${work.category.slug}`,
      },
      { '@type': 'ListItem', position: 4, name: work.title, item: url },
    ],
  }

  const workLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': url,
    url,
    name: work.title,
    ...(work.description ? { description: work.description } : {}),
    ...(work.thumbnail_url ? { image: toAbsolute(work.thumbnail_url) } : {}),
    ...(Array.isArray(work.tags) && work.tags.length > 0
      ? { keywords: work.tags.join(', ') }
      : {}),
    dateCreated: work.created_at,
    inLanguage: 'ja',
    author: { '@id': `${BASE_URL}/#person` },
    creator: { '@id': `${BASE_URL}/#person` },
    isPartOf: { '@id': `${BASE_URL}/#website` },
  }

  return (
    <main>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={workLd} />
      <div className="wrap work-detail">
        <nav className="breadcrumb" aria-label="パンくずリスト">
          <Link href="/">ホーム</Link>
          <span className="breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <Link href="/works">Works</Link>
          <span className="breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <Link href={`/works/${work.category.slug}`}>{work.category.name}</Link>
          <span className="breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span aria-current="page">{work.title}</span>
        </nav>

        <h1>{work.title}</h1>
        {work.description && <p className="work-lead">{work.description}</p>}
        {Array.isArray(work.tags) && work.tags.length > 0 && (
          <div className="work-tags">
            {work.tags.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>
        )}
        {work.detail && <div className="work-body">{work.detail}</div>}
      </div>
    </main>
  )
}
