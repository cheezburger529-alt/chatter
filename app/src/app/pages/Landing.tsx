import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-900 text-slate-100">
      <div className="text-center">
        <h1 className="font-display text-5xl">Chatter</h1>
        <p className="mt-3 text-slate-300">Discord-style collaboration with a human-first feel.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/login"
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-base-900"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-100"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
