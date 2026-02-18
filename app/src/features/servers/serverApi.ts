import { supabase } from '../../lib/supabase'

export async function fetchServers() {
  return supabase.from('servers').select('*').order('created_at')
}

export async function createServer(name: string, ownerId: string) {
  const { data, error } = await supabase
    .from('servers')
    .insert({ name, owner_id: ownerId })
    .select('*')
    .single()
  if (error) throw error

  await supabase.from('server_members').insert({ server_id: data.id, user_id: ownerId, role: 'admin' })
  await supabase.from('channels').insert({ server_id: data.id, name: 'lounge', type: 'text', position: 0 })

  return data
}

export async function fetchChannels(serverId: string) {
  return supabase.from('channels').select('*').eq('server_id', serverId).order('position')
}

export async function createChannel(serverId: string, name: string) {
  return supabase.from('channels').insert({ server_id: serverId, name, type: 'text' }).select('*').single()
}
