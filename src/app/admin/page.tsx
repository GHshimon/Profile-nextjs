import { createSupabaseServerClient } from '@/lib/supabase-server'
import styles from '@/components/admin/admin.module.css'

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient()
  const [{ count: worksCount }, { count: publishedCount }, { count: catCount }] =
    await Promise.all([
      supabase.from('works').select('*', { count: 'exact', head: true }),
      supabase
        .from('works')
        .select('*', { count: 'exact', head: true })
        .eq('published', true),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ])

  return (
    <>
      <h1 className={styles.heading}>ダッシュボード</h1>
      <div className={styles.statGrid}>
        <div className={styles.card}>
          <div className={styles.statValue}>{worksCount ?? 0}</div>
          <div className={styles.statLabel}>Works 総数</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statValue}>{publishedCount ?? 0}</div>
          <div className={styles.statLabel}>公開中の Works</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statValue}>{catCount ?? 0}</div>
          <div className={styles.statLabel}>Categories 数</div>
        </div>
      </div>
    </>
  )
}
