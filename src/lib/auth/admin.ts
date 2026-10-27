import { NextResponse } from 'next/server';
import { authServer } from './server';

// Returns the admin session, or null if the request isn't from a signed-in admin.
export async function getAdminSession() {
    const { data: session } = await authServer.getSession();
    if (!session?.user || session.user.role !== 'admin') return null;
    return session;
}

// Use at the top of route handlers: `const denied = await requireAdmin(); if (denied) return denied;`
export async function requireAdmin(): Promise<NextResponse | null> {
    try {
        const session = await getAdminSession();
        if (session) return null;
    } catch (error) {
        console.error('Auth check failed:', error);
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
