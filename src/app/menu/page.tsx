import styles from './page.module.scss';
import { getMenu, readOrEmpty } from '@/lib/data';
import MenuAccordion from '@/components/menu/MenuAccordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Food & Drink',
    description: 'Pub food, mains and cocktails served to your table at Bourbon Street Billiards.',
};

// Content is edited in the admin panel, so read it from the database on every request.
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
    const menu = await readOrEmpty(getMenu);
    return (

        <main className={styles['menu']}>
            <h1 className={styles['menu__title']}>Food & Drink</h1>
            <div className={styles['menu__container']}>
                <MenuAccordion menu={menu} />
            </div>
        </main>
    );
}
