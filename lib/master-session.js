import crypto from 'node:crypto';

/**
 * The /master panel's session.
 *
 * Server-only. The password is compared inside a route handler and never
 * reaches the browser; what the browser gets back is an httpOnly cookie
 * holding an expiry and an HMAC of it, so it cannot be forged or extended by
 * editing localStorage.
 */
export const SESSION_COOKIE = 'mona_master';
const SESSION_HOURS = 10;

const password = process.env.MASTER_PASSWORD;
// A dedicated secret is better, but deriving one from the password keeps the
// deployment to a single new variable. Rotating the password invalidates every
// outstanding session, which is the behaviour you want anyway.
const secret = process.env.MASTER_SESSION_SECRET || password || '';

export const isMasterConfigured = Boolean(password);

function sign(value) {
    return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

/** Constant-time compare that tolerates differing lengths. */
function safeEqual(a, b) {
    const left = Buffer.from(String(a));
    const right = Buffer.from(String(b));
    if (left.length !== right.length) {
        // Still spend the comparison so the failure is not distinguishable by timing.
        crypto.timingSafeEqual(left, left);
        return false;
    }
    return crypto.timingSafeEqual(left, right);
}

export function passwordMatches(candidate) {
    if (!isMasterConfigured) return false;
    return safeEqual(candidate ?? '', password);
}

export function issueSession() {
    const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
    return {
        value: `${expiresAt}.${sign(String(expiresAt))}`,
        maxAge: SESSION_HOURS * 60 * 60,
    };
}

export function sessionIsValid(cookieValue) {
    if (!cookieValue || !secret) return false;

    const [expiresAt, signature] = String(cookieValue).split('.');
    if (!expiresAt || !signature) return false;
    if (!safeEqual(signature, sign(expiresAt))) return false;

    return Number(expiresAt) > Date.now();
}

/** Reads the session cookie off a Request and says whether it is still good. */
export function requestIsAuthenticated(request) {
    return sessionIsValid(request.cookies.get(SESSION_COOKIE)?.value);
}
