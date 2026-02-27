import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password } = await request.json();

        // Check against environment variable, with a fallback just in case it's not set
        const adminPassword = process.env.ADMIN_PASSWORD || 'mona_admin_fallback';

        if (password === adminPassword) {
            return NextResponse.json({ success: true, message: 'Authenticated' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
