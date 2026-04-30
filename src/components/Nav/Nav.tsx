import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <span className={styles.dot}></span> SHIMON.D
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
