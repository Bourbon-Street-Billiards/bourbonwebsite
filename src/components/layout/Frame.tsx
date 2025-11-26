'use client';

import { usePathname } from 'next/navigation';
import styles from './Frame.module.css';

export default function Frame() {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) return null;

    return (
        <div className={styles.frameContainer}>
            <div className={styles.cornerTL}></div>
            <div className={styles.cornerTR}></div>
            <div className={styles.cornerBL}></div>
            <div className={styles.cornerBR}></div>

            <div className={styles.verticalTextLeft}>
                EST. IN MCMLXII
            </div>
            <div className={styles.verticalTextRight}>
                BOURBON STREET BILLIARDS
            </div>
        </div>
    );
}
