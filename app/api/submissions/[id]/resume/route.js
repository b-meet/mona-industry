import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { requestIsAuthenticated } from '@/lib/master-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RESUME_BUCKET = 'applications';

/**
 * Streams an applicant's CV back through this origin.
 *
 * A Supabase signed URL would do the same job in one redirect, but it would put
 * the project's storage host back in the address bar. Downloading the object
 * server-side and handing on the bytes keeps every request on this domain.
 */
export async function GET(request, { params }) {
    if (!requestIsAuthenticated(request)) {
        return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const supabase = getSupabaseAdmin();

        const { data: row, error: readError } = await supabase
            .from('inquiries')
            .select('payload')
            .eq('id', id)
            .single();

        if (readError || !row) {
            return NextResponse.json({ error: 'No such submission.' }, { status: 404 });
        }

        const path = row.payload?.resume_path;
        if (!path) return NextResponse.json({ error: 'No CV on this row.' }, { status: 404 });

        const { data, error } = await supabase.storage.from(RESUME_BUCKET).download(path);
        if (error) throw new Error(error.message);

        const filename = (row.payload?.resume_name || path).replace(/["\\]/g, '');

        return new NextResponse(data, {
            headers: {
                'Content-Type': data.type || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'private, no-store',
            },
        });
    } catch (err) {
        console.error('[api/submissions/:id/resume]', err);
        return NextResponse.json({ error: 'Could not fetch that CV.' }, { status: 500 });
    }
}
