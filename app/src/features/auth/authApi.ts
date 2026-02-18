import { z } from 'zod'
import { supabase } from '../../lib/supabase'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  username: z.string().min(2),
})

export async function login(values: z.infer<typeof loginSchema>) {
  return supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })
}

export async function register(values: z.infer<typeof registerSchema>) {
  return supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        display_name: values.displayName,
        username: values.username,
      },
    },
  })
}

export async function loginWithGithub() {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}
