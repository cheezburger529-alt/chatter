-- Storage policies for attachments bucket
-- Create bucket in Supabase UI named: attachments

-- Allow authenticated users to upload to attachments
create policy "Users can upload attachments" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'attachments');

-- Allow authenticated users to read attachments
create policy "Users can read attachments" on storage.objects
  for select to authenticated
  using (bucket_id = 'attachments');
