import { redirect } from 'next/navigation';
import { getAuthServer } from '@/lib/auth/server';
import { isAdmin } from '@/lib/auth/admin';

// Server-side gate: the client-side role check in page.tsx is only for UX.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = await getAuthServer().getSession();

    if (!session?.user) redirect('/auth/sign-in');
    if (!isAdmin(session)) redirect('/dashboard');

    return children;
}
