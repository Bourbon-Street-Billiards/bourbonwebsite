import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function ContactPage() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Contact Us</h1>

            <div className={styles.container}>
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <h2 className={styles.infoTitle}>Location</h2>
                        <p className={styles.infoText}>123 Main St</p>
                        <p className={styles.infoText}>Anytown, USA 12345</p>
                    </div>

                    <div className={styles.infoBlock}>
                        <h2 className={styles.infoTitle}>Hours</h2>
                        <p className={styles.infoText}>Mon - Thu: 4pm - 12am</p>
                        <p className={styles.infoText}>Fri - Sat: 4pm - 2am</p>
                        <p className={styles.infoText}>Sun: 4pm - 12am</p>
                    </div>

                    <div className={styles.infoBlock}>
                        <h2 className={styles.infoTitle}>Contact</h2>
                        <p className={styles.infoText}>(555) 123-4567</p>
                        <p className={styles.infoText}>info@bourbonpoolhall.com</p>
                    </div>
                </div>

                <form className={styles.form}>
                    <h2 className={styles.formTitle}>Send us a message</h2>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Name</label>
                        <input type="text" id="name" className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>Message</label>
                        <textarea id="message" rows={5} className={styles.textarea} required></textarea>
                    </div>
                    <Button>Send Message</Button>
                </form>
            </div>
        </main>
    );
}
