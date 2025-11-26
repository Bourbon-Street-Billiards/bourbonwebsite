'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for MVP
        if (password === 'admin123') {
            // Set a cookie or local storage to persist login state
            // For simplicity, we'll just redirect and assume the dashboard checks this or is open
            // In a real app, we'd use proper auth
            document.cookie = 'admin_auth=true; path=/';
            router.push('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <h1 className={styles.title}>Admin Login</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <Button className={styles.button}>Login</Button>
                </form>
            </div>
        </main>
    );
}
