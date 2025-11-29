import { getData } from '@/lib/data';
import styles from './page.module.css';

export default async function ContactPage() {
    const { rates } = await getData();

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Contact Us</h1>

            <div className={styles.container}>
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <h2 className={styles.infoTitle}>Location</h2>
                        <p className={styles.infoText}>241 Vaughan St</p>
                        <p className={styles.infoText}>Winnipeg, MB, Canada</p>
                    </div>

                    <div className={styles.infoBlock}>
                        <h2 className={styles.infoTitle}>Hours</h2>
                        <p className={styles.infoText}>Sun - Thu: 10am - 3am</p>
                        <p className={styles.infoText}>Fri - Sat: 10am - 4am</p>
                    </div>

                    <div className={styles.infoBlock}>
                        <h2 className={styles.infoTitle}>Contact</h2>
                        <p className={styles.infoText}>204-957-1293</p>
                    </div>
                </div>

                <div className={styles.ratesSection}>
                    <h2 className={styles.ratesTitle}>Billiard Rates</h2>
                    <div className={styles.ratesGrid}>
                        {rates.map((rate) => (
                            <div key={rate.id} className={styles.rateCard}>
                                <h3 className={styles.rateName}>{rate.title}</h3>
                                <div className={styles.ratePrice}>{rate.price}</div>
                                <p className={styles.rateDesc}>{rate.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
