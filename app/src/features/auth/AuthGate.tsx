import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './authStore'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, sessionUserId } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-slate-300">Loading…</div>
  }

  if (!sessionUserId) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
