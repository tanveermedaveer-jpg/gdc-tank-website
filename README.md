# Government Captain Ashfaq Shaheed Degree College, Tank

## Shared admin data and authentication

Admissions, faculty profiles, college contact/principal settings, fee verification, and examination circular metadata are stored in Supabase. Gallery media files and metadata, homepage announcements, ticker messages, and editable homepage content are shared through Firebase Storage and Cloud Firestore. Gallery and homepage clients subscribe to Firestore snapshots for real-time updates across browsers and devices.

The admin dashboard keeps the username/password interface; authentication and privileged writes run through the `admin-api` Supabase Edge Function. Passwords are salted PBKDF2 hashes in the database, and the browser receives only a short-lived signed session token. The function verifies that session before writing admin content to Firebase. Supabase service-role and Firebase service-account credentials must remain server-side and must never be added to the Vite app or repository.

The Edge Function needs these secrets in the Supabase project:

- `ADMIN_INITIAL_USERNAME`: the first admin username.
- `ADMIN_INITIAL_PASSWORD`: the first admin password (at least 10 characters).
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters.
- `ALLOWED_ORIGINS`: comma-separated production site origin(s), including `https://gdc-tank-website.vercel.app`, plus `http://localhost:5173` when local development is needed.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: the Firebase project's service-account JSON, stored as a Supabase Edge Function secret.
- `FIREBASE_STORAGE_BUCKET`: the exact Firebase Storage bucket name from the Firebase project.

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Configure the public Vite app with `.env.local` (copy `.env.example`) and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Set the same public variables in the production hosting environment and redeploy.

1. Create a Supabase project and run [`supabase/setup.sql`](./supabase/setup.sql) in its SQL Editor.
2. Create a Firebase project, enable Cloud Firestore and Firebase Storage, and register a web app. Set its public web configuration in `.env.local` using the `VITE_FIREBASE_*` values in [`.env.example`](./.env.example). The Firebase project ID and bucket must match the server-side service account and `FIREBASE_STORAGE_BUCKET`. Set the same public values in Vercel's environment settings.
3. Deploy the read-only client rules from this repository after selecting the Firebase project:

   ```powershell
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,storage --project YOUR_FIREBASE_PROJECT_ID
   ```

4. Grant the Firebase service account the **Cloud Datastore User** and **Storage Object Admin** roles. Set `FIREBASE_SERVICE_ACCOUNT_JSON` and `FIREBASE_STORAGE_BUCKET`, along with the other Edge Function secrets, in Supabase **Project Settings → Edge Functions → Secrets** (or use `npx supabase secrets set`). Keep these credentials private; do not commit them or expose them as `VITE_*` variables.
5. Install and authenticate the [Supabase CLI](https://supabase.com/docs/guides/cli), then link the project:

   ```powershell
   npx supabase login
   npx supabase link --project-ref YOUR_SUPABASE_PROJECT_REF
   ```

6. Deploy the function. The checked-in [`supabase/config.toml`](./supabase/config.toml) disables Supabase JWT verification at the gateway because this endpoint verifies its own signed admin session tokens:

   ```powershell
   npx supabase functions deploy admin-api
   ```

7. Set both Supabase and Firebase public `VITE_*` variables in Vercel, then redeploy the website. The admin can add homepage notices, ticker messages, and homepage text/stats from **Admin → Settings → Shared Homepage Content & Announcements**.

The first successful sign-in using the configured initial credentials initializes the hashed admin credential row. Updating the username or password in the dashboard invalidates earlier admin sessions. Public visitors may read faculty, safe institutional settings, approved merit-list data, and circulars. Admissions and fee details have no public read policy; all administrative reads and writes require a valid signed admin session at the Edge Function.

The SQL setup creates public circular and faculty-photo buckets, a private receipt bucket, and shared faculty/settings/admissions tables. The first authenticated admin dashboard load copies existing gallery metadata and files from the legacy Supabase gallery into Firebase without deleting the source records. Firebase rules allow visitors to read approved gallery items and homepage content but deny direct client writes. Media uploads and all content writes pass through the authenticated Edge Function; public gallery submissions are moderated and rate-limited per network. Gallery uploads are limited to 5 MB.

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
