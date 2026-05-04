'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminNav.module.css'

const items = [
  { href: '/admin', label: 'ダッシュボード' },
  { href: '/admin/works', label: 'Works' },
  { href: '/admin/categories', label: 'Categories' },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>SHIMON.D / ADMIN</div>
      {items.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${active ? styles.linkActive : ''}`}
          >
            {item.label}
          </Link>
        )
      })}
      <form action="/admin/logout" method="post">
        <button type="submit" className={styles.logout}>
          ログアウト
        </button>
      </form>
    </nav>
  )
}
