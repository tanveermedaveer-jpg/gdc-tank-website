# Government Captain Ashfaq Shaheed Degree College, Tank

## Admin authentication

Admin login is currently a browser-only prototype. The default username and password are defined in `src/lib/adminApi.js`; Dashboard Settings can optionally replace them for the current browser. A successful login stores the session marker and username in `localStorage`, so it survives a page refresh. Logout removes that session state. The login flow does not call an API, database, or external authentication service.

This is **not secure authentication**: frontend credentials are visible to visitors, and `localStorage` can be edited by anyone using the browser. Do not use this mode to protect sensitive data or deploy the admin dashboard as a securely restricted service. Replace these local checks with server-side authentication before production use.

## Portal data limitations

Admissions, fee records, faculty, gallery files, circulars, homepage content, and institutional settings use IndexedDB in the current browser profile. They do not synchronize between browsers or devices, and browser-local portal records are not protected by server-side authorization. Clearing browser/site data or losing the device can erase them; keep important records in a separate secure backup. Previously remote-only Firebase/Supabase records are not imported.

Browser storage quotas vary. Gallery images/videos are limited to 5 MB per file, receipts to 5 MB, and circular PDFs to 10 MB.

## Development

```powershell
npm install
npm run build
npm run lint
```
