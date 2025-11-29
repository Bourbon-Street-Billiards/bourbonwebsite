import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    // Clear auth token
    cookieStore.delete('auth_token');

    // Clear client-side auth state
    cookieStore.delete('admin_auth');

    return NextResponse.json({ success: true });
}
