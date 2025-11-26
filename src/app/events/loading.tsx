import styles from './page.module.css';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Upcoming Events</h1>
            <div className={styles.eventsList}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.eventCard}>
                        <div className={styles.dateBox}>
                            <Skeleton width={120} height={24} />
                        </div>
                        <div className={styles.content}>
                            <Skeleton width="60%" height={32} style={{ marginBottom: '0.5rem' }} />
                            <Skeleton width="100%" height={20} style={{ marginBottom: '0.5rem' }} />
                            <Skeleton width="80%" height={20} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
