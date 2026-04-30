import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export default async function WorksPage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order')

  if (!categories) return null

  return (
    <main>
      <div className="wrap" style={{ paddingTop: '8rem' }}>
        <h1>Works</h1>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link href={`/works/${cat.slug}`}>
                {cat.name} — {cat.description}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
