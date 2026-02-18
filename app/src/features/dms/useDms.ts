import { useQuery } from '@tanstack/react-query'
import { fetchDmThreads } from './dmApi'

export function useDmThreads(userId?: string | null) {
  return useQuery({
    queryKey: ['dmThreads', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await fetchDmThreads(userId)
      if (error) throw error
      return data ?? []
    },
    enabled: Boolean(userId),
  })
}
