import { useEffect, useRef, useState } from 'react'
import { sendMessage } from './messageApi'
import { useAuthStore } from '../auth/authStore'
import { dequeueAll, enqueueMessage } from '../../lib/offlineQueue'
import { uploadAttachment } from '../files/uploadApi'

export function MessageComposer({
  channelId,
  threadId,
}: {
  channelId?: string
  threadId?: string
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [queuedCount, setQueuedCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    async function flushQueue() {
      if (!navigator.onLine || !user) return
      const queue = dequeueAll()
      if (!queue.length) return
      for (const item of queue) {
        await sendMessage({
          channelId: item.channelId,
          threadId: item.threadId,
          authorId: item.authorId,
          content: item.content,
        })
      }
      setQueuedCount(0)
    }

    const handler = () => {
      void flushQueue()
    }

    window.addEventListener('online', handler)
    void flushQueue()

    return () => window.removeEventListener('online', handler)
  }, [user])

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()
    if (!value.trim() || !user) return
    setError(null)

    if (!navigator.onLine) {
      enqueueMessage({
        channelId,
        threadId,
        authorId: user.id,
        content: value.trim(),
      })
      setQueuedCount((count) => count + 1)
      setValue('')
      return
    }

    const { error: sendError } = await sendMessage({
      channelId,
      threadId,
      authorId: user.id,
      content: value.trim(),
    })
    if (sendError) {
      setError(sendError.message)
      return
    }
    setValue('')
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const { url } = await uploadAttachment(file)
      await sendMessage({
        channelId,
        threadId,
        authorId: user.id,
        content: `${value}\n${url}`.trim(),
      })
      setValue('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSend} className="border-t border-white/5 px-6 py-4">
      <div className="flex items-center gap-3">
        <input
          className="w-full rounded-2xl border border-white/10 bg-base-850/80 px-4 py-3 text-sm text-slate-200"
          placeholder="Message"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-200"
        >
          {uploading ? 'Uploading…' : 'Attach'}
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-amber-400">{error}</p> : null}
      {queuedCount ? <p className="mt-2 text-xs text-slate-400">Queued: {queuedCount}</p> : null}
    </form>
  )
}
