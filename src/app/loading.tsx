import Skeleton from '@/components/ui/Skeleton';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Skeleton width={200} height={40} className={styles.title} />
                <div className={styles.grid}>
                    <Skeleton width="100%" height={200} />
                    <Skeleton width="100%" height={200} />
                    <Skeleton width="100%" height={200} />
                </div>
            </div>
        </div>
    );
}
