import { useParams } from 'react-router-dom'
import { MessageComposer } from '../../features/messages/MessageComposer'
import { MessageList } from '../../features/messages/MessageList'

export function ServerView() {
  const { channelId } = useParams()

  return (
    <div className="flex h-full flex-1 flex-col">
      <MessageList channelId={channelId} />
      <MessageComposer channelId={channelId} />
    </div>
  )
}
