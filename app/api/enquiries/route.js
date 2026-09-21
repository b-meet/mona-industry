import { NextResponse, after } from 'next/server';
import {
    getSupabaseAdmin,
    describeDbError,
    classifyError,
    diagnoseSubmissions,
} from '@/lib/supabase-server';
import { requestIsAuthenticated } from '@/lib/master-session';
import { notifySubmission } from '@/lib/notify';
import {
    SUBMISSION_TYPES,
    MAX_RESUME_BYTES,
    ALLOWED_RESUME_TYPES,
} from '@/lib/submission-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RESUME_BUCKET = 'applications';
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const LIMITS = {
    name: 200,
    email: 320,
    phone: 40,
    company: 200,
    subject: 300,
    role: 200,
    details: 5000,
};

function clean(value, limit) {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    if (!text) return null;
    return text.slice(0, limit);
}

/**
 * Both shapes arrive here: enquiry and support messages as JSON, job
 * applications as multipart/form-data so the CV can ride along.
 */
async function readBody(request) {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
        const form = await request.formData();
        const payload = form.get('payload');
        return {
            fields: {
                type: form.get('type'),
                name: form.get('name'),
                email: form.get('email'),
                phone: form.get('phone'),
                company: form.get('company'),
                subject: form.get('subject'),
                role: form.get('role'),
                details: form.get('details'),
                website: form.get('website'),
                products: form.get('products') ? JSON.parse(form.get('products')) : [],
                payload: payload ? JSON.parse(payload) : {},
            },
            resume: form.get('resume') || null,
        };
    }

    return { fields: await request.json(), resume: null };
}

function validate({ fields, resume }) {
    const type = fields.type || 'enquiry';
    if (!Object.keys(SUBMISSION_TYPES).includes(type)) return 'Unknown submission type.';

    const name = clean(fields.name, LIMITS.name);
    const email = clean(fields.email, LIMITS.email);
    if (!name) return 'Please tell us your name.';
    if (!email || !EMAIL_PATTERN.test(email)) return 'Please give a valid email address.';

    // A honeypot field the real form leaves empty. Bots fill every input they
    // find, so anything here is automated traffic.
    if (clean(fields.website, 200)) return 'Rejected.';

    if (resume) {
        if (typeof resume.size !== 'number' || resume.size > MAX_RESUME_BYTES) {
            return 'Your CV is larger than 4 MB. Please attach a smaller file.';
        }
        if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
            return 'Please attach a PDF or Word document.';
        }
    }

    return null;
}

/** Uploads a CV to the private bucket under an unguessable path. */
async function uploadResume(supabase, file) {
    const extension = file.name?.includes('.') ? file.name.split('.').pop().toLowerCase() : 'pdf';
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(path, Buffer.from(await file.arrayBuffer()), {
            contentType: file.type,
            upsert: false,
        });

    if (error) throw new Error(`CV upload failed: ${error.message}`);

    return { resume_path: path, resume_name: file.name };
}

export async function POST(request) {
    let body;
    try {
        body = await readBody(request);
    } catch {
        return NextResponse.json({ error: 'We could not read that submission.' }, { status: 400 });
    }

    const problem = validate(body);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const { fields, resume } = body;
    const products = Array.isArray(fields.products) ? fields.products.slice(0, 50) : [];

    try {
        const supabase = getSupabaseAdmin();

        // Uploaded first, so a failed upload never leaves a row pointing at a
        // CV that is not there.
        const resumeFields = resume ? await uploadResume(supabase, resume) : {};

        const record = {
            type: fields.type || 'enquiry',
            name: clean(fields.name, LIMITS.name),
            email: clean(fields.email, LIMITS.email),
            phone: clean(fields.phone, LIMITS.phone),
            company: clean(fields.company, LIMITS.company),
            subject: clean(fields.subject, LIMITS.subject),
            role: clean(fields.role, LIMITS.role),
            details: clean(fields.details, LIMITS.details),
        };

        const { error } = await supabase.from('inquiries').insert([
            {
                ...record,
                status: 'New',
                product_list: products.length ? JSON.stringify(products) : null,
                payload: { ...(fields.payload || {}), ...resumeFields },
            },
        ]);

        if (error) {
            // Carry the PostgREST code across the wrap, so the response can
            // still say which kind of failure this was.
            const wrapped = new Error(describeDbError(error, 'Storing the submission'));
            wrapped.code = error.code;
            throw wrapped;
        }

        // After the response, so a slow Bot API call never keeps the visitor
        // waiting. notifySubmission swallows its own failures: the row is
        // already stored, and the panel at /master remains the record.
        after(() =>
            notifySubmission({ ...record, products, resumeName: resumeFields.resume_name })
        );

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err) {
        // The detail stays in the server log; the visitor gets a plain message
        // plus a one-word code, which is enough for whoever runs the site to
        // tell a missing env var from an unrun migration without a log.
        console.error('[api/enquiries]', err);
        return NextResponse.json(
            {
                error: 'We could not save your submission just now.',
                code: classifyError(err),
            },
            { status: 500 }
        );
    }
}

/**
 * Why the form is failing, for whoever runs the site. Behind the /master
 * session, because it names the project host and the state of the schema.
 * Sign in at /master, then open /api/enquiries/.
 */
export async function GET(request) {
    if (!requestIsAuthenticated(request)) {
        return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    }

    return NextResponse.json(await diagnoseSubmissions(), {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
    });
}
