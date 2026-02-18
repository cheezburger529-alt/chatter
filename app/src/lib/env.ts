import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_NAME: z.string().default('Chatter'),
  VITE_APP_BASE_URL: z.string().url().optional(),
})

type Env = z.infer<typeof envSchema>

const rawEnv: Record<string, string | undefined> = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL,
}

const parsed = envSchema.safeParse(rawEnv)

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env: Env = parsed.data
