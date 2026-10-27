import { NextResponse } from 'next/server';
import { getAuthServer } from './server';

// Only the fields isAdmin reads, so this accepts whatever session shape the auth client returns.
type Session = { user?: { role?: string | null } | null } | null | undefined;

// The single definition of who counts as an admin, shared by the API routes and the /panel gate.
export function isAdmin(session: Session): boolean {
    return session?.user?.role === 'admin';
}

// Returns the admin session, or null if the request isn't from a signed-in admin.
export async function getAdminSession() {
    const { data: session } = await getAuthServer().getSession();
    return isAdmin(session) ? session : null;
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
