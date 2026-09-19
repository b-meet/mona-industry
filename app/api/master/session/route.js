import { NextResponse } from 'next/server';
import {
    SESSION_COOKIE,
    isMasterConfigured,
    passwordMatches,
    issueSession,
    requestIsAuthenticated,
} from '@/lib/master-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Whether the caller's cookie is still good — used to restore a session. */
export async function GET(request) {
    return NextResponse.json({ authenticated: requestIsAuthenticated(request) });
}

export async function POST(request) {
    if (!isMasterConfigured) {
        return NextResponse.json(
            { error: 'MASTER_PASSWORD is not set for this deployment.' },
            { status: 500 }
        );
    }

    let password;
    try {
        ({ password } = await request.json());
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    if (!passwordMatches(password)) {
        return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const session = issueSession();
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(SESSION_COOKIE, session.value, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: session.maxAge,
    });
    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ authenticated: false });
    response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
}
