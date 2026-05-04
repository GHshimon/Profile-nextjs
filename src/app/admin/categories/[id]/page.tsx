import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updateCategory } from '../actions'
import styles from '@/components/admin/admin.module.css'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) notFound()

  async function action(formData: FormData) {
    'use server'
    await updateCategory(id, formData)
  }

  return (
    <>
      <h1 className={styles.heading}>カテゴリを編集: {category.name}</h1>
      <div className={styles.card}>
        <CategoryForm
          action={action}
          submitLabel="更新"
          initial={{
            slug: category.slug,
            name: category.name,
            description: category.description ?? '',
            order: category.order ?? 0,
          }}
        />
      </div>
    </>
  )
}
