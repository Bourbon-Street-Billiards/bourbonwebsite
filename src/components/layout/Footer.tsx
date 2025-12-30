'use client';

import styles from './Footer.module.scss';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const [isPanel, setIsPanel] = useState(false);

    useEffect(() => {
        if (pathname?.startsWith('/panel')) setIsPanel(true);
        else setIsPanel(false);
    }, [pathname]);

    return (
        <footer className={styles['footer'] + (isPanel ? ' ' + styles['footer--panel'] : '')}>
            <div className={styles['footer__container']}>
                <div className={styles['footer__section']}>
                    <h3 className={styles['footer__heading']}>Bourbon Street Billiards</h3>
                    <p className={styles['footer__text']}>Est.1962 - Best Tables in Winnipeg</p>
                </div>
                <div className={styles['footer__section']}>
                    <h4 className={styles['footer__subheading']}>Contact</h4>
                    <p className={styles['footer__text']}>241 Vaughan St, Winnipeg, MB, Canada</p>
                    <p className={styles['footer__text']}>204-957-1293</p>
                </div>
                <div className={styles['footer__section']}>
                    <h4 className={styles['footer__subheading']}>Hours</h4>
                    <p className={styles['footer__text']}>Sun-Thurs: 10am - 3am</p>
                    <p className={styles['footer__text']}>Fri-Sat: 10am - 4am</p>
                </div>
            </div>
            <div className={styles['footer__copyright']}>
                &copy; {new Date().getFullYear()} Bourbon Street Billiards. All rights reserved.
                <div className={styles['footer__credit']}>
                    Made by <a href="https://takiido.dev/" target="_blank" rel="noopener noreferrer" className={styles['footer__credit-link']}>Takiido</a>
                </div>
            </div>
        </footer>
    );
}
