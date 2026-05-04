import { notFound } from 'next/navigation'
import WorkForm from '@/components/admin/WorkForm'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updateWork } from '../actions'
import styles from '@/components/admin/admin.module.css'

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const [{ data: work }, { data: categories }] = await Promise.all([
    supabase.from('works').select('*').eq('id', id).single(),
    supabase
      .from('categories')
      .select('id, name, order')
      .order('order', { ascending: true }),
  ])

  if (!work) notFound()

  async function action(formData: FormData) {
    'use server'
    await updateWork(id, formData)
  }

  return (
    <>
      <h1 className={styles.heading}>Works を編集: {work.title}</h1>
      <div className={styles.card}>
        <WorkForm
          action={action}
          categories={(categories ?? []).map((c) => ({ id: c.id, name: c.name }))}
          submitLabel="更新"
          initial={{
            category_id: work.category_id,
            slug: work.slug,
            number: work.number,
            title: work.title,
            description: work.description ?? '',
            detail: work.detail ?? '',
            tags: work.tags ?? [],
            color: work.color ?? '#000000',
            order: work.order ?? 0,
            published: work.published,
            thumbnail_url: work.thumbnail_url,
          }}
        />
      </div>
    </>
  )
}
