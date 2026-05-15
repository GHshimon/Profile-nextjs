'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

export default function Nav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <nav className={styles.nav}>
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
    </nav>
  )
}
