import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const revalidate = 600

export async function generateStaticParams() {
  const { data: categories } = await supabase.from('categories').select('slug')
  return (categories ?? []).map(c => ({ 'category-slug': c.slug }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ 'category-slug': string }>
}) {
  const { 'category-slug': categorySlug } = await params

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single()

  if (!category) notFound()

  const { data: works } = await supabase
    .from('works')
    .select('*')
    .eq('category_id', category.id)
    .eq('published', true)
    .order('order')

  return (
    <main>
      <div className="wrap" style={{ paddingTop: '8rem' }}>
        <p>
          <Link href="/works">← Works</Link>
        </p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <ul>
          {(works ?? []).map(w => (
            <li key={w.id}>
              <Link href={`/works/${categorySlug}/${w.slug}`}>
                {w.number ? `${w.number}. ` : ''}
                {w.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
