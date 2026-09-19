-- ============================================================================
-- Mona Industry — submissions schema, from scratch
--
-- Run this once against a fresh Supabase project (Dashboard → SQL Editor, or
-- `supabase db push`). It creates everything the site needs: the submissions
-- table, its indexes, row level security, and the private bucket that holds
-- CVs attached to job applications.
--
-- It is idempotent and additive, so it is also safe to run against the older
-- project that already has an `inquiries` table — existing rows are preserved
-- and simply become type = 'enquiry'.
--
-- The table keeps the name `inquiries` because that is what lib/submissions.js
-- reads and writes. Every message the site collects lands here — product
-- enquiries, general/support messages and job applications — separated by the
-- `type` column.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  type         text not null default 'enquiry',
  status       text not null default 'New',
  name         text not null,
  email        text not null,
  phone        text,
  company      text,
  subject      text,
  role         text,
  details      text,
  product_list text,   -- JSON array of { name, category, quantity }, stringified
  payload      jsonb   -- type-specific extras (CV path/name, cover note, …)
);

-- Columns for projects that already carried an older, narrower `inquiries`.
alter table public.inquiries
  add column if not exists type         text not null default 'enquiry',
  add column if not exists status       text not null default 'New',
  add column if not exists company      text,
  add column if not exists subject      text,
  add column if not exists role         text,
  add column if not exists details      text,
  add column if not exists product_list text,
  add column if not exists payload      jsonb;

comment on table public.inquiries is
  'Every message the public site collects: product enquiries, general/support messages and job applications.';
comment on column public.inquiries.type is
  'enquiry (products requested), support (general message), application (job application).';
comment on column public.inquiries.status is
  'Where the lead stands. Allowed values differ by type — see STATUS_OPTIONS in lib/submissions.js.';
comment on column public.inquiries.company is
  'Submitter''s company, for enquiry and support rows.';
comment on column public.inquiries.subject is
  'Short one-line summary shown in the master table.';
comment on column public.inquiries.role is
  'Job title applied for, on application rows.';
comment on column public.inquiries.product_list is
  'Stringified JSON array of the products asked about, on enquiry rows.';
comment on column public.inquiries.payload is
  'Type-specific extras. Applications carry experience, employer, cover_note, resume_path and resume_name here.';

-- ---------------------------------------------------------------------------
-- 2. Constraints — keep obvious junk out of the table
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'inquiries_type_check') then
    alter table public.inquiries
      add constraint inquiries_type_check
      check (type in ('enquiry', 'support', 'application'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'inquiries_name_check') then
    alter table public.inquiries
      add constraint inquiries_name_check
      check (char_length(btrim(name)) between 1 and 200);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'inquiries_email_check') then
    alter table public.inquiries
      add constraint inquiries_email_check
      check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and char_length(email) <= 320);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'inquiries_details_check') then
    alter table public.inquiries
      add constraint inquiries_details_check
      check (details is null or char_length(details) <= 5000);
  end if;
end $$;

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_type_idx       on public.inquiries (type);
create index if not exists inquiries_status_idx     on public.inquiries (status);

-- ---------------------------------------------------------------------------
-- 3. Row level security
--
-- The site is a static export, so the browser only ever holds the anon key.
-- Anyone may submit; reads are what the master password gates in the UI.
--
-- NOTE: the anon key is public in the JS bundle, so these read/update policies
-- mean anyone who reads the bundle can query this table directly — the master
-- password protects the screen, not the data. To close that properly, replace
-- the two policies marked (*) with the authenticated-only versions in
-- section 5 and sign the master panel in as a Supabase user.
-- ---------------------------------------------------------------------------
alter table public.inquiries enable row level security;

drop policy if exists "anon can submit" on public.inquiries;
create policy "anon can submit"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon can read" on public.inquiries;
create policy "anon can read"                              -- (*)
  on public.inquiries for select
  to anon, authenticated
  using (true);

drop policy if exists "anon can set status" on public.inquiries;
create policy "anon can set status"                        -- (*)
  on public.inquiries for update
  to anon, authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- 4. Storage bucket for CVs
--
-- Private bucket: files are not listable and have no public URL. Paths carry a
-- random UUID, so a CV cannot be guessed from the applicant's name.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'applications',
  'applications',
  false,
  5242880,  -- 5 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "anon can upload a cv" on storage.objects;
create policy "anon can upload a cv"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'applications');

drop policy if exists "anon can read a cv" on storage.objects;
create policy "anon can read a cv"                         -- (*)
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'applications');

-- ---------------------------------------------------------------------------
-- 5. Optional hardening — locking reads to a signed-in admin
--
-- Create one user in Authentication → Users, switch the master panel to
-- supabase.auth.signInWithPassword(), then run this block. After it, the anon
-- key can submit but cannot read anything back.
--
--   drop policy if exists "anon can read"       on public.inquiries;
--   drop policy if exists "anon can set status" on public.inquiries;
--   drop policy if exists "anon can read a cv"  on storage.objects;
--
--   create policy "admin can read" on public.inquiries
--     for select to authenticated using (true);
--   create policy "admin can set status" on public.inquiries
--     for update to authenticated using (true) with check (true);
--   create policy "admin can read a cv" on storage.objects
--     for select to authenticated using (bucket_id = 'applications');
-- ---------------------------------------------------------------------------
