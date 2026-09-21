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

/**
 * A short, non-secret label for why a write failed, safe to put in a response
 * body. The browser shows nothing but this word; the matching detail from
 * describeDbError stays in the server log.
 */
export function classifyError(error) {
    const code = error?.code;
    const message = String(error?.message || '');

    if (/Supabase is not configured/i.test(message)) return 'not_configured';
    if (/CV upload failed/i.test(message)) return 'storage';
    // describeDbError's text, for a code that did not survive a wrap.
    if (/does not exist|does not know the|missing a column/i.test(message)) return 'schema';
    if (code === 'PGRST205' || code === 'PGRST204' || code === '42P01') return 'schema';
    if (code === '42501' || /row-level security/i.test(message)) return 'permission';
    if (code === '23514') return 'rejected_by_constraint';
    if (/Invalid API key|JWT|401|403/i.test(message)) return 'credentials';
    if (/fetch failed|ENOTFOUND|ECONNREFUSED|timeout/i.test(message)) return 'unreachable';
    return 'unknown';
}

/**
 * What the operator needs to tell "env vars missing" from "migration not run"
 * without reading a Vercel log. Names no secret: it reports whether each
 * variable is set and what the project host is, never a key.
 */
export async function diagnoseSubmissions() {
    const report = {
        supabase_url_set: Boolean(supabaseUrl),
        service_role_key_set: Boolean(serviceRoleKey),
        supabase_host: supabaseUrl ? normalizeUrl(supabaseUrl).replace(/^https?:\/\//, '') : null,
        // A service_role key is a JWT with role=service_role, or an sb_secret_ key.
        // The anon key pasted in by mistake is the single most common cause.
        key_looks_like_service_role: null,
        table_reachable: null,
        row_count: null,
        missing_columns: [],
        error: null,
        error_code: null,
    };

    if (!report.supabase_url_set || !report.service_role_key_set) {
        report.error = 'SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not set in this deployment.';
        report.error_code = 'not_configured';
        return report;
    }

    report.key_looks_like_service_role = describeKeyRole(serviceRoleKey);

    const EXPECTED = [
        'id', 'created_at', 'type', 'status', 'name', 'email', 'phone',
        'company', 'subject', 'role', 'details', 'product_list', 'payload',
    ];

    try {
        const supabase = getSupabaseAdmin();

        // A real (non-head) select, because a HEAD request carries no body and
        // PostgREST's code and message would be lost with it.
        const reach = await supabase.from('inquiries').select('id').limit(1);

        if (reach.error) {
            report.table_reachable = false;
            report.error = describeDbError(reach.error, 'Reaching the submissions table');
            report.error_code = classifyError(reach.error);
            return report;
        }

        report.table_reachable = true;

        const { count } = await supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true });
        report.row_count = count ?? null;

        // Ask for every column the insert writes. PostgREST names the first
        // one it does not know, so probe them one at a time.
        for (const column of EXPECTED) {
            const probe = await supabase.from('inquiries').select(column).limit(1);
            if (probe.error) report.missing_columns.push(column);
        }
    } catch (err) {
        report.table_reachable = false;
        report.error = err.message;
        report.error_code = classifyError(err);
    }

    return report;
}

/** 'service_role', 'anon', 'secret', or 'unrecognised' — never the key itself. */
function describeKeyRole(key) {
    if (/^sb_secret_/.test(key)) return 'secret';
    if (/^sb_publishable_/.test(key)) return 'publishable (WRONG — this is the public key)';

    const parts = key.split('.');
    if (parts.length !== 3) return 'unrecognised';

    try {
        const claims = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (claims.role === 'service_role') return 'service_role';
        if (claims.role === 'anon') return 'anon (WRONG — this is the public key)';
        return claims.role ? `role=${claims.role}` : 'unrecognised';
    } catch {
        return 'unrecognised';
    }
}
