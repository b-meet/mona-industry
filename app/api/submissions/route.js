import { NextResponse } from 'next/server';
import { getSupabaseAdmin, describeDbError } from '@/lib/supabase-server';
import { requestIsAuthenticated } from '@/lib/master-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Every submission, newest first. Requires a valid /master session. */
export async function GET(request) {
    if (!requestIsAuthenticated(request)) {
        return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    }

    try {
        const { data, error } = await getSupabaseAdmin()
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1000);

        if (error) throw new Error(describeDbError(error, 'Loading submissions'));

        return NextResponse.json({ submissions: data || [] });
    } catch (err) {
        console.error('[api/submissions]', err);
        return NextResponse.json({ error: 'Could not load submissions.' }, { status: 500 });
    }
}
