'use client'

import { usePathname } from 'next/navigation'
import AdminNav from './AdminNav'
import styles from './admin.module.css'

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return <main className={styles.main}>{children}</main>
  }

  return (
    <div className={styles.shell}>
      <AdminNav />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
