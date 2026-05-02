'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

type Category = 'Web制作' | 'DX相談' | 'AI導入' | 'その他'

type FormState = {
  name: string
  email: string
  company: string
  category: Category | ''
  message: string
  consent: boolean
}

const initialForm: FormState = {
  name: '',
  email: '',
  company: '',
  category: '',
  message: '',
  consent: false,
}

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<
    { kind: 'idle' } | { kind: 'success'; message: string } | { kind: 'error'; message: string }
  >({ kind: 'idle' })

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'お名前を入力してください。'
    if (!form.email.trim()) return 'メールアドレスを入力してください。'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'メールアドレスの形式が正しくありません。'
    if (!form.category) return '用件カテゴリを選択してください。'
    if (form.message.trim().length < 20) return 'お問い合わせ内容は20文字以上で入力してください。'
    if (!form.consent) return 'プライバシーポリシーへの同意が必要です。'
    if (!turnstileToken) return 'セキュリティ確認(Turnstile)を完了してください。'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) {
      setResult({ kind: 'error', message: err })
      return
    }
    setSubmitting(true)
    setResult({ kind: 'idle' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      const data: { ok: boolean; message?: string } = await res
        .json()
        .catch(() => ({ ok: false, message: 'サーバーからの応答を解釈できませんでした。' }))

      if (res.ok && data.ok) {
        setForm(initialForm)
        setTurnstileToken('')
        setResult({
          kind: 'success',
          message: '送信ありがとうございました。返信は通常1〜2営業日以内です。',
        })
      } else {
        setResult({
          kind: 'error',
          message: data.message || '送信に失敗しました。時間をおいて再度お試しください。',
        })
      }
    } catch {
      setResult({
        kind: 'error',
        message: 'ネットワークエラーが発生しました。接続を確認してください。',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="deco s1" style={{ top: '10%', left: '6%', right: 'auto' }}>
        <svg viewBox="0 0 200 200">
          <path
            fill="oklch(0.92 0.22 128)"
            d="M44,-60C56,-48,62,-32,66,-15C70,2,72,21,63,34C53,47,33,55,15,60C-3,65,-19,67,-35,60C-51,53,-66,38,-71,20C-76,1,-71,-21,-60,-37C-49,-53,-31,-63,-13,-67C5,-72,23,-71,44,-60Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="deco s2" style={{ top: '20%', bottom: 'auto', right: '8%', left: 'auto' }}>
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="55" fill="oklch(0.62 0.22 295)" />
        </svg>
      </div>

      <div className="wrap">
        <h2 className="reveal">
          Let&apos;s <em>build</em><br />
          <span className="blk">something pop.</span>
        </h2>
        <p className="lead reveal d1">
          ブランディングのリブートも、新規プロダクトの立ち上げも。<br />
          まずは 30分のカジュアル相談から、お気軽にどうぞ。
        </p>

        <form className="contact-form reveal d2" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <label htmlFor="cf-name">名前 <span className="req">*</span></label>
            <input
              id="cf-name"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="row">
            <label htmlFor="cf-email">メールアドレス <span className="req">*</span></label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="row">
            <label htmlFor="cf-company">会社名</label>
            <input
              id="cf-company"
              type="text"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              autoComplete="organization"
            />
          </div>

          <div className="row">
            <label htmlFor="cf-category">用件カテゴリ <span className="req">*</span></label>
            <select
              id="cf-category"
              value={form.category}
              onChange={(e) => update('category', e.target.value as Category | '')}
              required
            >
              <option value="" disabled>選択してください</option>
              <option value="Web制作">Web制作</option>
              <option value="DX相談">DX相談</option>
              <option value="AI導入">AI導入</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div className="row">
            <label htmlFor="cf-message">内容 <span className="req">*</span> <span className="hint">（20文字以上）</span></label>
            <textarea
              id="cf-message"
              rows={5}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              required
              minLength={20}
            />
          </div>

          <div className="row checkbox-row">
            <input
              id="cf-consent"
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update('consent', e.target.checked)}
              required
            />
            <label htmlFor="cf-consent" className="inline">
              <a href="#" className="policy-link">プライバシーポリシー</a>に同意します <span className="req">*</span>
            </label>
          </div>

          <div className="row">
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken('')}
              onExpire={() => setTurnstileToken('')}
              options={{ theme: 'light' }}
            />
          </div>

          <button type="submit" className="submit" disabled={submitting}>
            {submitting ? '送信中…' : '送信する'}
          </button>

          {result.kind === 'success' && (
            <div className="form-result success" role="status">{result.message}</div>
          )}
          {result.kind === 'error' && (
            <div className="form-result error" role="alert">{result.message}</div>
          )}
        </form>

        <div className="contact-other reveal d3">
          <span className="other-label">他の連絡手段</span>
          <a href="mailto:hello@shimon-dev.com">✉ hello@shimon-dev.com</a>
          <a href="https://github.com/GHshimon" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://x.com/shimon_dev" target="_blank" rel="noopener noreferrer">
            𝕏 @shimon_dev
          </a>
        </div>

        <footer>
          <span>© 2026 SHIMON DOUCHI</span>
          <span>MADE WITH ☕ + ✦ IN TOKYO</span>
        </footer>
      </div>
    </section>
  )
}
