'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

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
        <header className={`${styles['header']} ${isScrolled ? styles['header--scrolled'] : ''}`}>
            <div className={styles['header__container']}>
                <Link href="/" className={styles['header__logo']} onClick={() => setIsMenuOpen(false)}>
                    <Image
                        src="/assets/logo.png"
                        alt="Bourbon Street Billiards"
                        width={120}
                        height={32}
                        className={styles['header__logo-image']}
                        priority
                    />
                </Link>

                <button className={`${styles['header__hamburger']} ${isMenuOpen ? styles['header__hamburger--active'] : ''}`} onClick={toggleMenu}>
                    <span className={styles['header__hamburger-bar']}></span>
                    <span className={styles['header__hamburger-bar']}></span>
                    <span className={styles['header__hamburger-bar']}></span>
                </button>

                <nav className={`${styles['header__nav']} ${isMenuOpen ? styles['header__nav--open'] : ''}`}>
                    <div className={styles['header__nav-links']}>
                        <Link href="/" className={styles['header__nav-link']} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/events" className={styles['header__nav-link']} onClick={() => setIsMenuOpen(false)}>Events</Link>
                        <Link href="/gallery" className={styles['header__nav-link']} onClick={() => setIsMenuOpen(false)}>Gallery</Link>
                        <Link href="/menu" className={styles['header__nav-link']} onClick={() => setIsMenuOpen(false)}>Menu</Link>
                        <Link href="/league" className={styles['header__nav-link']} onClick={() => setIsMenuOpen(false)}>League</Link>
                    </div>
                    <Link href="/contact" className={styles['header__book-button']} onClick={() => setIsMenuOpen(false)}>Book Now</Link>
                </nav>
            </div>
        </header>
    );
}
