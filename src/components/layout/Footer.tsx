import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h3 className={styles.heading}>Bourbon Pool Hall</h3>
                    <p className={styles.text}>Where elegance meets the game.</p>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.subheading}>Contact</h4>
                    <p className={styles.text}>123 Main St, Anytown, USA</p>
                    <p className={styles.text}>(555) 123-4567</p>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.subheading}>Hours</h4>
                    <p className={styles.text}>Mon-Sun: 4pm - 2am</p>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Bourbon Pool Hall. All rights reserved.
                <div className={styles.credit}>
                    Made by <a href="https://takiido.dev/" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>Takiido</a>
                </div>
            </div>
        </footer>
    );
}
