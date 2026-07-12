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
    default: 'craft.（道地志門）— 個人事業主・中小企業のためのWeb制作 / DX / AI導入',
    template: '%s ｜ craft.',
  },
  description:
    '製造業の現場に10年立つエンジニアが、個人事業主・小規模事業者の業務改善を、Web制作・DX推進・AI導入で支援します。まずは30分のカジュアル相談から、お気軽にご相談ください。',
  keywords: ['Web制作', '個人事業主', '中小企業', 'DX推進', 'AI導入', '業務改善', '複業エンジニア', 'Next.js', '道地志門', 'craft', '鹿児島'],
  authors: [{ name: 'Shimon Douchi', url: BASE_URL }],
  creator: 'Shimon Douchi',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: BASE_URL,
    siteName: 'craft.（道地志門）',
    title: 'craft. — 個人事業主・中小企業のためのWeb制作 / DX / AI導入',
    description:
      '製造業の現場に10年。個人事業主・小規模事業者の「困った」を、Web制作・DX推進・AI導入で解決します。',
    images: [
      {
        url: '/assets/craft-banner.png',
        width: 1774,
        height: 887,
        alt: 'craft. — 個人事業主・中小企業のためのWeb制作・DX・AI導入（道地志門）',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shimon_dev',
    creator: '@shimon_dev',
    title: 'craft. — 個人事業主・中小企業のためのWeb制作 / DX / AI導入',
    description:
      '製造業の現場に10年。個人事業主・小規模事業者の「困った」を、Web制作・DX推進・AI導入で解決します。',
    images: ['/assets/craft-banner.png'],
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
