# Government Captain Ashfaq Shaheed Degree College, Tank

## Shared admin portal and database

The portal stores admissions, faculty, gallery metadata, circulars, institutional settings, and homepage content in Neon Postgres. Admin sign-in uses Firebase Authentication; the browser keeps Firebase's session-scoped auth state and sends Firebase ID tokens to the API. The server verifies each token and authorizes only the configured admin UID. No separate application session secret or signed-cookie setup is required. Uploaded receipts, images, videos, and PDFs are stored in a **private Vercel Blob store**; the app serves files through authenticated API routes. Admin updates are written to the shared services and are visible after a page refresh. Open pages check for remote changes every five seconds.

Firebase handles password verification and account protections. Neon is not used to store or verify admin passwords. The Firebase web API key in the client is a public project identifier, not an admin credential; restrict its allowed APIs and website referrers in Google Cloud.

### Configure Vercel

1. Create a Neon Postgres database and set its connection string as `DATABASE_URL` in the Vercel project for Production and Preview.
2. In Firebase Console, enable **Authentication → Sign-in method → Email/Password** and create the admin user. Copy that user's UID from the Users page.
3. Set `FIREBASE_ADMIN_UID` to the admin user's exact UID in Vercel. The Firebase project ID is configured in the app; only this Firebase account can access the admin portal.
4. In the project's Vercel **Storage** settings, create a **private** Blob store and connect it to this Vercel project. Enable the required deployment environments. Vercel provides the Blob/OIDC configuration. For local development, use `BLOB_READ_WRITE_TOKEN` and `BLOB_WEBHOOK_PUBLIC_KEY` from the connected store.
5. Redeploy. The API initializes the portal data tables on first use. Missing Firebase or database configuration is reported explicitly.

Do not commit database, UID, or Blob environment values. `.env.example` contains setup guidance and placeholders only.

### Local development

Use `vercel env pull` to obtain local credentials without committing them, then start the Vercel development server. The Firebase web client config is included in the app; server-side authorization still requires `FIREBASE_ADMIN_UID`:

```powershell
npm install
vercel env pull
vercel dev
```

Plain `npm run dev` starts Vite without the serverless API and will not provide database-backed authentication or storage.

On the first successful admin login in a browser, existing records in that browser's previous IndexedDB portal are uploaded and merged into the shared database. Array records are merged by their IDs; existing cloud settings and homepage content take precedence. Repeat the login on other browsers that contain older local records to import those records too. Keep a separate backup before migrating important records.

## Data and privacy notes

The database and Blob store are shared across browsers and devices. Applicants can submit admissions and gallery items without an admin session; new gallery items remain pending until an administrator approves them. Public merit data is limited to approved applicants and is only returned while the merit list is published. Receipt files require an admin session.

Vercel/Neon/Blob availability, quotas, retention, and pricing depend on the configured plans. The application does not replace a separate backup policy.

## Development checks

```powershell
npm run build
npm run lint
```
