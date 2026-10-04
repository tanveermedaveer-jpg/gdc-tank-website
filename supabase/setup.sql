-- Run this in the Supabase SQL Editor after creating the project.
-- Create the initial admin user in Supabase Auth, then assign the admin
-- app_metadata role using the instructions in README.md.

create table if not exists public.examination_circulars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publish_date date not null,
  storage_path text not null unique,
  file_name text not null,
  created_at timestamptz not null default now()
);

grant select on public.examination_circulars to anon, authenticated;
grant insert, delete on public.examination_circulars to authenticated;

alter table public.examination_circulars enable row level security;

drop policy if exists "Anyone can read examination circulars"
  on public.examination_circulars;
create policy "Anyone can read examination circulars"
  on public.examination_circulars for select
  using (true);

drop policy if exists "Admins can add examination circulars"
  on public.examination_circulars;
create policy "Admins can add examination circulars"
  on public.examination_circulars for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete examination circulars"
  on public.examination_circulars;
create policy "Admins can delete examination circulars"
  on public.examination_circulars for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'examination-circulars',
  'examination-circulars',
  true,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload examination circulars"
  on storage.objects;
create policy "Admins can upload examination circulars"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'examination-circulars'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can delete examination circular files"
  on storage.objects;
create policy "Admins can delete examination circular files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'examination-circulars'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'examination_circulars'
     ) then
    execute 'alter publication supabase_realtime add table public.examination_circulars';
  end if;
end
$$;
