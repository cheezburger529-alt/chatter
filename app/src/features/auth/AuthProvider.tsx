import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from './authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
    const { data } = supabase.auth.onAuthStateChange(() => {
      void hydrate()
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [hydrate])

  return <>{children}</>
}
