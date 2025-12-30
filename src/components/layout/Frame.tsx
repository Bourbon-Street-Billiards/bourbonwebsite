'use client';

import { usePathname } from 'next/navigation';
import styles from './Frame.module.scss';

export default function Frame() {
    const pathname = usePathname();

    if (pathname?.startsWith('/panel')) return null;

    return (
        <div className={styles['frame']}>
            <div className={`${styles['frame__corner']} ${styles['frame__corner--tl']}`}></div>
            <div className={`${styles['frame__corner']} ${styles['frame__corner--tr']}`}></div>
            <div className={`${styles['frame__corner']} ${styles['frame__corner--bl']}`}></div>
            <div className={`${styles['frame__corner']} ${styles['frame__corner--br']}`}></div>

            <div className={`${styles['frame__text']} ${styles['frame__text--left']}`}>
                EST. IN MCMLXII
            </div>
            <div className={`${styles['frame__text']} ${styles['frame__text--right']}`}>
                BOURBON STREET BILLIARDS
            </div>
        </div>
    );
}
