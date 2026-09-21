# Supabase setup

Everything the site collects — product enquiries, general/support messages and
job applications — goes into one table, `public.inquiries`, separated by a
`type` column.

**The browser never talks to Supabase.** It calls this site's own API, and the
route handlers hold the credentials:

```
browser  ──POST /api/enquiries/──▶  route handler  ──service-role key──▶  Supabase
```

So the network tab only ever shows your own domain, the anon key is gone, and
the table is closed to anonymous access entirely.

| Where | What it does |
| --- | --- |
| `app/api/enquiries/route.js` | `POST` — public. Validates, honeypot-checks, uploads any CV, inserts the row. |
| `app/api/master/session/route.js` | `GET` / `POST` / `DELETE` — the /master sign-in. Sets an httpOnly cookie. |
| `app/api/submissions/route.js` | `GET` — every submission. Requires the cookie. |
| `app/api/submissions/[id]/route.js` | `PATCH` — change status. Requires the cookie. |
| `app/api/submissions/[id]/resume/route.js` | `GET` — streams a CV back through this origin. Requires the cookie. |
| `lib/supabase-server.js` | Server-only client. Never import it from `app/` or `components/`. |
| `lib/submissions.js` | The browser's `fetch` wrapper around those routes. |

## 1. Create the schema

Supabase dashboard → **SQL Editor** → run:

```
supabase/migrations/20260919120000_init_submissions.sql
```

It creates the table, its indexes, RLS and the private `applications` bucket
for CVs. Idempotent — safe to run twice.

Creating a table by SQL does not always refresh the Data API's schema cache,
and until it does every request answers 404. Follow it with:

```sql
notify pgrst, 'reload schema';
```

## 2. Close the table to the anon role

Once the site is deployed with the API routes (not a static export), run:

```
supabase/migrations/20260919140000_lock_down_anon.sql
```

This drops the anonymous insert/read/update policies. With RLS on and no
policies, the anon role can do nothing; the route handlers use the service-role
key, which bypasses RLS, so they are unaffected.

## 3. Environment variables

None of these carry `NEXT_PUBLIC_`, so none of them reach the browser bundle.

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Settings → Data API → *Project URL*. Bare origin, **no** `/rest/v1`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API Keys → `service_role` (the secret one). |
| `MASTER_PASSWORD` | Your choice. Gates `/master`. |
| `MASTER_SESSION_SECRET` | Optional. Signs the session cookie; defaults to `MASTER_PASSWORD`. |

Locally they go in `.env.local`; on Vercel, **Settings → Environment
Variables**, then redeploy.

`SUPABASE_SERVICE_ROLE_KEY` bypasses row level security. It must never be given
a `NEXT_PUBLIC_` prefix, logged, or committed.

## 4. Check it

Submit the form on `/contact`, then open `/master`. The Network tab should show
a `POST` to `/api/enquiries/` on your own domain and nothing pointing at
`supabase.co`.

### When the form fails

A failed submission answers `500` with a one-word `code` in the JSON body —
visible in the browser's Network tab without any access to the server:

| `code` | What it means |
| --- | --- |
| `not_configured` | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are not set on the deployment. |
| `schema` | The table or one of its columns is missing — the migration has not been run, or the schema cache is stale. |
| `permission` | Row level security rejected the write, which means the key is not the service_role key. |
| `credentials` | The key is rejected outright. |
| `unreachable` | The Supabase host could not be reached from the server. |
| `rejected_by_constraint` | A check constraint refused the row. |
| `storage` | The CV upload failed. |

For the full picture, sign in at `/master`, then open `/api/enquiries/` in the
same browser. It reports whether each variable is set, which project host is
configured, whether the key is really the `service_role` one, whether the table
is reachable and which columns are missing — naming no secret. It answers `401`
to anyone not signed in.

The **server** log (Vercel → Deployments → Functions, or your terminal) still
carries the full sentence:

| Server log says | Fix |
| --- | --- |
| `Supabase is not configured on the server…` | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` missing — step 3, then redeploy. |
| `…the Data API does not know the "inquiries" table` | Schema cache is stale — `notify pgrst, 'reload schema';`. |
| `…the "inquiries" table does not exist` | Run the migration — step 1. |
| `…row level security rejected the request` | `SUPABASE_SERVICE_ROLE_KEY` holds the anon key, not the service_role key. |
| `MASTER_PASSWORD is not set` | Add it and redeploy. |

## Notes

- **CV size** is capped at 4 MB, below Vercel's ~4.5 MB serverless body limit,
  because the file now passes through a route handler on its way to storage.
- **Spam**: the enquiry form carries a hidden honeypot field; anything that
  arrives with it filled in is rejected. If real spam gets through, rate
  limiting belongs in `app/api/enquiries/route.js`.
