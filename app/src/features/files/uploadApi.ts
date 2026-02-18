import { supabase } from '../../lib/supabase'

export async function uploadAttachment(file: File) {
  const path = `${crypto.randomUUID()}-${file.name}`
  const { data, error } = await supabase.storage.from('attachments').upload(path, file)
  if (error) throw error

  const { data: url } = supabase.storage.from('attachments').getPublicUrl(data.path)
  return { path: data.path, url: url.publicUrl }
}
