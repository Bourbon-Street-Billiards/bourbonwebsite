import styles from './page.module.scss';
import { getData } from '@/lib/data';
import MenuAccordion from '@/components/menu/MenuAccordion';

// Content is edited in the admin panel, so read it from the database on every request.
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
    const { menu } = await getData();
    return (

        <main className={styles['menu']}>
            <h1 className={styles['menu__title']}>Food & Drink</h1>
            <div className={styles['menu__container']}>
                <MenuAccordion menu={menu} />
            </div>
        </main>
    );
}
