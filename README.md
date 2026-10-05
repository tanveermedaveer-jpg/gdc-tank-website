# Government Captain Ashfaq Shaheed Degree College, Tank

## Admin authentication

The Vercel serverless endpoint `/api/admin-auth` verifies admin credentials against Neon Postgres. The initial username is **Shabir Ahmed**; the initial password is never committed or embedded in client code. Passwords are salted and hashed with scrypt. Successful logins use signed, eight-hour `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Login attempts are limited to five per source address in a 15-minute window.

### Vercel deployment setup

1. Create a Neon Postgres database and connect it to the Vercel project.
2. Add `DATABASE_URL`, `ADMIN_INITIAL_PASSWORD`, and `ADMIN_SESSION_SECRET` to Vercel **Settings → Environment Variables** for each deployment environment that needs admin access.
   - `ADMIN_INITIAL_PASSWORD` must be a unique secret between 16 and 256 characters. The nine-digit password previously suggested is too weak for production and must not be used; generate a new, private password instead.
   - `ADMIN_SESSION_SECRET` must be a separate random secret of at least 32 characters.
3. Redeploy. The first authentication request creates the credential and rate-limit tables and seeds the initial account. After initialization, `ADMIN_INITIAL_PASSWORD` can be removed from Vercel; the database remains the source of truth.
4. Configure Vercel Firewall rate limiting for `/api/admin-auth` as an additional layer of protection.

Never commit secret values to GitHub or expose them as `VITE_*` variables. Updating either credential in Dashboard Settings stores the new scrypt hash in Neon and revokes existing sessions. New passwords must be 16–256 characters.

For local testing, use `vercel dev` with the same environment variables. Plain `npm run dev` serves the Vite application only and does not run the Vercel function.

## Portal data limitations

Only admin credentials and login-attempt counters are stored server-side. Admissions, fee records, faculty, gallery files, circulars, homepage content, and institutional settings still use IndexedDB in the current browser profile. They do not synchronize between browsers or devices, and browser-local portal records are not protected by server-side authorization. Clearing browser/site data or losing the device can erase them; keep important records in a separate secure backup. Previously remote-only Firebase/Supabase records are not imported.

Browser storage quotas vary. Gallery images/videos are limited to 5 MB per file, receipts to 5 MB, and circular PDFs to 10 MB.

## Development

```powershell
npm install
npm run build
npm run lint
```
