import { Virtuoso } from 'react-virtuoso'
import { renderMarkdown } from '../../lib/markdown'
import { useMessages } from './useMessages'

export function MessageList({ channelId, threadId }: { channelId?: string; threadId?: string }) {
  const { data = [], isLoading } = useMessages(channelId, threadId)

  if (isLoading) {
    return <div className="flex-1 px-6 py-6 text-slate-400">Loading messages…</div>
  }

  const items = [...data].reverse()

  return (
    <div className="flex-1 overflow-hidden">
      <Virtuoso
        data={items}
        itemContent={(_, item) => (
          <div className="flex gap-4 px-6 py-4">
            <div className="h-10 w-10 rounded-full bg-base-700" />
            <div>
              <p className="text-sm font-semibold text-white">{item.users?.display_name ?? 'Unknown'}</p>
              <div
                className="text-sm text-slate-300"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
              />
            </div>
          </div>
        )}
      />
    </div>
  )
}
