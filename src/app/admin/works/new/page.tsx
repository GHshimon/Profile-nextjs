import WorkForm from '@/components/admin/WorkForm'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createWork } from '../actions'
import styles from '@/components/admin/admin.module.css'

export default async function NewWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createSupabaseServerClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, order')
    .order('order', { ascending: true })

  const initial = category
    ? {
        category_id: category,
        slug: '',
        number: '',
        title: '',
        description: '',
        detail: '',
        tags: [],
        color: '#000000',
        order: 0,
        published: false,
        thumbnail_url: null,
      }
    : undefined

  return (
    <>
      <h1 className={styles.heading}>Works を新規作成</h1>
      <div className={styles.card}>
        <WorkForm
          action={createWork}
          categories={(categories ?? []).map((c) => ({ id: c.id, name: c.name }))}
          initial={initial}
          submitLabel="作成"
        />
      </div>
    </>
  )
}
