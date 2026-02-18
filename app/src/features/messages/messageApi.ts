import { supabase } from '../../lib/supabase'

export async function fetchMessages(channelId?: string, threadId?: string) {
  return supabase
    .from('messages')
    .select('*, users:author_id (id, username, display_name, avatar_url, status)')
    .order('created_at', { ascending: false })
    .limit(50)
    .match({ ...(channelId ? { channel_id: channelId } : {}), ...(threadId ? { thread_id: threadId } : {}) })
}

export async function sendMessage(params: {
  channelId?: string
  threadId?: string
  authorId: string
  content: string
  replyToId?: string
}) {
  return supabase
    .from('messages')
    .insert({
      channel_id: params.channelId ?? null,
      thread_id: params.threadId ?? null,
      author_id: params.authorId,
      content: params.content,
      reply_to_id: params.replyToId ?? null,
    })
    .select('*')
    .single()
}

export function subscribeToMessages(channelId?: string, threadId?: string, onChange?: () => void) {
  const filter = channelId ? `channel_id=eq.${channelId}` : threadId ? `thread_id=eq.${threadId}` : undefined
  if (!filter) return null

  const channel = supabase
    .channel(`messages:${filter}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages', filter },
      () => onChange?.(),
    )
    .subscribe()

  return channel
}
