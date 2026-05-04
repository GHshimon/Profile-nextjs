'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReveal() {
  const pathname = usePathname()
  const skip = pathname?.startsWith('/admin') ?? false

  useEffect(() => {
    if (skip) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [skip])

  return null
}
