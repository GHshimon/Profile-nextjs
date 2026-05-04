import LoginForm from './LoginForm'

export const metadata = {
  title: '管理者ログイン',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <main className="admin-login-page">
      <LoginForm />
    </main>
  )
}
