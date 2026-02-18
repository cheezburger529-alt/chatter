import { useQuery } from '@tanstack/react-query'
import { fetchChannels, fetchServers } from './serverApi'

export function useServers() {
  return useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const { data, error } = await fetchServers()
      if (error) throw error
      return data ?? []
    },
  })
}

export function useChannels(serverId?: string) {
  return useQuery({
    queryKey: ['channels', serverId],
    queryFn: async () => {
      if (!serverId) return []
      const { data, error } = await fetchChannels(serverId)
      if (error) throw error
      return data ?? []
    },
    enabled: Boolean(serverId),
  })
}
