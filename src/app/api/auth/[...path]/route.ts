import { authApiHandler } from '@neondatabase/auth/next/server';

type Handlers = ReturnType<typeof authApiHandler>;
let handlers: Handlers | undefined;

// Created on first request rather than at import, so `next build` doesn't need NEON_AUTH_BASE_URL.
const getHandlers = () => (handlers ??= authApiHandler());

export const GET: Handlers['GET'] = (request, context) => getHandlers().GET(request, context);
export const POST: Handlers['POST'] = (request, context) => getHandlers().POST(request, context);
