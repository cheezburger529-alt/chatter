import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../features/auth/authApi'

export function Register() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const displayName = String(formData.get('displayName'))
    const username = String(formData.get('username'))
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    const { error: authError } = await register({ displayName, username, email, password })
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/app', { replace: true })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Create your account</h2>
        <p className="text-sm text-slate-300">Start with a fresh identity.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-200">
          Display name
          <input
            name="displayName"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Nova"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Username
          <input
            name="username"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm text-slate-100"
            placeholder="nova"
          />
        </label>
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
            minLength={8}
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
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="text-brand-500" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}
