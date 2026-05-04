import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteCategory } from './actions'
import styles from '@/components/admin/admin.module.css'

export default async function CategoriesListPage() {
  const supabase = await createSupabaseServerClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name, order')
    .order('order', { ascending: true })

  return (
    <>
      <div className={styles.actionRow} style={{ justifyContent: 'space-between', display: 'flex' }}>
        <h1 className={styles.heading}>Categories</h1>
        <Link href="/admin/categories/new" className={styles.btn}>
          新規作成
        </Link>
      </div>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>表示名</th>
              <th>slug</th>
              <th>順序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.order}</td>
                <td>
                  <div className={styles.actionRow}>
                    <Link
                      href={`/admin/categories/${c.id}`}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      編集
                    </Link>
                    <DeleteButton
                      action={async () => {
                        'use server'
                        await deleteCategory(c.id)
                      }}
                      confirmMessage={`カテゴリ「${c.name}」を削除しますか？\n（紐づく Works も削除される可能性があります）`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
