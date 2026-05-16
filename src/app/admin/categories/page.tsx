import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import CategoriesListClient from '@/components/admin/CategoriesListClient'
import styles from '@/components/admin/admin.module.css'

export default async function CategoriesListPage() {
  const supabase = await createSupabaseServerClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name, order')
    .order('order', { ascending: true })

  return (
    <>
      <div
        className={styles.actionRow}
        style={{ justifyContent: 'space-between', display: 'flex' }}
      >
        <h1 className={styles.heading}>Categories</h1>
        <Link href="/admin/categories/new" className={styles.btn}>
          新規作成
        </Link>
      </div>
      <div className={styles.card}>
        <CategoriesListClient categories={categories ?? []} />
      </div>
    </>
  )
}
