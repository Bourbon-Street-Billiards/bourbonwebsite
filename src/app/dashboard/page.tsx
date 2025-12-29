'use client';

import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.css';

export default function UserDashboard() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/auth/sign-in');
        }
    }, [router, session, isPending]);

    if (isPending) {
        return (
            <main className={styles.main}>
                <div className={styles.card}>
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>User Dashboard</h1>
                <div className={styles.userInfo}>
                    <p><strong>Welcome,</strong> {session.user?.name || 'User'}</p>
                    <p><strong>Email:</strong> {session.user?.email}</p>
                    <p><strong>Role:</strong> {session.user?.role || 'user'}</p>
                </div>
                <div className={styles.actions}>
                    <button
                        onClick={() => authClient.signOut()}
                        className={styles.button}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </main>
    );
}
