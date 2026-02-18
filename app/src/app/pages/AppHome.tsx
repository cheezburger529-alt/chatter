import { useState } from 'react'
import { MessageSquare, Search, Settings } from 'lucide-react'
import { usePanelStore } from '../../state/uiStore'
import { MessageComposer } from '../../features/messages/MessageComposer'
import { MessageList } from '../../features/messages/MessageList'

export function AppHome() {
  const { toggleMembers, toggleChannels } = usePanelStore()
  const [activeChannelId] = useState<string | undefined>(undefined)

  return (
    <div className="flex h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-white/5 bg-base-850/70 px-6 py-4">
        <div>
          <p className="text-sm text-slate-400">Server</p>
          <h2 className="text-lg font-semibold text-white">Chatter Launchpad</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white"
            onClick={toggleChannels}
            aria-label="Toggle channels"
          >
            <MessageSquare size={18} />
          </button>
          <button
            className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white"
            onClick={toggleMembers}
            aria-label="Toggle members"
          >
            <Search size={18} />
          </button>
          <button className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white" aria-label="Settings">
            <Settings size={18} />
          </button>
        </div>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden">
        <MessageList channelId={activeChannelId} />
        <MessageComposer channelId={activeChannelId} />
      </div>
    </div>
  )
}
