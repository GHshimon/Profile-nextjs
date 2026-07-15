'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './Nav.module.css'

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/works', label: 'Works' },
  { href: '/#strengths', label: 'Strengths' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // ルート遷移でメニューを閉じる
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // メニュー展開中は背面スクロールをロック
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <nav className={styles.nav} aria-label="メインナビゲーション">
        <div className={styles.brand}>
          <Image
            src="/assets/craft-logo-transparent.png"
            width={52}
            height={52}
            alt="craft."
            style={{ objectFit: 'contain' }}
          />
        </div>
        <ul>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/works">Works</Link></li>
          <li><Link href="/#strengths">Strengths</Link></li>
        </ul>
        <Link className={styles.cta} href="/#contact">Contact →</Link>
        <button
          type="button"
          className={styles.burger}
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerBar} ${open ? styles.burgerBarTop : ''}`} />
          <span className={`${styles.burgerBar} ${open ? styles.burgerBarMid : ''}`} />
          <span className={`${styles.burgerBar} ${open ? styles.burgerBarBot : ''}`} />
        </button>
      </nav>

      <div id="mobile-menu" className={styles.overlay} hidden={!open}>
        <ul className={styles.overlayLinks}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className={styles.overlayCta} href="/#contact" onClick={() => setOpen(false)}>
          Contact →
        </Link>
      </div>
    </>
  )
}
