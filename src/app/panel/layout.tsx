import { redirect } from 'next/navigation';
import { authServer } from '@/lib/auth/server';

// Server-side gate: the client-side role check in page.tsx is only for UX.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = await authServer.getSession();

    if (!session?.user) redirect('/auth/sign-in');
    if (session.user.role !== 'admin') redirect('/dashboard');

    return children;
}
