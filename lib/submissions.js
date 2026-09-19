/**
 * The browser's view of the submissions API.
 *
 * Every call goes to this site's own origin — the Supabase project URL, its
 * keys and the table name never reach the bundle. The route handlers under
 * app/api/ hold the credentials and do the writing.
 *
 * Paths carry a trailing slash because next.config.mjs sets trailingSlash, and
 * calling them without one costs a 308 redirect on every request.
 */
export {
    SUBMISSION_TYPES,
    STATUS_OPTIONS,
    statusOptionsFor,
    parseProducts,
    validateResume,
} from '@/lib/submission-types';

/** Pulls the server's message out of a failed response, whatever its shape. */
async function readError(response, fallback) {
    try {
        const body = await response.json();
        if (body?.error) return body.error;
    } catch {
        // Not JSON — a proxy error page, most likely.
    }
    return `${fallback} (HTTP ${response.status})`;
}

/**
 * Writes one submission. `resume` (a File) makes it a multipart request so the
 * CV travels with it; everything else goes as JSON.
 */
export async function createSubmission({
    type = 'enquiry',
    name,
    email,
    phone,
    company = null,
    subject = null,
    role = null,
    details = null,
    products = [],
    payload = {},
    resume = null,
    website = '',
}) {
    let request;

    if (resume) {
        const form = new FormData();
        form.append('type', type);
        form.append('name', name ?? '');
        form.append('email', email ?? '');
        form.append('phone', phone ?? '');
        if (company) form.append('company', company);
        if (subject) form.append('subject', subject);
        if (role) form.append('role', role);
        if (details) form.append('details', details);
        form.append('products', JSON.stringify(products));
        form.append('payload', JSON.stringify(payload));
        form.append('website', website);
        form.append('resume', resume);
        request = { method: 'POST', body: form };
    } else {
        request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                name,
                email,
                phone,
                company,
                subject,
                role,
                details,
                products,
                payload,
                website,
            }),
        };
    }

    const response = await fetch('/api/enquiries/', request);
    if (!response.ok) throw new Error(await readError(response, 'Submitting your enquiry failed'));
}

/** All submissions, newest first. Needs a signed-in master session. */
export async function listSubmissions() {
    const response = await fetch('/api/submissions/', { cache: 'no-store' });
    if (response.status === 401) throw new Error('NOT_AUTHENTICATED');
    if (!response.ok) throw new Error(await readError(response, 'Loading submissions failed'));

    const { submissions } = await response.json();
    return submissions || [];
}

export async function updateSubmissionStatus(id, status) {
    const response = await fetch(`/api/submissions/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (response.status === 401) throw new Error('NOT_AUTHENTICATED');
    if (!response.ok) throw new Error(await readError(response, 'Updating the status failed'));
}

/** Where the master panel points a browser to download a stored CV. */
export function resumeUrl(submissionId) {
    return `/api/submissions/${submissionId}/resume/`;
}

// -- master session ---------------------------------------------------------

export async function masterSignIn(password) {
    const response = await fetch('/api/master/session/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error(await readError(response, 'Sign-in failed'));
    return true;
}

export async function masterSignOut() {
    await fetch('/api/master/session/', { method: 'DELETE' });
}

/** True when the httpOnly cookie from an earlier sign-in is still valid. */
export async function masterSessionIsActive() {
    try {
        const response = await fetch('/api/master/session/', { cache: 'no-store' });
        if (!response.ok) return false;
        const { authenticated } = await response.json();
        return Boolean(authenticated);
    } catch {
        return false;
    }
}
