import { createSupabaseServerClient } from '@/lib/supabase-server'
import WorksListClient from '@/components/admin/WorksListClient'
import styles from '@/components/admin/admin.module.css'

export default async function WorksListPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: categories }, { data: works }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name')
      .order('order', { ascending: true }),
    supabase
      .from('works')
      .select('id, category_id, number, title, slug, order, published')
      .order('order', { ascending: true }),
  ])

  return (
    <>
      <h1 className={styles.heading}>Works</h1>
      <WorksListClient works={works ?? []} categories={categories ?? []} />
    </>
  )
}
