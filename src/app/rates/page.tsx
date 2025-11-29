import { getData } from '@/lib/data';
import styles from './page.module.css';

export default async function RatesPage() {
    const { rates } = await getData();

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Billiard Rates</h1>
            <div className={styles.grid}>
                {rates.map((rate) => (
                    <div key={rate.id} className={styles.card}>
                        <h2 className={styles.cardTitle}>{rate.title}</h2>
                        <div className={styles.price}>{rate.price}</div>
                        <p className={styles.description}>{rate.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
