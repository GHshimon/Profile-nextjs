'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'

export default function Hero() {
  const decoRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const factors = [0.08, -0.06, 0.1]
      decoRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${y * factors[i]}px)`
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className={styles.hero} id="hero">
      <div
        className={`${styles.deco} ${styles.s1}`}
        ref={el => { decoRefs.current[0] = el }}
      >
        <svg viewBox="0 0 200 200">
          <path
            fill="oklch(0.62 0.22 295)"
            d="M40,-60C52,-50,62,-38,68,-23C73,-7,73,12,67,29C61,46,49,62,33,68C18,75,-1,72,-19,66C-37,60,-54,52,-65,37C-76,22,-80,1,-76,-18C-72,-37,-60,-53,-44,-62C-29,-71,-9,-73,7,-77C24,-81,40,-82,40,-60Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div
        className={`${styles.deco} ${styles.s2}`}
        ref={el => { decoRefs.current[1] = el }}
      >
        <svg viewBox="0 0 200 200">
          <path
            fill="oklch(0.92 0.22 128)"
            stroke="#14110F"
            strokeWidth="3"
            d="M44,-58C56,-46,63,-30,67,-13C70,5,71,23,62,36C53,49,35,55,17,60C-2,65,-23,67,-39,59C-55,51,-67,32,-69,12C-71,-7,-63,-29,-49,-43C-35,-58,-15,-65,2,-67C18,-69,32,-69,44,-58Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div
        className={`${styles.deco} ${styles.s3}`}
        ref={el => { decoRefs.current[2] = el }}
      >
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="60" fill="oklch(0.74 0.22 12)" />
          <circle
            cx="100" cy="100" r="60"
            fill="none" stroke="#14110F" strokeWidth="3" strokeDasharray="4 8"
          />
        </svg>
      </div>

      <div className="wrap">
        <div className={styles.heroGrid}>
          <div>
            <div className="eyebrow reveal">
              <span className="pulse"></span> Available for new projects · 2026
            </div>
            <h1 className="reveal d1">
              Hello,<br />
              I&apos;m <span className={styles.it}>shimon.</span><br />
              <span className={styles.stamp}>Web Engineer</span>
            </h1>
            <div className={`${styles.nameJp} reveal d2`}>
              道地 志門 / DOUCHI SHIMON — フリーエンジニア
            </div>
            <p className={`${styles.lede} reveal d3`}>
              ブランディング × UI/UX を軸に、<br />
              スタートアップの「最初の一歩」を<br />
              デザインとコードの両方からつくるフリーランス（副業）。
            </p>
            <div className={`${styles.heroMeta} reveal d4`}>
              <div><b>BASED IN</b>Kagoshima JP</div>
              <div><b>EXPERIENCE</b>1 yr</div>
              <div><b>FOCUS</b>App Dev · DX</div>
              <div><b>STATUS</b><span style={{ color: 'var(--violet)' }}>●</span> Available</div>
            </div>
          </div>

          <div className={`${styles.portraitStage} reveal d2`}>
            <div className={styles.portraitBlob}></div>
            <div className={styles.portraitPhoto}>
              <Image
                src="/assets/avatar.jpg"
                alt="道地志門"
                className={styles.portraitImg}
                width={400}
                height={500}
                priority
              />
            </div>
            <div className={styles.portraitTag}>
              <b>9 YRS</b> ENGINEERING
            </div>
            <div className={styles.portraitBadge}>
              BRANDING<br />×<br />UI/UX
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
