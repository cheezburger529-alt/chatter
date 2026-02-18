type QueuedMessage = {
  id: string
  channelId?: string
  threadId?: string
  authorId: string
  content: string
  createdAt: number
}

const storageKey = 'chatter:queue'

function loadQueue(): QueuedMessage[] {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return []
  try {
    return JSON.parse(raw) as QueuedMessage[]
  } catch {
    return []
  }
}

function saveQueue(queue: QueuedMessage[]) {
  localStorage.setItem(storageKey, JSON.stringify(queue))
}

export function enqueueMessage(message: Omit<QueuedMessage, 'id' | 'createdAt'>) {
  const queue = loadQueue()
  const item: QueuedMessage = {
    ...message,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  queue.push(item)
  saveQueue(queue)
  return item
}

export function dequeueAll() {
  const queue = loadQueue()
  saveQueue([])
  return queue
}

export function peekQueue() {
  return loadQueue()
}
