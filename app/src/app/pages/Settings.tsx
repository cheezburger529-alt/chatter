import { useState } from 'react'
import { useAuthStore } from '../../features/auth/authStore'
import { supabase } from '../../lib/supabase'

export function Settings() {
  const user = useAuthStore((state) => state.user)
  const hydrate = useAuthStore((state) => state.hydrate)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return <div className="flex h-full items-center justify-center text-slate-300">Loading…</div>
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const display_name = String(formData.get('displayName'))
    const status = String(formData.get('status'))

    const { error: updateError } = await supabase.from('users').update({ display_name, status }).eq('id', user.id)
    if (updateError) {
      setError(updateError.message)
    } else {
      await hydrate()
    }
    setLoading(false)
  }

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <h2 className="text-xl font-semibold text-white">Account settings</h2>
      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <label className="block text-sm text-slate-200">
          Display name
          <input
            name="displayName"
            defaultValue={user.display_name}
            className="mt-2 w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm text-slate-100"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Status
          <input
            name="status"
            defaultValue={user.status ?? ''}
            className="mt-2 w-full rounded-xl border border-white/10 bg-base-900 px-3 py-2 text-sm text-slate-100"
          />
        </label>
        {error ? <p className="text-sm text-amber-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-base-900"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
