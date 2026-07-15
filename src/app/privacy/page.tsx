import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description:
    'craft.（道地志門）のプライバシーポリシー。お問い合わせフォームで取得する個人情報の利用目的・管理方針について。',
  robots: { index: false, follow: true },
}

const SECTIONS: { h: string; body: ReactNode }[] = [
  {
    h: '1. 事業者情報',
    body: (
      <>
        屋号：craft.（運営者：道地 志門）<br />
        所在地：鹿児島県<br />
        連絡先：
        <a href="mailto:hello@shimon-dev.com" style={{ color: 'var(--violet)', textDecoration: 'underline' }}>
          hello@shimon-dev.com
        </a>
      </>
    ),
  },
  {
    h: '2. 取得する情報',
    body: (
      <>
        お問い合わせフォームの送信時に、お名前・メールアドレス・会社名／屋号（任意）・用件カテゴリ・お問い合わせ内容を取得します。
        あわせて、スパム送信を防止する目的で Cloudflare Turnstile を利用します。
      </>
    ),
  },
  {
    h: '3. 利用目的',
    body: <>取得した個人情報は、お問い合わせへの返信およびご相談への対応のためにのみ利用し、それ以外の目的には利用しません。</>,
  },
  {
    h: '4. 第三者への提供',
    body: (
      <>
        法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
        なお、メールの送受信のために外部サービス（Resend 等）を利用しており、この範囲で情報を取り扱います。
      </>
    ),
  },
  {
    h: '5. 保管期間',
    body: <>お問い合わせへの対応が完了し、必要な期間を経過したのち、取得した個人情報は適切に削除します。</>,
  },
  {
    h: '6. 開示・訂正・削除のご請求',
    body: <>ご本人からの個人情報の開示・訂正・削除のご請求には、上記の連絡先までご連絡いただくことで速やかに対応します。</>,
  },
  {
    h: '7. 本ポリシーの改定',
    body: <>本ポリシーの内容は、法令の変更や運営上の必要に応じて、予告なく変更する場合があります。</>,
  },
]

export default function PrivacyPage() {
  return (
    <main>
      <div className="wrap" style={{ maxWidth: 780, padding: '140px 24px 100px' }}>
        <div className="section-head">
          <div className="num">[ PRIVACY ]</div>
          <h2>
            Privacy <em>policy.</em>
          </h2>
        </div>

        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9, marginBottom: 48 }}>
          craft.（道地 志門、以下「当方」）は、お問い合わせフォーム等を通じて取得する個人情報を、以下の方針に基づいて適切に取り扱います。
        </p>

        {SECTIONS.map((s) => (
          <section key={s.h} style={{ marginBottom: 32 }}>
            <h3
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {s.h}
            </h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.9 }}>{s.body}</p>
          </section>
        ))}

        <p
          style={{
            marginTop: 48,
            fontFamily: 'var(--font-jetbrains), var(--font-noto), monospace',
            fontSize: 12,
            letterSpacing: '0.1em',
            color: 'var(--ink-soft)',
          }}
        >
          制定日：2026年7月12日
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: 24,
            fontFamily: 'var(--font-bricolage), sans-serif',
            fontWeight: 700,
            color: 'var(--violet)',
          }}
        >
          ← トップへ戻る
        </Link>
      </div>
    </main>
  )
}
