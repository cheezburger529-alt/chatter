import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMessages, subscribeToMessages } from './messageApi'

export function useMessages(channelId?: string, threadId?: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const sub = subscribeToMessages(channelId, threadId, () => {
      void queryClient.invalidateQueries({ queryKey: ['messages', channelId, threadId] })
    })
    return () => {
      if (sub) {
        void sub.unsubscribe()
      }
    }
  }, [channelId, threadId, queryClient])

  return useQuery({
    queryKey: ['messages', channelId, threadId],
    queryFn: async () => {
      const { data, error } = await fetchMessages(channelId, threadId)
      if (error) throw error
      return data ?? []
    },
    enabled: Boolean(channelId || threadId),
  })
}
