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

const BASE_URL = 'https://shimon-dev.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SHIMON DOUCHI — Web Engineer / Branding × UI/UX',
    template: '%s | SHIMON DOUCHI',
  },
  description:
    'ブランディング × UI/UX を軸に、スタートアップの「最初の一歩」をデザインとコードの両方からつくるフリーランスエンジニア。Web制作・DX・AI導入のご相談はお気軽に。',
  keywords: ['Web制作', 'フリーランス', 'UI/UX', 'ブランディング', 'Next.js', 'AI導入', 'DX', '道地志門'],
  authors: [{ name: 'Shimon Douchi', url: BASE_URL }],
  creator: 'Shimon Douchi',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: BASE_URL,
    siteName: 'SHIMON DOUCHI',
    title: 'SHIMON DOUCHI — Web Engineer / Branding × UI/UX',
    description:
      'ブランディング × UI/UX を軸に、スタートアップの「最初の一歩」をデザインとコードの両方からつくるフリーランスエンジニア。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SHIMON DOUCHI — Web Engineer / Branding × UI/UX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shimon_dev',
    creator: '@shimon_dev',
    title: 'SHIMON DOUCHI — Web Engineer / Branding × UI/UX',
    description:
      'ブランディング × UI/UX を軸に、スタートアップの「最初の一歩」をデザインとコードの両方からつくるフリーランスエンジニア。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
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
