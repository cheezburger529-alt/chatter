import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  display_name: z.string(),
  avatar_url: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  created_at: z.string(),
})

export const serverSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  owner_id: z.string().uuid(),
  icon_url: z.string().nullable().optional(),
  created_at: z.string(),
})

export const channelSchema = z.object({
  id: z.string().uuid(),
  server_id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['text', 'voice']),
  position: z.number(),
  created_at: z.string(),
})

export const messageSchema = z.object({
  id: z.string().uuid(),
  channel_id: z.string().uuid().nullable(),
  thread_id: z.string().uuid().nullable(),
  author_id: z.string().uuid(),
  content: z.string(),
  reply_to_id: z.string().uuid().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable().optional(),
})

export type UserProfile = z.infer<typeof userSchema>
export type Server = z.infer<typeof serverSchema>
export type Channel = z.infer<typeof channelSchema>
export type Message = z.infer<typeof messageSchema>
