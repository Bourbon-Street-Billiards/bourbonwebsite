import styles from './page.module.scss';
import { getData } from '@/lib/data';

export default async function MenuPage() {
    const { menu } = await getData();
    return (

        <main className={styles['menu']}>
            <h1 className={styles['menu__title']}>Food & Drink</h1>
            <div className={styles['menu__container']}>
                {menu.map((category, index) => (
                    <section key={index} className={styles['menu__category']}>
                        <h2 className={styles['menu__category-title']}>{category.title}</h2>
                        <div className={styles['menu__items']}>
                            {category.items.map((item, idx) => (
                                <div key={idx} className={styles['menu__item']}>
                                    <div className={styles['menu__item-header']}>
                                        <h3 className={styles['menu__item-name']}>{item.name}</h3>
                                        <span className={styles['menu__item-spacer']}></span>
                                        <span className={styles['menu__item-price']}>$ {item.price}</span>
                                    </div>
                                    <p className={styles['menu__item-desc']}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}
