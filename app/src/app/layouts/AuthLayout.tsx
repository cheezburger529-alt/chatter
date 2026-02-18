import { Outlet } from 'react-router-dom'
import { Brand } from '../components/Brand'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-base-900 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <Brand />
          <h1 className="font-display text-4xl text-white md:text-5xl">
            Build communities that feel alive.
          </h1>
          <p className="text-lg text-slate-300">
            Chatter combines high-performance real-time messaging with accessible, offline-tolerant UX.
          </p>
        </div>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-base-850/70 p-8 shadow-glow">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
