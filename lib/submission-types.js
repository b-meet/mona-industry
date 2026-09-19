/**
 * Shapes shared by the browser and the route handlers. Kept free of any
 * Supabase import so both sides can use it.
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

export function isValidStatus(type, status) {
    return statusOptionsFor(type).includes(status);
}

/**
 * Vercel's serverless functions reject request bodies above ~4.5 MB, and a CV
 * now travels through one on its way to storage, so the cap sits below that.
 */
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export const ALLOWED_RESUME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateResume(file) {
    if (!file) return null;
    if (file.size > MAX_RESUME_BYTES) return 'Your CV is larger than 4 MB. Please attach a smaller file.';
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) return 'Please attach a PDF or Word document.';
    return null;
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
