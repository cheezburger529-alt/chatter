-- Chatter initial schema + RLS
create extension if not exists "pgcrypto";

-- Users (profile)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  status text,
  created_at timestamptz not null default now()
);

-- Servers (guilds)
create table if not exists public.servers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.users(id) on delete cascade,
  icon_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.server_members (
  server_id uuid not null references public.servers(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin','mod','member')),
  joined_at timestamptz not null default now(),
  primary key (server_id, user_id)
);

create table if not exists public.server_bans (
  server_id uuid not null references public.servers(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  banned_by uuid not null references public.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now(),
  primary key (server_id, user_id)
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references public.servers(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text','voice')),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.dm_threads (
  id uuid primary key default gen_random_uuid(),
  is_group boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.dm_members (
  thread_id uuid not null references public.dm_threads(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  primary key (thread_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.channels(id) on delete cascade,
  thread_id uuid references public.dm_threads(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  reply_to_id uuid references public.messages(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check ((channel_id is not null)::int + (thread_id is not null)::int = 1)
);

create table if not exists public.reactions (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  url text not null,
  mime text,
  size integer,
  created_at timestamptz not null default now()
);

create table if not exists public.reads (
  user_id uuid not null references public.users(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  last_read_message_id uuid references public.messages(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, channel_id)
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references public.servers(id) on delete cascade,
  code text unique not null,
  created_by uuid not null references public.users(id) on delete cascade,
  expires_at timestamptz,
  max_uses integer,
  uses integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  message_id uuid not null references public.messages(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

-- Helper functions
create or replace function public.is_server_member(p_server_id uuid, p_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.server_members sm
    where sm.server_id = p_server_id and sm.user_id = p_user_id
  );
$$;

create or replace function public.is_server_admin(p_server_id uuid, p_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.server_members sm
    where sm.server_id = p_server_id
      and sm.user_id = p_user_id
      and sm.role in ('admin','mod')
  ) or exists (
    select 1 from public.servers s
    where s.id = p_server_id and s.owner_id = p_user_id
  );
$$;

create or replace function public.can_read_message(p_message_id uuid, p_user_id uuid)
returns boolean
language sql
stable
as $$
  select case
    when m.channel_id is not null then public.is_server_member(c.server_id, p_user_id)
    when m.thread_id is not null then exists (
      select 1 from public.dm_members dm
      where dm.thread_id = m.thread_id and dm.user_id = p_user_id
    )
    else false
  end
  from public.messages m
  left join public.channels c on c.id = m.channel_id
  where m.id = p_message_id;
$$;

-- Join server via invite (security definer)
create or replace function public.join_server(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_server_id uuid;
  v_max_uses integer;
  v_uses integer;
  v_expires_at timestamptz;
begin
  select server_id, max_uses, uses, expires_at
    into v_server_id, v_max_uses, v_uses, v_expires_at
  from public.invites
  where code = p_code;

  if v_server_id is null then
    raise exception 'Invite not found';
  end if;

  if v_expires_at is not null and v_expires_at < now() then
    raise exception 'Invite expired';
  end if;

  if v_max_uses is not null and v_uses >= v_max_uses then
    raise exception 'Invite max uses reached';
  end if;

  insert into public.server_members (server_id, user_id, role)
  values (v_server_id, auth.uid(), 'member')
  on conflict do nothing;

  update public.invites
  set uses = uses + 1
  where code = p_code;

  return v_server_id;
end;
$$;

-- Auto-create user profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, username, display_name, avatar_url, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'online'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.servers enable row level security;
alter table public.server_members enable row level security;
alter table public.server_bans enable row level security;
alter table public.channels enable row level security;
alter table public.dm_threads enable row level security;
alter table public.dm_members enable row level security;
alter table public.messages enable row level security;
alter table public.reactions enable row level security;
alter table public.attachments enable row level security;
alter table public.reads enable row level security;
alter table public.invites enable row level security;
alter table public.reports enable row level security;

-- Users
create policy "Users can read" on public.users
  for select to authenticated
  using (true);

create policy "Users can update self" on public.users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Servers
create policy "Servers visible to members" on public.servers
  for select to authenticated
  using (public.is_server_member(id, auth.uid()));

create policy "Create server" on public.servers
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy "Update server as owner" on public.servers
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Delete server as owner" on public.servers
  for delete to authenticated
  using (owner_id = auth.uid());

-- Server members
create policy "Members can read server members" on public.server_members
  for select to authenticated
  using (public.is_server_member(server_id, auth.uid()));

create policy "Members can leave" on public.server_members
  for delete to authenticated
  using (user_id = auth.uid() or public.is_server_admin(server_id, auth.uid()));

create policy "Admins can add members" on public.server_members
  for insert to authenticated
  with check (public.is_server_admin(server_id, auth.uid()));

create policy "Admins can update roles" on public.server_members
  for update to authenticated
  using (public.is_server_admin(server_id, auth.uid()))
  with check (public.is_server_admin(server_id, auth.uid()));

-- Server bans
create policy "Admins can read bans" on public.server_bans
  for select to authenticated
  using (public.is_server_admin(server_id, auth.uid()));

create policy "Admins can manage bans" on public.server_bans
  for insert to authenticated
  with check (public.is_server_admin(server_id, auth.uid()));

create policy "Admins can delete bans" on public.server_bans
  for delete to authenticated
  using (public.is_server_admin(server_id, auth.uid()));

-- Channels
create policy "Members can read channels" on public.channels
  for select to authenticated
  using (public.is_server_member(server_id, auth.uid()));

create policy "Admins can manage channels" on public.channels
  for insert to authenticated
  with check (public.is_server_admin(server_id, auth.uid()));

create policy "Admins can update channels" on public.channels
  for update to authenticated
  using (public.is_server_admin(server_id, auth.uid()))
  with check (public.is_server_admin(server_id, auth.uid()));

create policy "Admins can delete channels" on public.channels
  for delete to authenticated
  using (public.is_server_admin(server_id, auth.uid()));

-- DM threads
create policy "Members can read dm threads" on public.dm_threads
  for select to authenticated
  using (exists (
    select 1 from public.dm_members dm
    where dm.thread_id = id and dm.user_id = auth.uid()
  ));

create policy "Create dm thread" on public.dm_threads
  for insert to authenticated
  with check (true);

-- DM members
create policy "Members can read dm members" on public.dm_members
  for select to authenticated
  using (exists (
    select 1 from public.dm_members dm
    where dm.thread_id = dm_members.thread_id and dm.user_id = auth.uid()
  ));

create policy "Members can add dm members" on public.dm_members
  for insert to authenticated
  with check (
    exists (
      select 1 from public.dm_members dm
      where dm.thread_id = dm_members.thread_id and dm.user_id = auth.uid()
    )
  );

create policy "Members can remove themselves" on public.dm_members
  for delete to authenticated
  using (user_id = auth.uid());

-- Messages
create policy "Members can read messages" on public.messages
  for select to authenticated
  using (
    (channel_id is not null and public.is_server_member((select server_id from public.channels c where c.id = channel_id), auth.uid()))
    or
    (thread_id is not null and exists (select 1 from public.dm_members dm where dm.thread_id = thread_id and dm.user_id = auth.uid()))
  );

create policy "Members can send messages" on public.messages
  for insert to authenticated
  with check (
    author_id = auth.uid() and (
      (channel_id is not null and public.is_server_member((select server_id from public.channels c where c.id = channel_id), auth.uid()))
      or
      (thread_id is not null and exists (select 1 from public.dm_members dm where dm.thread_id = thread_id and dm.user_id = auth.uid()))
    )
  );

create policy "Authors can update messages" on public.messages
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "Authors or admins can delete messages" on public.messages
  for delete to authenticated
  using (
    author_id = auth.uid()
    or (channel_id is not null and public.is_server_admin((select server_id from public.channels c where c.id = channel_id), auth.uid()))
  );

-- Reactions
create policy "Members can read reactions" on public.reactions
  for select to authenticated
  using (public.can_read_message(message_id, auth.uid()));

create policy "Members can add reactions" on public.reactions
  for insert to authenticated
  with check (user_id = auth.uid() and public.can_read_message(message_id, auth.uid()));

create policy "Users can remove their reactions" on public.reactions
  for delete to authenticated
  using (user_id = auth.uid());

-- Attachments
create policy "Members can read attachments" on public.attachments
  for select to authenticated
  using (public.can_read_message(message_id, auth.uid()));

create policy "Members can add attachments" on public.attachments
  for insert to authenticated
  with check (public.can_read_message(message_id, auth.uid()));

-- Reads
create policy "Users can read own reads" on public.reads
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can update own reads" on public.reads
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can upsert own reads" on public.reads
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Invites
create policy "Members can read invites" on public.invites
  for select to authenticated
  using (public.is_server_member(server_id, auth.uid()));

create policy "Admins can create invites" on public.invites
  for insert to authenticated
  with check (public.is_server_admin(server_id, auth.uid()) and created_by = auth.uid());

create policy "Admins can update invites" on public.invites
  for update to authenticated
  using (public.is_server_admin(server_id, auth.uid()))
  with check (public.is_server_admin(server_id, auth.uid()));

-- Reports
create policy "Members can report messages" on public.reports
  for insert to authenticated
  with check (public.can_read_message(message_id, auth.uid()) and reporter_id = auth.uid());
