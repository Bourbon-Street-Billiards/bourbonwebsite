'use client';

import { useEffect, useId } from 'react';
import styles from '@/app/panel/page.module.scss';

interface EditorModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function EditorModal({ title, onClose, children }: EditorModalProps) {
    const titleId = useId();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal']} role="dialog" aria-modal="true" aria-labelledby={titleId}>
                <h3 id={titleId} className={styles['modal__title']}>{title}</h3>
                {children}
            </div>
        </div>
    );
}
