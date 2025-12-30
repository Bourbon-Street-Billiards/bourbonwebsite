import Skeleton from '@/components/ui/Skeleton';
import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles['loading']}>
            <div className={styles['loading__content']}>
                <Skeleton width={200} height={40} className={styles['loading__title']} />
                <div className={styles['loading__grid']}>
                    <Skeleton width="100%" height={200} />
                    <Skeleton width="100%" height={200} />
                    <Skeleton width="100%" height={200} />
                </div>
            </div>
        </div>
    );
}
