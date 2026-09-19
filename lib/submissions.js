import { supabase } from '@/lib/supabase';

/**
 * Every message the site collects — product enquiries, general/support messages
 * and job applications — lands in one table, distinguished by `type`.
 *
 * These calls go straight to Supabase rather than through /api/*. The site is a
 * static export (`output: 'export'` in next.config.mjs), so no route handler is
 * deployed and a fetch to /api/... returns 404 in production.
 */
export const SUBMISSION_TYPES = {
    enquiry: 'Enquiry',
    support: 'Support',
    application: 'Application',
};

export const STATUS_OPTIONS = {
    enquiry: ['New', 'Contacted', 'In Progress', 'Quoted', 'Won', 'Lost'],
    support: ['New', 'Contacted', 'In Progress', 'Resolved', 'Closed'],
    application: ['New', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'],
};

export function statusOptionsFor(type) {
    return STATUS_OPTIONS[type] || STATUS_OPTIONS.enquiry;
}

const RESUME_BUCKET = 'applications';
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateResume(file) {
    if (!file) return null;
    if (file.size > MAX_RESUME_BYTES) return 'Your CV is larger than 5 MB. Please attach a smaller file.';
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) return 'Please attach a PDF or Word document.';
    return null;
}

/** Uploads a CV to the private bucket under an unguessable path. */
async function uploadResume(file) {
    const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'pdf';
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(`CV upload failed: ${error.message}`);

    return { resume_path: path, resume_name: file.name };
}

/** A time-limited link to a stored CV, for the master panel. */
export async function getResumeUrl(path, expiresInSeconds = 300) {
    const { data, error } = await supabase.storage
        .from(RESUME_BUCKET)
        .createSignedUrl(path, expiresInSeconds);

    if (error) throw new Error(error.message);
    return data.signedUrl;
}

/**
 * Writes one submission. `resume` (a File) is uploaded first when present, so a
 * failed upload never leaves a row pointing at a CV that isn't there.
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
}) {
    let resumeFields = {};
    if (resume) {
        resumeFields = await uploadResume(resume);
    }

    const { error } = await supabase.from('inquiries').insert([
        {
            type,
            name,
            email,
            phone,
            company,
            subject,
            role,
            details,
            status: 'New',
            product_list: products.length ? JSON.stringify(products) : null,
            payload: { ...payload, ...resumeFields },
        },
    ]);

    if (error) throw new Error(error.message);
}

/** All submissions, newest first. */
export async function listSubmissions() {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function updateSubmissionStatus(id, status) {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
}

/** Products are stored as a JSON string; tolerate bad or empty values. */
export function parseProducts(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}
