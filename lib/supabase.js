import { createClient } from '@supabase/supabase-js';

/**
 * The site is a static export, so these two values are inlined into the JS
 * bundle at build time — they must be set in the build environment (Cloudflare
 * Pages / Vercel project settings, or .env.local for `npm run dev`), not at
 * runtime. Both are public by design; the anon key is safe to ship because row
 * level security decides what it can actually do.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PLACEHOLDERS = ['your-project', 'xyzcompany', 'YOUR_SUPABASE'];

/**
 * supabase-js wants the bare project origin and appends `/rest/v1`, `/storage/v1`
 * and so on itself. Pasting the REST endpoint from the dashboard instead gives
 * `…/rest/v1/rest/v1/inquiries`, which answers 404 "Invalid path specified in
 * request URL". Trim the service path rather than making that a deploy-time
 * puzzle.
 */
function normalizeUrl(value) {
    if (!value) return value;
    return value.trim().replace(/\/(rest|storage|auth|realtime|functions)\/v\d+\/?$/, '').replace(/\/+$/, '');
}

function looksReal(value) {
    return Boolean(value) && !PLACEHOLDERS.some((token) => value.includes(token));
}

/** False when the build had no credentials — every call will fail, loudly. */
export const isSupabaseConfigured = looksReal(supabaseUrl) && looksReal(supabaseAnonKey);

export const SUPABASE_NOT_CONFIGURED =
    'Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY were missing at build time.';

// Created unconditionally so importing this module never throws; calls made
// without real credentials fail fast in lib/submissions.js instead, with a
// message that says what is wrong rather than a network error.
export const supabase = createClient(
    normalizeUrl(supabaseUrl) || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
);
