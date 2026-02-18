# Chatter

A Discord-style real-time chat app with original branding, built with React + Vite + TypeScript and Supabase. Frontend deploys to GitHub Pages; backend is hosted in Supabase.

## Repo Structure
- `app/` frontend (React, Vite, Tailwind, TanStack Query)
- `supabase/` SQL migrations + policies

## Features
- Auth: email/password + GitHub OAuth
- Servers & channels with roles
- Realtime messaging, reactions, read markers
- DMs (1:1 + groups)
- Search + mentions
- File uploads (Supabase Storage)
- Basic moderation (reports, bans)
- Offline-tolerant message queue
- Command palette (Cmd/Ctrl+K)

## Prerequisites
- Node.js 20+
- Supabase project (cloud)
- Supabase CLI (optional for local migration management)

## Supabase Setup
1. Create a Supabase project.
2. Run migrations in the SQL editor:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_storage.sql`
3. Create a Storage bucket named `attachments`.
4. Enable Realtime for tables: `messages`, `reactions`, `reads`, `server_members`, `dm_members`.
5. Configure Auth:
   - Enable Email auth.
   - Enable GitHub OAuth and set redirect URL to your GitHub Pages URL and local URL.

## Environment Variables
Copy `app/.env.example` to `app/.env.local`:
```
VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
VITE_APP_NAME="Chatter"
VITE_APP_BASE_URL="http://localhost:5173"
VITE_BASE="/"
```

## Local Development
```
cd app
npm install
npm run dev
```

## GitHub Pages Deployment
1. Push to `main`.
2. In GitHub repo Settings → Pages, set Source to GitHub Actions.
3. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. The workflow `.github/workflows/deploy.yml` builds and deploys to Pages.

## Supabase Notes
- RLS is enabled for all tables in `0001_init.sql`.
- Invite flow uses the `join_server(code)` RPC.
- Storage policies assume the bucket is named `attachments`.

## Tests
```
cd app
npm run test:unit
npm run test:e2e
```

## Next Steps
- Wire remaining realtime features (presence, typing, read receipts sync).
- Complete DM and search flows.
- Implement moderation UI and admin tools.
