import { createAuthServer } from '@neondatabase/auth/next/server';

let authServer: ReturnType<typeof createAuthServer> | undefined;

// Created on first use rather than at import: createAuthServer() throws without NEON_AUTH_BASE_URL,
// and Next.js imports every route during `next build`, so an eager instance fails builds
// in environments that don't have the auth secrets.
export function getAuthServer() {
    authServer ??= createAuthServer();
    return authServer;
}
