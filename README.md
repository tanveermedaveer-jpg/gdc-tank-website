# Government Captain Ashfaq Shaheed Degree College, Tank

## Shared admin portal and database

The portal stores admissions, faculty, gallery metadata, circulars, institutional settings, homepage content, and admin credentials in Neon Postgres. Uploaded receipts, images, videos, and PDFs are stored in a **private Vercel Blob store**; the app serves files through authenticated API routes. Admin updates are written to the shared services and are visible after a page refresh. Open pages check for remote changes every five seconds.

Admin passwords are hashed with scrypt in the database. Sessions use signed, eight-hour `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Login attempts are limited to five per address in a 15-minute window. Passwords and database credentials are never included in client JavaScript.

### Configure Vercel

1. Create a Neon Postgres database and set its connection string as `DATABASE_URL` in the Vercel project for Production and Preview.
2. Set `ADMIN_INITIAL_PASSWORD` to a new, private password between 16 and 256 characters. The first authentication request creates the admin account and stores a salted scrypt hash. The default username is **Shabir Ahmed**; optionally set `ADMIN_USERNAME` before the account is first created. Changing these seed variables does not change an account that already exists.
3. Generate a separate random `ADMIN_SESSION_SECRET` of at least 32 characters.
4. In the project's Vercel **Storage** settings, create a **private** Blob store and connect it to this Vercel project. Enable the required deployment environments. Vercel provides the Blob/OIDC configuration. For local development, use `BLOB_READ_WRITE_TOKEN` and `BLOB_WEBHOOK_PUBLIC_KEY` from the connected store.
5. Redeploy. The API initializes the database tables on first use. If the database or environment variables are missing, the login page reports the specific setup requirement rather than an ambiguous authentication-unavailable banner.

Do not commit actual environment values. `.env.example` contains placeholders only.

### Local development

Use `vercel env pull` to obtain local credentials without committing them, then start the Vercel development server:

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
