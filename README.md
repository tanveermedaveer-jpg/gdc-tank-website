# Government Captain Ashfaq Shaheed Degree College, Tank

## Admin login and portal storage

Admin authentication is handled by the Vercel serverless function at `/api/admin-auth`. The fixed username is **Professor Saleem Khan**. Password verification and signed, eight-hour sessions run server-side; the session is held in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie, not browser-readable storage. There is no first-run password setup or browser-only authentication fallback.

Before deployment, add these secrets in the Vercel project under **Settings → Environment Variables**:

- `ADMIN_PASSWORD` — a unique, randomly generated password with at least 16 characters.
- `ADMIN_SESSION_SECRET` — a separate random secret of at least 32 characters, used to sign session tokens.

Set both for every deployment environment that needs admin access, then redeploy. Never commit real values to GitHub or expose them as `VITE_*` variables. If either value is absent or outside its required length, the login endpoint fails closed and the login screen reports that authentication is not configured. Rotate both values and redeploy to revoke active sessions.

For an internet-facing deployment, also configure Vercel Firewall rate limiting for `/api/admin-auth`; serverless function instances do not provide a durable shared login-attempt counter.

Use the same Vercel environment-variable configuration with `vercel dev` for local testing, rather than plain `npm run dev`, which serves only the Vite app and does not run Vercel functions.

### Portal data limitations

Only authentication is server-backed. Admissions, fee records, faculty, gallery files, circulars, homepage content, and institutional settings still use IndexedDB in the current browser profile. They do not synchronize with Vercel, other browsers, or other devices, and browser-local data is not protected by server-side authorization. Clearing browser/site data or losing the device can erase it; keep important records in a separate secure backup. Previously remote-only Firebase/Supabase records are not imported.

Browser storage quotas vary. Gallery images/videos are limited to 5 MB per file, receipts to 5 MB, and circular PDFs to 10 MB.

## Development

```powershell
npm install
npm run build
npm run lint
```

To test the login locally, install/use the Vercel CLI, configure the two secrets for the linked project, and run `vercel dev` so the serverless authentication endpoint is available.
