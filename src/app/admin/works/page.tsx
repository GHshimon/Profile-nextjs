import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteWork } from './actions'
import styles from '@/components/admin/admin.module.css'

export default async function WorksListPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: categories }, { data: works }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, slug, name, order')
      .order('order', { ascending: true }),
    supabase
      .from('works')
      .select('id, category_id, number, title, slug, order, published')
      .order('order', { ascending: true }),
  ])

  const cats = categories ?? []
  const allWorks = works ?? []

  return (
    <>
      <h1 className={styles.heading}>Works</h1>
      {cats.map((cat) => {
        const items = allWorks.filter((w) => w.category_id === cat.id)
        return (
          <section key={cat.id}>
            <div className={styles.groupHeader}>
              <span>📁 {cat.name}</span>
              <Link
                href={`/admin/works/new?category=${cat.id}`}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                このカテゴリに新規追加
              </Link>
            </div>
            <div className={styles.card}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>番号</th>
                    <th>タイトル</th>
                    <th>状態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ color: '#6b7280' }}>このカテゴリには Works がありません。</td>
                    </tr>
                  )}
                  {items.map((w) => (
                    <tr key={w.id}>
                      <td>{w.number}</td>
                      <td>{w.title}</td>
                      <td>{w.published ? '公開' : '非公開'}</td>
                      <td>
                        <div className={styles.actionRow}>
                          <Link
                            href={`/admin/works/${w.id}`}
                            className={`${styles.btn} ${styles.btnSecondary}`}
                          >
                            編集
                          </Link>
                          <DeleteButton
                            action={async () => {
                              'use server'
                              await deleteWork(w.id)
                            }}
                            confirmMessage={`Works「${w.title}」を削除しますか？`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </>
  )
}
