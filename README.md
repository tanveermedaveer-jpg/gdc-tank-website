# Government Captain Ashfaq Shaheed Degree College, Tank

## Shared admin data and authentication

Public admissions, faculty profiles, college contact/principal settings, fee verification, gallery media, and examination circular metadata are stored in Supabase. The admin dashboard keeps the username/password interface; authentication and all privileged writes run through the `admin-api` Edge Function. Passwords are salted PBKDF2 hashes in the database, and the browser receives only a short-lived signed session token. The Supabase service-role key must never be added to the Vite app or repository.

The Edge Function needs these secrets in the Supabase project:

- `ADMIN_INITIAL_USERNAME`: the first admin username.
- `ADMIN_INITIAL_PASSWORD`: the first admin password (at least 10 characters).
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters.
- `ALLOWED_ORIGINS`: comma-separated production site origin(s), plus `http://localhost:5173` when local development is needed.

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Configure the public Vite app with `.env.local` (copy `.env.example`) and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Set the same public variables in the production hosting environment and redeploy.

1. Create a Supabase project and run [`supabase/setup.sql`](./supabase/setup.sql) in its SQL Editor.
2. Install and authenticate the [Supabase CLI](https://supabase.com/docs/guides/cli), then link the project:

   ```powershell
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Set the Edge Function secrets in Supabase **Project Settings → Edge Functions → Secrets** (or use `npx supabase secrets set`). Keep these values private; do not commit them.
4. Deploy the function. The checked-in [`supabase/config.toml`](./supabase/config.toml) disables Supabase JWT verification at the gateway because this endpoint verifies its own signed admin session tokens:

   ```powershell
   npx supabase functions deploy admin-api
   ```

5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` for local testing and in the production host settings before redeploying the site.

The first successful sign-in using the configured initial credentials initializes the hashed admin credential row. Updating the username or password in the dashboard invalidates earlier admin sessions. Public visitors may read faculty, safe institutional settings, approved merit-list data, and circulars. Admissions and fee details have no public read policy; all administrative reads and writes require a valid signed admin session at the Edge Function.

The SQL setup creates public circular, faculty-photo, and gallery-media buckets, a private receipt bucket, shared faculty/settings/admissions/gallery tables, and row-level security policies. The application submission endpoint stores applicant data centrally and keeps receipts private to the admin service. Public gallery uploads are moderated before publication and are rate-limited per network.

## Development

```powershell
npm install
npm run dev
```

Production build and lint:

```powershell
npm run build
npm run lint
```
