# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Admin authentication and examination circulars

The admin dashboard login uses the configured admin username and password stored in this browser's local storage (`casdct_admin_name` and `casdct_admin_pass`; defaults are `Shabir Ahmad` and `122011577`). This legacy client-side login is not server-secure and credentials do not sync between browsers.

Public examination circulars are stored in Supabase. Public visitors can read published circulars; uploading and deleting circulars still requires a Supabase Auth session with the `admin` application-metadata role. The dashboard's local username/password login does not establish a Supabase session.

1. Create a Supabase project and run [`supabase/setup.sql`](./supabase/setup.sql) in its SQL Editor.
2. Create the initial admin account in **Authentication → Users**. Disable public sign-ups in the Supabase Auth settings.
3. In the SQL Editor, assign the admin role to that account, replacing the email:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
     || '{"role":"admin"}'::jsonb
   where email = 'admin@example.edu';
   ```

   Sign in again after changing the role so Supabase issues a fresh token.
4. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project's URL and public anon/publishable key. Never put a Supabase service-role key in the client or repository.
5. Set the same two variables in the production hosting environment (for example, Vercel project settings), then redeploy the site.

The SQL setup creates the circular metadata table, public read policies, admin-only write/delete policies, and the public `examination-circulars` storage bucket. PDF uploads are limited to 10 MB. The Settings page updates the signed-in admin's Supabase email and password; leave the new-password field empty to keep the existing password. Email changes may require confirmation through the link Supabase sends.
