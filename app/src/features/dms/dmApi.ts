import { supabase } from '../../lib/supabase'

export async function fetchDmThreads(userId: string) {
  return supabase
    .from('dm_threads')
    .select('*, dm_members!inner(user_id)')
    .eq('dm_members.user_id', userId)
    .order('created_at', { ascending: false })
}

export async function createDmThread(memberIds: string[]) {
  const { data: thread, error } = await supabase.from('dm_threads').insert({ is_group: memberIds.length > 2 }).select('*').single()
  if (error) throw error
  await supabase.from('dm_members').insert(memberIds.map((id) => ({ thread_id: thread.id, user_id: id })))
  return thread
}
