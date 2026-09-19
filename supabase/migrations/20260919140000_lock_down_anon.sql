-- ============================================================================
-- Mona Industry — close the table to the anon role
--
-- Run this AFTER 20260919120000_init_submissions.sql, and only once the site
-- is deployed with the route handlers under app/api/ (i.e. not a static
-- export any more).
--
-- Until now the browser held the anon key and wrote to `inquiries` directly,
-- so the table had to accept anonymous inserts, reads and updates — and since
-- the anon key ships in the JS bundle, anyone who read it could list every
-- lead and CV in the project.
--
-- The site no longer talks to Supabase from the browser. Route handlers do,
-- using the service-role key, which bypasses row level security entirely. So
-- every anon policy can go: with RLS on and no policy granting anything, the
-- anon and authenticated roles can do nothing at all, while the route
-- handlers are unaffected.
-- ============================================================================

alter table public.inquiries enable row level security;

drop policy if exists "anon can submit"     on public.inquiries;
drop policy if exists "anon can read"       on public.inquiries;
drop policy if exists "anon can set status" on public.inquiries;

drop policy if exists "anon can upload a cv" on storage.objects;
drop policy if exists "anon can read a cv"   on storage.objects;

-- Belt and braces: the anon role should not reach the table even if a policy
-- is added by accident later.
revoke all on public.inquiries from anon;

-- ---------------------------------------------------------------------------
-- Rolling back
--
-- Only needed if the site goes back to writing from the browser. Re-run
-- sections 3 and 4 of 20260919120000_init_submissions.sql, then:
--
--   grant select, insert, update on public.inquiries to anon;
-- ---------------------------------------------------------------------------
