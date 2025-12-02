import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    // Only protect /panel routes
    if (request.nextUrl.pathname.startsWith('/panel')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/panel/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/panel/login', request.url));
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.redirect(new URL('/panel/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/panel/:path*',
};
