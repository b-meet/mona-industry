import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client.
 *
 * These names deliberately carry no NEXT_PUBLIC_ prefix, so Next.js never
 * inlines them into the browser bundle. Nothing in app/ or components/ may
 * import this module — only route handlers under app/api/.
 *
 * The service-role key bypasses row level security, which is what lets the
 * table stay closed to the anon role entirely: the only way into `inquiries`
 * is through the route handlers in this repo, and they decide what a caller
 * may do.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * supabase-js appends `/rest/v1`, `/storage/v1` and friends itself, so a URL
 * that already carries one produces `/rest/v1/rest/v1/...` and a 404. Trim it.
 */
function normalizeUrl(value) {
    if (!value) return value;
    return value
        .trim()
        .replace(/\/(rest|storage|auth|realtime|functions)\/v\d+\/?$/, '')
        .replace(/\/+$/, '');
}

export const isServerSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

let client = null;

/** Throws with an actionable message rather than returning a broken client. */
export function getSupabaseAdmin() {
    if (!isServerSupabaseConfigured) {
        throw new Error(
            'Supabase is not configured on the server: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix) in the deployment environment.'
        );
    }

    if (!client) {
        client = createClient(normalizeUrl(supabaseUrl), serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }

    return client;
}

/**
 * Turns a PostgREST error into something a developer can act on. The response
 * body sent to the browser stays generic; this is what goes to the server log.
 */
export function describeDbError(error, action) {
    const MIGRATION = 'supabase/migrations/20260919120000_init_submissions.sql';

    if (error.code === 'PGRST205') {
        return `${action} failed: the Data API does not know the "inquiries" table. Run \`notify pgrst, 'reload schema';\` in the SQL Editor and confirm SUPABASE_URL points at the project where ${MIGRATION} was run.`;
    }
    if (error.code === '42P01') {
        return `${action} failed: the "inquiries" table does not exist. Run ${MIGRATION}.`;
    }
    if (error.code === 'PGRST204') {
        return `${action} failed: ${error.message}. The table is missing a column the site writes — re-run ${MIGRATION}.`;
    }
    if (error.code === '23514') {
        return `${action} failed: a check constraint rejected the row (${error.message}).`;
    }
    if (error.code === '42501' || /row-level security/i.test(error.message || '')) {
        return `${action} failed: row level security rejected the request, which should not happen with the service-role key. Check SUPABASE_SERVICE_ROLE_KEY is the service_role key and not the anon key.`;
    }
    return `${action} failed: ${error.message}${error.code ? ` (${error.code})` : ''}`;
}
