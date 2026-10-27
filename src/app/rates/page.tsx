import { getRates, readOrEmpty } from '@/lib/data';
import styles from './page.module.scss';
import { formatPrice } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Billiard Rates',
    description: 'Table rates for pool and snooker at Bourbon Street Billiards.',
};

// Content is edited in the admin panel, so read it from the database on every request.
export const dynamic = 'force-dynamic';

export default async function RatesPage() {
    const rates = await readOrEmpty(getRates);

    return (

        <main className={styles['rates']}>
            <h1 className={styles['rates__title']}>Billiard Rates</h1>
            <div className={styles['rates__grid']}>
                {rates.map((rate) => (
                    <div key={rate.id} className={styles['rates__card']}>
                        <h2 className={styles['rates__card-title']}>{rate.title}</h2>
                        <div className={styles['rates__card-price']}>{formatPrice(rate.price)}</div>
                        <p className={styles['rates__card-desc']}>{rate.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
