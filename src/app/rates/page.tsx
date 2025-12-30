import { getData } from '@/lib/data';
import styles from './page.module.scss';

export default async function RatesPage() {
    const { rates } = await getData();

    return (

        <main className={styles['rates']}>
            <h1 className={styles['rates__title']}>Billiard Rates</h1>
            <div className={styles['rates__grid']}>
                {rates.map((rate) => (
                    <div key={rate.id} className={styles['rates__card']}>
                        <h2 className={styles['rates__card-title']}>{rate.title}</h2>
                        <div className={styles['rates__card-price']}>{rate.price}</div>
                        <p className={styles['rates__card-desc']}>{rate.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
