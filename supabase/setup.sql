-- Run this in the Supabase SQL Editor after creating the project.
-- Admin authentication and privileged writes are handled by the admin-api Edge Function.

create table if not exists public.examination_circulars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publish_date date not null,
  storage_path text not null unique,
  file_name text not null,
  created_at timestamptz not null default now()
);

grant select on public.examination_circulars to anon, authenticated;
revoke insert, delete on public.examination_circulars from anon, authenticated;
grant all on public.examination_circulars to service_role;

alter table public.examination_circulars enable row level security;

drop policy if exists "Anyone can read examination circulars"
  on public.examination_circulars;
create policy "Anyone can read examination circulars"
  on public.examination_circulars for select
  using (true);

drop policy if exists "Admins can add examination circulars"
  on public.examination_circulars;
drop policy if exists "Admins can delete examination circulars"
  on public.examination_circulars;

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
drop policy if exists "Admins can delete examination circular files"
  on storage.objects;

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

create table if not exists public.admin_credentials (
  id integer primary key check (id = 1),
  username text not null unique,
  password_hash text not null,
  session_version integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.admin_credentials enable row level security;
revoke all on public.admin_credentials from anon, authenticated;
grant all on public.admin_credentials to service_role;

create table if not exists public.admin_login_attempts (
  username text primary key,
  window_started_at timestamptz not null default now(),
  failed_attempts integer not null default 0,
  locked_until timestamptz
);

alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from anon, authenticated;
grant all on public.admin_login_attempts to service_role;

create or replace function public.admin_login_allowed(requested_username text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  attempt public.admin_login_attempts%rowtype;
begin
  perform pg_advisory_xact_lock(hashtext(requested_username));
  select * into attempt
  from public.admin_login_attempts
  where username = requested_username
  for update;

  if not found then
    return true;
  end if;
  if attempt.locked_until is not null and attempt.locked_until > now() then
    return false;
  end if;
  if attempt.window_started_at < now() - interval '15 minutes' then
    delete from public.admin_login_attempts where username = requested_username;
    return true;
  end if;
  return attempt.failed_attempts < 5;
end;
$$;

create or replace function public.admin_login_failure(requested_username text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext(requested_username));
  insert into public.admin_login_attempts as existing (username, window_started_at, failed_attempts, locked_until)
  values (requested_username, now(), 1, null)
  on conflict (username) do update
  set window_started_at = case
        when existing.window_started_at < now() - interval '15 minutes'
          then now()
        else existing.window_started_at
      end,
      failed_attempts = case
        when existing.window_started_at < now() - interval '15 minutes'
          then 1
        else existing.failed_attempts + 1
      end,
      locked_until = case
        when existing.window_started_at < now() - interval '15 minutes'
          then null
        when existing.failed_attempts + 1 >= 5
          then now() + interval '15 minutes'
        else existing.locked_until
      end;
end;
$$;

create or replace function public.admin_login_success(requested_username text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.admin_login_attempts where username = requested_username;
$$;

revoke all on function public.admin_login_allowed(text) from public, anon, authenticated;
revoke all on function public.admin_login_failure(text) from public, anon, authenticated;
revoke all on function public.admin_login_success(text) from public, anon, authenticated;
grant execute on function public.admin_login_allowed(text) to service_role;
grant execute on function public.admin_login_failure(text) to service_role;
grant execute on function public.admin_login_success(text) to service_role;

create table if not exists public.gallery_upload_limits (
  visitor_hash text primary key,
  window_started_at timestamptz not null default now(),
  upload_count integer not null default 0,
  bytes_uploaded bigint not null default 0
);

alter table public.gallery_upload_limits enable row level security;
revoke all on public.gallery_upload_limits from anon, authenticated;
grant all on public.gallery_upload_limits to service_role;

create or replace function public.reserve_public_gallery_upload(
  requested_visitor_hash text,
  requested_bytes bigint
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  upload_limit public.gallery_upload_limits%rowtype;
begin
  if requested_visitor_hash !~ '^[a-f0-9]{64}$'
     or requested_bytes <= 0
     or requested_bytes > 10485760 then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtext(requested_visitor_hash));
  select * into upload_limit
  from public.gallery_upload_limits
  where visitor_hash = requested_visitor_hash
  for update;

  if not found then
    insert into public.gallery_upload_limits
      (visitor_hash, window_started_at, upload_count, bytes_uploaded)
    values (requested_visitor_hash, now(), 1, requested_bytes);
    return true;
  end if;

  if upload_limit.window_started_at < now() - interval '24 hours' then
    update public.gallery_upload_limits
    set window_started_at = now(),
        upload_count = 1,
        bytes_uploaded = requested_bytes
    where visitor_hash = requested_visitor_hash;
    return true;
  end if;

  if upload_limit.upload_count >= 20
     or upload_limit.bytes_uploaded + requested_bytes > 104857600 then
    return false;
  end if;

  update public.gallery_upload_limits
  set upload_count = upload_count + 1,
      bytes_uploaded = bytes_uploaded + requested_bytes
  where visitor_hash = requested_visitor_hash;
  return true;
end;
$$;

revoke all on function public.reserve_public_gallery_upload(text, bigint) from public, anon, authenticated;
grant execute on function public.reserve_public_gallery_upload(text, bigint) to service_role;

create table if not exists public.site_settings (
  id text primary key check (id = 'global'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, data)
values (
  'global',
  jsonb_build_object(
    'principal_name', 'Prof. Shabir Ahmad',
    'principal_message', 'It is a matter of great pride and privilege to welcome you to Government Degree College, Tank.',
    'principal_image_url', '',
    'phone', '+92 306 5927447',
    'address', 'Main Bannu Road, Opposite Polytechnic Institute, District Tank',
    'merit_list_live', false
  )
)
on conflict (id) do nothing;

grant select on public.site_settings to anon, authenticated;
alter table public.site_settings enable row level security;
grant all on public.site_settings to service_role;
drop policy if exists "Anyone can read public college settings" on public.site_settings;
create policy "Anyone can read public college settings"
  on public.site_settings for select
  using (true);

create table if not exists public.faculty_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  department text not null,
  qualification text not null,
  contact text not null default '',
  photo_url text not null default '',
  photo_path text not null default '',
  is_hod boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists faculty_profiles_name_department_idx
  on public.faculty_profiles (name, department);
grant select on public.faculty_profiles to anon, authenticated;
alter table public.faculty_profiles enable row level security;
grant all on public.faculty_profiles to service_role;
drop policy if exists "Anyone can read faculty profiles" on public.faculty_profiles;
create policy "Anyone can read faculty profiles"
  on public.faculty_profiles for select
  using (true);

insert into public.faculty_profiles
  (name, designation, department, qualification, contact, is_hod, sort_order)
values
  ('Prof. Shabir Ahmad', 'Principal / Head of Institution', 'Administration / English', 'M.Phil English Literature (Peshawar University)', 'principal@casdct.edu.pk', true, 1),
  ('Mr. Muhammad Imran', 'HOD / Lecturer', 'Computer Science', 'MS Computer Science (Gomal University)', 'imran.cs@casdct.edu.pk', true, 2),
  ('Dr. Shakeel Ahmad', 'HOD / Assistant Professor', 'Chemistry', 'Ph.D Organic Chemistry (Quaid-e-Azam University)', 'shakeel.chem@casdct.edu.pk', true, 3),
  ('Mr. Najeeb-ur-Rehman', 'HOD / Lecturer', 'Physics', 'M.Sc Physics (Peshawar University)', 'najeeb.phys@casdct.edu.pk', true, 4),
  ('Mr. Habib-ur-Rehman', 'HOD / Assistant Professor', 'Biological Sciences (Zoology)', 'M.Phil Zoology (Gomal University)', 'habib.zoo@casdct.edu.pk', true, 5),
  ('Mr. Tariq Rafiq', 'HOD / Lecturer', 'English', 'MA English Language & Literature (NUML)', 'tariq.eng@casdct.edu.pk', true, 6),
  ('Mr. Shaukat Khan', 'HOD / Lecturer', 'Islamic Studies & Humanities', 'MA Islamic Studies (Gomal University)', 'shaukat.isl@casdct.edu.pk', true, 7),
  ('Mr. Asif Mahmud', 'Lecturer', 'Mathematics', 'M.Sc Applied Mathematics (Peshawar University)', 'asif.math@casdct.edu.pk', false, 8),
  ('Mr. Zia-ur-Rehman', 'Lecturer', 'Urdu', 'M.Phil Urdu (Peshawar University)', 'zia.urdu@casdct.edu.pk', false, 9)
on conflict (name, department) do nothing;

create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  reg_id text not null unique,
  record jsonb not null,
  fee_verified boolean not null default false,
  fee_amount numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admissions_fee_amount_nonnegative check (fee_amount is null or fee_amount >= 0)
);

create index if not exists admissions_created_at_idx on public.admissions (created_at desc);
create index if not exists admissions_status_idx on public.admissions ((record ->> 'status'));
alter table public.admissions enable row level security;
grant all on public.admissions to service_role;

create or replace function public.admin_save_settings(
  requested_settings jsonb,
  requested_username text,
  requested_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_credentials public.admin_credentials%rowtype;
  next_version integer;
  changed boolean;
begin
  if requested_username is null or length(trim(requested_username)) = 0 then
    raise exception 'Admin username is required';
  end if;
  if requested_settings is null or jsonb_typeof(requested_settings) <> 'object' then
    raise exception 'Settings must be a JSON object';
  end if;

  select * into current_credentials
  from public.admin_credentials
  where id = 1
  for update;
  if not found then
    raise exception 'Admin credentials are not initialized';
  end if;

  changed := current_credentials.username <> trim(requested_username)
    or requested_password_hash is not null;
  next_version := current_credentials.session_version + case when changed then 1 else 0 end;

  insert into public.site_settings (id, data, updated_at)
  values ('global', requested_settings, now())
  on conflict (id) do update
    set data = excluded.data,
        updated_at = excluded.updated_at;

  update public.admin_credentials
  set username = trim(requested_username),
      password_hash = coalesce(requested_password_hash, current_credentials.password_hash),
      session_version = next_version,
      updated_at = now()
  where id = 1;

  return jsonb_build_object(
    'username', trim(requested_username),
    'session_version', next_version,
    'credentials_changed', changed
  );
end;
$$;

revoke all on function public.admin_save_settings(jsonb, text, text) from public, anon, authenticated;
grant execute on function public.admin_save_settings(jsonb, text, text) to service_role;
revoke all on public.admissions from anon, authenticated;

create table if not exists public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  media_type text not null check (media_type in ('image', 'video')),
  category text not null check (category in ('facilities', 'sports')),
  description text not null default '',
  uploaded_by text not null default 'Student / Visitor',
  file_name text not null,
  content_type text not null,
  file_size bigint not null default 0,
  storage_path text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists gallery_media_status_created_idx
  on public.gallery_media (status, created_at desc);
grant select on public.gallery_media to anon, authenticated;
grant all on public.gallery_media to service_role;
alter table public.gallery_media enable row level security;
drop policy if exists "Anyone can view approved gallery media" on public.gallery_media;
create policy "Anyone can view approved gallery media"
  on public.gallery_media for select
  using (status = 'approved');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'faculty-photos',
  'faculty-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit)
values ('admission-receipts', 'admission-receipts', false, 5242880)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-media',
  'gallery-media',
  true,
  10485760,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
    'video/ogg', 'video/x-msvideo'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
