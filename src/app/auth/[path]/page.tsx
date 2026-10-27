import styles from './page.module.scss';
import { AuthView, authViewPaths } from '@neondatabase/auth/react';

export const dynamicParams = false;

// Required with dynamicParams = false, otherwise every /auth/* path 404s.
export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params;

    return (
        <main className={`${styles['auth']} auth-page-wrapper`}>
            <AuthView path={path} />
        </main>
    );
}
