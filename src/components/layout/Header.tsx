'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
                    <img
                        src="/assets/logo.png"
                        alt="Bourbon Pool Hall"
                        width={120}
                        height={32}
                        className={styles.logoImage}
                    />
                </Link>

                <button className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} onClick={toggleMenu}>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </button>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <div className={styles.navLinks}>
                        <Link href="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/events" className={styles.link} onClick={() => setIsMenuOpen(false)}>Events</Link>
                        <Link href="/gallery" className={styles.link} onClick={() => setIsMenuOpen(false)}>Gallery</Link>
                        <Link href="/menu" className={styles.link} onClick={() => setIsMenuOpen(false)}>Menu</Link>
                        <Link href="/league" className={styles.link} onClick={() => setIsMenuOpen(false)}>League</Link>
                    </div>
                    <Link href="/contact" className={styles.bookButton} onClick={() => setIsMenuOpen(false)}>Book Now</Link>
                </nav>
            </div>
        </header>
    );
}
