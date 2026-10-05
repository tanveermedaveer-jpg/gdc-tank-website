# Government Captain Ashfaq Shaheed Degree College, Tank

## Local-only admin portal

The site has no Firebase or Supabase dependencies, backend endpoints, API keys, or deployment secrets. Vercel serves the static React application; portal records and uploaded files are stored in the current browser profile using IndexedDB. Updates notify other tabs of this site in the same browser profile.

On first visit to `/login`, create a local password for the fixed initial admin username **Professor Saleem Khan**. The password is hashed with PBKDF2 before it is saved in IndexedDB. Later sign-ins and updates to the admin username/password use the same browser-local record.

### Important limitations

- Local data is isolated to a browser profile on one device. It does not sync to Vercel, other browsers, or other devices.
- Browser-local login is not server-side authentication. A visitor with access to the browser can inspect or change local site data; do not use this mode for sensitive records or shared public administration.
- Clearing browser/site data, using private browsing, or losing the device can erase the local password, admissions, fee records, uploaded files, and settings. Keep any important data in a separate secure backup.
- Records previously stored only in Supabase or Firebase are not downloaded into local storage by this version.
- Browser storage quotas vary. Gallery images/videos are limited to 5 MB per file, receipts to 5 MB, and circular PDFs to 10 MB.

Gallery moderation, examination circulars, faculty profiles, admissions, fee verification, contact/principal settings, merit-list visibility, homepage text, notices, ticker announcements, and homepage statistics all use the local portal store. Approved gallery content and homepage updates appear immediately in the current browser and its other open tabs.

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
