'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="admin-login-form">
      <h1>管理者ログイン</h1>
      <label>
        メールアドレス
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label>
        パスワード
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      {error && <div className="form-error" role="alert">{error}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'ログイン中…' : 'ログイン'}
      </button>
    </form>
  )
}
