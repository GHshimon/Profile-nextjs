import type { Metadata } from 'next'
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
  Noto_Sans_JP,
} from 'next/font/google'
import Nav from '@/components/Nav/Nav'
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SHIMON DOUCHI — Web Engineer / Branding × UI/UX',
  description:
    'ブランディング × UI/UX を軸に、スタートアップの「最初の一歩」をデザインとコードの両方からつくるフリーランス。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ja"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${notoSansJP.variable}`}
    >
      <body>
        <Nav />
        {children}
        <ScrollReveal />
      </body>
    </html>
  )
}
