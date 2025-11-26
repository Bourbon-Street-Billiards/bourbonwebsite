import styles from './page.module.css';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Food & Drink</h1>
            <div className={styles.menuContainer}>
                {[1, 2, 3].map((category) => (
                    <section key={category} className={styles.category}>
                        <div style={{ marginBottom: '2rem' }}>
                            <Skeleton width={200} height={40} />
                        </div>
                        <div className={styles.items}>
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className={styles.item}>
                                    <div className={styles.itemHeader}>
                                        <Skeleton width={150} height={24} />
                                        <Skeleton width={60} height={24} />
                                    </div>
                                    <Skeleton width="100%" height={16} />
                                    <Skeleton width="80%" height={16} style={{ marginTop: '0.5rem' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}
