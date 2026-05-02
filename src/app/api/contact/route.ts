import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

type Category = 'Web制作' | 'DX相談' | 'AI導入' | 'その他'
const VALID_CATEGORIES: Category[] = ['Web制作', 'DX相談', 'AI導入', 'その他']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// In-memory rate limit (per cold start instance)
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const ipHits = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - RATE_LIMIT_WINDOW_MS
  const hits = (ipHits.get(ip) ?? []).filter((t) => t > cutoff)
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits)
    return false
  }
  hits.push(now)
  ipHits.set(ip, hits)
  return true
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface ContactBody {
  name: string
  email: string
  company?: string
  category: Category
  message: string
  consent: boolean
  turnstileToken: string
}

function validateBody(raw: unknown): { ok: true; data: ContactBody } | { ok: false; message: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'リクエスト形式が正しくありません。' }
  }
  const b = raw as Record<string, unknown>

  const name = b.name
  if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100) {
    return { ok: false, message: 'お名前を1〜100文字で入力してください。' }
  }

  const email = b.email
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, message: 'メールアドレスの形式が正しくありません。' }
  }

  let company: string | undefined
  if (b.company !== undefined && b.company !== null && b.company !== '') {
    if (typeof b.company !== 'string' || b.company.length > 100) {
      return { ok: false, message: '会社名は100文字以内で入力してください。' }
    }
    company = b.company
  }

  const category = b.category
  if (typeof category !== 'string' || !VALID_CATEGORIES.includes(category as Category)) {
    return { ok: false, message: 'カテゴリの選択が正しくありません。' }
  }

  const message = b.message
  if (typeof message !== 'string' || message.length < 20 || message.length > 5000) {
    return { ok: false, message: 'お問い合わせ内容は20〜5000文字で入力してください。' }
  }

  if (b.consent !== true) {
    return { ok: false, message: 'プライバシーポリシーへの同意が必要です。' }
  }

  const turnstileToken = b.turnstileToken
  if (typeof turnstileToken !== 'string' || turnstileToken.length === 0) {
    return { ok: false, message: 'ボット検証トークンが見つかりません。' }
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      email: email.trim(),
      company,
      category: category as Category,
      message,
      consent: true,
      turnstileToken,
    },
  }
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('[contact] TURNSTILE_SECRET_KEY is not set; skipping verification (dev mode).')
    return true
  }
  try {
    const params = new URLSearchParams()
    params.set('secret', secret)
    params.set('response', token)
    if (ip && ip !== 'unknown') params.set('remoteip', ip)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const json = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (json.success !== true) {
      console.error('[contact] Turnstile verification failed:', json['error-codes'])
      return false
    }
    return true
  } catch (err) {
    console.error('[contact] Turnstile verification error:', err)
    return false
  }
}

function buildAdminEmail(data: ContactBody) {
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeCompany = data.company ? escapeHtml(data.company) : '（未入力）'
  const safeCategory = escapeHtml(data.category)
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>')

  const html = `<!doctype html>
<html lang="ja"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;background:#f6f7f9;padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#111;color:#fff;padding:16px 24px;font-size:14px;letter-spacing:0.05em;">SHIMON.D / NEW CONTACT</div>
    <div style="padding:24px;">
      <h1 style="margin:0 0 16px;font-size:18px;">[${safeCategory}] ${safeName} 様より</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#6b7280;width:120px;">お名前</td><td style="padding:8px 0;">${safeName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">メール</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">会社名</td><td style="padding:8px 0;">${safeCompany}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">カテゴリ</td><td style="padding:8px 0;">${safeCategory}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
      <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">お問い合わせ内容</div>
      <div style="font-size:14px;line-height:1.7;white-space:normal;">${safeMessage}</div>
    </div>
  </div>
</body></html>`

  const text = [
    `[Contact] ${data.category} - ${data.name}`,
    '',
    `お名前: ${data.name}`,
    `メール: ${data.email}`,
    `会社名: ${data.company ?? '（未入力）'}`,
    `カテゴリ: ${data.category}`,
    '',
    '------ お問い合わせ内容 ------',
    data.message,
    '------------------------------',
  ].join('\n')

  return { html, text }
}

function buildAutoReply(data: ContactBody) {
  const safeName = escapeHtml(data.name)
  const html = `<!doctype html>
<html lang="ja"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;line-height:1.7;padding:24px;">
  <p>${safeName} 様</p>
  <p>このたびはお問い合わせいただき、誠にありがとうございます。<br>内容を確認のうえ、1〜2営業日以内にご返信いたします。</p>
  <p>今しばらくお待ちくださいませ。</p>
  <p>— Shimon.D</p>
</body></html>`
  const text = `${data.name} 様

このたびはお問い合わせいただき、誠にありがとうございます。
内容を確認のうえ、1〜2営業日以内にご返信いたします。

— Shimon.D`
  return { html, text }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, message: '送信回数が多すぎます。しばらく時間をおいてください。' },
      { status: 429 },
    )
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, message: 'リクエスト形式が正しくありません。' },
      { status: 400 },
    )
  }

  const parsed = validateBody(raw)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, message: parsed.message }, { status: 400 })
  }
  const data = parsed.data

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip)
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, message: 'ボット検証に失敗しました。再度お試しください。' },
      { status: 400 },
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set.')
    return NextResponse.json(
      { ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 500 },
    )
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'hello@shimon-dev.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'hello@shimon-dev.com'

  const resend = new Resend(apiKey)
  const adminBody = buildAdminEmail(data)

  try {
    const { error } = await resend.emails.send({
      from: `Shimon.D Contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      subject: `[Contact] ${data.category} - ${data.name}`,
      html: adminBody.html,
      text: adminBody.text,
    })
    if (error) {
      console.error('[contact] Resend admin send error:', error)
      return NextResponse.json(
        { ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' },
        { status: 500 },
      )
    }
  } catch (err) {
    console.error('[contact] Resend admin send threw:', err)
    return NextResponse.json(
      { ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 500 },
    )
  }

  // Auto-reply (best-effort)
  try {
    const reply = buildAutoReply(data)
    const { error } = await resend.emails.send({
      from: `Shimon.D <${fromEmail}>`,
      to: [data.email],
      replyTo: toEmail,
      subject: 'お問い合わせを受け付けました - Shimon.D',
      html: reply.html,
      text: reply.text,
    })
    if (error) {
      console.error('[contact] Resend auto-reply error (ignored):', error)
    }
  } catch (err) {
    console.error('[contact] Auto-reply threw (ignored):', err)
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
