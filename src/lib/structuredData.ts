// サイト全体の構造化データ（JSON-LD）。
// このサイトは「著者ページそのもの」であるため、Person を中心に
// Organization / WebSite を @graph で相互参照する。
export const BASE_URL = 'https://shimon-dev.com'

const PERSON_ID = `${BASE_URL}/#person`
const ORG_ID = `${BASE_URL}/#org`
const WEBSITE_ID = `${BASE_URL}/#website`

// サイト共通（layout に埋め込む）
export const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: '道地 志門',
      alternateName: ['道地志門', 'どうち しもん', 'Douchi Shimon', 'Shimon Douchi'],
      image: `${BASE_URL}/assets/avatar.jpg`,
      url: BASE_URL,
      jobTitle: 'Webエンジニア（Web制作・DX推進・AI導入支援）',
      description:
        '製造業の現場に10年立つエンジニア。個人事業主・小規模事業者向けに、Web制作・DX推進・AI導入を複業で支援。',
      worksFor: { '@type': 'Organization', name: '株式会社アルバック' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: '大分大学' },
      knowsAbout: [
        'Web制作',
        'DX推進',
        'AI導入',
        '業務改善',
        'Next.js',
        'Python',
        '製造業の現場改善',
      ],
      address: {
        '@type': 'PostalAddress',
        addressRegion: '鹿児島県',
        addressCountry: 'JP',
      },
      email: 'mailto:hello@shimon-dev.com',
      sameAs: ['https://x.com/shimon_dev', 'https://github.com/GHshimon'],
    },
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'craft.',
      alternateName: ['craft', 'クラフト'],
      url: BASE_URL,
      logo: `${BASE_URL}/assets/craft-logo-transparent.png`,
      description:
        '個人事業主・中小企業のためのWeb制作・DX推進・AI導入。道地志門の屋号。',
      founder: { '@id': PERSON_ID },
      areaServed: 'JP',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: BASE_URL,
      name: 'craft.（道地志門）',
      inLanguage: 'ja',
      publisher: { '@id': PERSON_ID },
    },
  ],
}

// トップページ固有（page.tsx に埋め込む）
export const profilePageGraph = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: 'craft.（道地志門）— 個人事業主・中小企業のためのWeb制作 / DX / AI導入',
  inLanguage: 'ja',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': PERSON_ID },
  mainEntity: { '@id': PERSON_ID },
}
