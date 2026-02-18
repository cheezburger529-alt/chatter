import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-900 text-slate-100">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link className="mt-4 text-brand-500" to="/">
        Return home
      </Link>
    </div>
  )
}
