import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const revalidate = 600

export async function generateStaticParams() {
  const { data: works } = await supabase
    .from('works')
    .select('slug, category:categories(slug)')
    .eq('published', true)

  const list = (works ?? []) as unknown as Array<{
    slug: string
    category: { slug: string }
  }>
  return list.map(w => ({
    'category-slug': w.category.slug,
    slug: w.slug,
  }))
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ 'category-slug': string; slug: string }>
}) {
  const { 'category-slug': categorySlug, slug } = await params

  const { data: work } = await supabase
    .from('works')
    .select('*, category:categories(slug, name)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!work) notFound()

  const typedWork = work as unknown as {
    number: string
    title: string
    description: string
    detail: string
    tags: string[]
    category: { slug: string; name: string }
  }
  const category = typedWork.category
  if (category.slug !== categorySlug) notFound()

  return (
    <main>
      <div className="wrap" style={{ paddingTop: '8rem' }}>
        <p>
          <Link href={`/works/${categorySlug}`}>← {category.name}</Link>
        </p>
        <h1>
          {typedWork.number ? `${typedWork.number}. ` : ''}
          {typedWork.title}
        </h1>
        {typedWork.description && <p>{typedWork.description}</p>}
        {Array.isArray(typedWork.tags) && typedWork.tags.length > 0 && (
          <p>
            {typedWork.tags.map((tag: string) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </p>
        )}
        {typedWork.detail && <div>{typedWork.detail}</div>}
      </div>
    </main>
  )
}
