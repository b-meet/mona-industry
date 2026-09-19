# Supabase setup

Everything the site collects — product enquiries, general/support messages and
job applications — goes into one table, `public.inquiries`, separated by a
`type` column. The browser talks to Supabase directly: the site is a static
export (`output: 'export'`), so nothing under `app/api/` is deployed and the
files in `lib/` are the actual API layer.

| Where | What it does |
| --- | --- |
| `lib/supabase.js` | Creates the client from the two public env vars. |
| `lib/submissions.js` | `createSubmission`, `listSubmissions`, `updateSubmissionStatus`, `getResumeUrl`. |
| `components/InquiryForm.js` | Enquiry / support form → `createSubmission`. |
| `components/ApplicationForm.js` | Job application + CV upload → `createSubmission`. |
| `app/master/page.js` | Reads every submission and updates status. |

## 1. Create the schema

In the Supabase dashboard → **SQL Editor**, paste and run:

```
supabase/migrations/20260919120000_init_submissions.sql
```

It creates the table, its indexes, row level security policies and the private
`applications` storage bucket for CVs. It is idempotent — running it twice, or
running it on a project that already has an older `inquiries` table, is safe.

(`20260919_unified_submissions.sql` is the older migration that only *extends*
an existing table. On a fresh project, run the `init` one instead.)

## 2. Point the site at the project

Dashboard → **Project Settings → API** gives you the two values. Put them in
`.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon / publishable key>
NEXT_PUBLIC_MASTER_PASSWORD=<password for /master>
```

Both Supabase values are public by design — they are inlined into the JS bundle
at build time, and row level security is what decides what the anon key may do.

**They are read at build time, not at runtime.** Setting them only on the
hosting dashboard after the fact does nothing: set them in the build
environment (Cloudflare Pages / Vercel → project settings → environment
variables) and then trigger a fresh build.

## 3. Check it

Submit the form on `/contact` and open `/master`. If the form shows
"We could not submit your enquiry just now", open the browser console — the
error there names the cause:

| Console message | Fix |
| --- | --- |
| `Supabase is not configured…` | The env vars were missing at build time — see step 2, then rebuild. |
| `…the "inquiries" table does not exist` | Run the migration — step 1. |
| `…row level security rejected the request` | The policies did not apply; re-run section 3 of the migration. |

## Hardening (optional)

The anon key ships in the bundle, so the "anon can read" policy means anyone who
reads the bundle can query the table directly — the master password protects the
screen, not the data. Section 5 of the migration has the authenticated-only
policies that close this, together with the change needed in `/master` (sign in
with `supabase.auth.signInWithPassword()` instead of the build-time password).
