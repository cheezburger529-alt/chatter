import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login, loginWithGithub } from '../../features/auth/authApi'

export function Login() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/app'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const { error: authError } = await login({ email, password })
    if (authError) {
      setError(authError.message)
    } else {
      navigate(from, { replace: true })
    }
    setLoading(false)
  }

  async function handleGithub() {
    setLoading(true)
    await loginWithGithub()
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
        <p className="text-sm text-slate-300">Sign in to rejoin your servers.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-200">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm text-slate-100"
            placeholder="you@chatter.app"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm text-slate-100"
            placeholder="••••••••"
          />
        </label>
        {error ? <p className="text-sm text-amber-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-base-900"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <button
        type="button"
        onClick={handleGithub}
        className="w-full rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100"
      >
        Continue with GitHub
      </button>
      <p className="text-sm text-slate-300">
        New here?{' '}
        <Link className="text-brand-500" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  )
}
