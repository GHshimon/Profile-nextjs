import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import About from '@/components/About/About'
import Works from '@/components/Works/Works'
import Strengths from '@/components/Strengths/Strengths'
import Contact from '@/components/Contact/Contact'

export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Works limit={4} />
      <Strengths />
      <Contact />
    </>
  )
}
