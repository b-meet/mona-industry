import { NextResponse } from 'next/server';
import { getSupabaseAdmin, describeDbError } from '@/lib/supabase-server';
import { requestIsAuthenticated } from '@/lib/master-session';
import { isValidStatus } from '@/lib/submission-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Moves one submission to a new status. Requires a valid /master session. */
export async function PATCH(request, { params }) {
    if (!requestIsAuthenticated(request)) {
        return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    }

    const { id } = await params;

    let status;
    try {
        ({ status } = await request.json());
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseAdmin();

        // The allowed statuses depend on the row's type, so read it first
        // rather than trusting whatever the panel sent.
        const { data: row, error: readError } = await supabase
            .from('inquiries')
            .select('type')
            .eq('id', id)
            .single();

        if (readError) throw new Error(describeDbError(readError, 'Reading the submission'));
        if (!row) return NextResponse.json({ error: 'No such submission.' }, { status: 404 });

        if (!isValidStatus(row.type, status)) {
            return NextResponse.json(
                { error: `"${status}" is not a status a ${row.type} can be in.` },
                { status: 400 }
            );
        }

        const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
        if (error) throw new Error(describeDbError(error, 'Updating the status'));

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[api/submissions/:id]', err);
        return NextResponse.json({ error: 'Could not update the status.' }, { status: 500 });
    }
}
