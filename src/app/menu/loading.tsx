import Skeleton from '@/components/ui/Skeleton';
import styles from '../loading.module.scss';
import pageStyles from './page.module.scss';

export default function Loading() {
    return (
        <div className={pageStyles['menu']}>
            <h1 className={pageStyles['menu__title']}>Food & Drink</h1>
            <div className={pageStyles['menu__container']}>
                {[1, 2].map((section) => (
                    <section className={pageStyles['menu__category']} key={section}>
                        <Skeleton width={107} height={80} className={styles['category__title']} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} width="100%" height={135} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
