import styles from './page.module.scss';
import { getData } from '@/lib/data';
import MenuAccordion from '@/components/menu/MenuAccordion';

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
