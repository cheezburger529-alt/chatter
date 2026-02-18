import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../features/auth/authStore'
import { createServer } from '../../features/servers/serverApi'
import { useChannels, useServers } from '../../features/servers/useServers'
import { useDmThreads } from '../../features/dms/useDms'
import { Brand } from '../components/Brand'
import { CommandPalette } from '../components/CommandPalette'
import { usePanelStore } from '../../state/uiStore'

export function AppShell() {
  const { showMembers, showChannels } = usePanelStore()
  const { data: servers = [] } = useServers()
  const activeServer = servers[0]
  const { data: channels = [] } = useChannels(activeServer?.id)
  const user = useAuthStore((state) => state.user)
  const { data: dmThreads = [] } = useDmThreads(user?.id)
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  async function handleCreateServer() {
    if (!user) return
    const name = window.prompt('Server name')
    if (!name) return
    const server = await createServer(name, user.id)
    const firstChannel = channels[0]
    if (firstChannel) {
      navigate(`/app/servers/${server.id}/channels/${firstChannel.id}`)
    } else {
      navigate('/app')
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (isCmdK) {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (event.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-base-900 text-slate-100">
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-20 flex-shrink-0 flex-col items-center gap-4 bg-base-850 py-6 md:flex">
          <div className="h-12 w-12 rounded-2xl bg-brand-600/90 shadow-glow" />
          {servers.map((server) => (
            <NavLink
              key={server.id}
              to={`/app/servers/${server.id}/channels/${channels[0]?.id ?? server.id}`}
              className="h-12 w-12 rounded-2xl bg-base-700"
            />
          ))}
          <button
            type="button"
            onClick={handleCreateServer}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-slate-200"
            aria-label="Create server"
          >
            <Plus size={18} />
          </button>
        </aside>
        <aside
          className={`hidden w-72 flex-shrink-0 flex-col gap-6 border-r border-white/5 bg-base-850/60 px-5 py-6 md:flex ${
            showChannels ? '' : 'md:hidden'
          }`}
        >
          <Brand />
          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Channels</p>
            {channels.map((channel) => (
              <NavLink
                key={channel.id}
                to={`/app/servers/${channel.server_id}/channels/${channel.id}`}
                className="block rounded-xl bg-base-700/70 p-3 text-slate-200"
              >
                # {channel.name}
              </NavLink>
            ))}
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Direct messages</p>
            {dmThreads.map((thread) => (
              <NavLink
                key={thread.id}
                to={`/app/dms/${thread.id}`}
                className="block rounded-xl bg-base-700/40 p-3 text-slate-200"
              >
                Thread {thread.id.slice(0, 6)}
              </NavLink>
            ))}
          </div>
          <div className="mt-auto rounded-2xl bg-base-700/40 p-4">
            <p className="text-sm text-slate-200">Your voice is your superpower.</p>
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </main>
        <aside
          className={`hidden w-72 flex-shrink-0 border-l border-white/5 bg-base-850/70 px-5 py-6 lg:block ${
            showMembers ? '' : 'lg:hidden'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Members</p>
          <div className="mt-4 space-y-3">
            {['Nova', 'Arden', 'Mira', 'Jun', 'Sage'].map((name) => (
              <div key={name} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-base-700" />
                <div>
                  <p className="text-sm text-slate-100">{name}</p>
                  <p className="text-xs text-slate-400">Online</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
