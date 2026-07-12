import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Works',
  description: '個人事業主・中小企業向けのWeb制作・DX推進・AI導入の制作事例。',
}

export default async function WorksPage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order')

  const hasCats = Boolean(categories && categories.length > 0)

  return (
    <main>
      <div className="wrap works-index">
        <div className="section-head">
          <div className="num">[ WORKS ]</div>
          <h2>
            Selected <em>works.</em>
          </h2>
        </div>

        {hasCats ? (
          <ul className="works-cat-list">
            {categories!.map((cat) => (
              <li key={cat.id}>
                <Link href={`/works/${cat.slug}`} className="works-cat">
                  <span className="works-cat-name">{cat.name}</span>
                  {cat.description ? (
                    <span className="works-cat-desc">{cat.description}</span>
                  ) : null}
                  <span className="works-cat-arr" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="works-empty">
            <p className="works-empty-lead">制作事例は現在準備中です。</p>
            <p className="works-empty-sub">
              個別の制作事例は、ご相談の中でお見せできます。<br />
              まずは30分のカジュアル相談から、お気軽にどうぞ。
            </p>
            <Link href="/#contact" className="works-empty-cta">
              相談してみる →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
