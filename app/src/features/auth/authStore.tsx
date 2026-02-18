import { create } from 'zustand'
import { supabase } from '../../lib/supabase'
import type { UserProfile } from '../../types'

type AuthState = {
  isLoading: boolean
  user: UserProfile | null
  sessionUserId: string | null
  setUser: (user: UserProfile | null) => void
  setLoading: (value: boolean) => void
  hydrate: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  user: null,
  sessionUserId: null,
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),
  hydrate: async () => {
    set({ isLoading: true })
    const { data } = await supabase.auth.getSession()
    set({ sessionUserId: data.session?.user?.id ?? null })
    if (!data.session?.user?.id) {
      set({ user: null, isLoading: false })
      return
    }
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.session.user.id).single()
    set({ user: profile ?? null, isLoading: false })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, sessionUserId: null })
  },
}))
