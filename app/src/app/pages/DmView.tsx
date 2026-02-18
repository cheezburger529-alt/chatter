import { useParams } from 'react-router-dom'
import { MessageComposer } from '../../features/messages/MessageComposer'
import { MessageList } from '../../features/messages/MessageList'

export function DmView() {
  const { threadId } = useParams()

  return (
    <div className="flex h-full flex-1 flex-col">
      <MessageList threadId={threadId} />
      <MessageComposer threadId={threadId} />
    </div>
  )
}
