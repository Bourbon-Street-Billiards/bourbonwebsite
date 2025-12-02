'use client';

import styles from './Footer.module.css';
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
        <footer className={styles.footer + (isPanel ? ' ' + styles.panelFooter : '')}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h3 className={styles.heading}>Bourbon Street Billiards</h3>
                    <p className={styles.text}>Est.1962 - Best Tables in Winnipeg</p>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.subheading}>Contact</h4>
                    <p className={styles.text}>241 Vaughan St, Winnipeg, MB, Canada</p>
                    <p className={styles.text}>204-957-1293</p>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.subheading}>Hours</h4>
                    <p className={styles.text}>Sun-Thurs: 10am - 3am</p>
                    <p className={styles.text}>Fri-Sat: 10am - 4am</p>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Bourbon Street Billiards. All rights reserved.
                <div className={styles.credit}>
                    Made by <a href="https://takiido.dev/" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>Takiido</a>
                </div>
            </div>
        </footer>
    );
}
