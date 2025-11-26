import styles from './page.module.css';
import { getData } from '@/lib/data';

export default async function MenuPage() {
    const { menu } = await getData();
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Food & Drink</h1>
            <div className={styles.menuContainer}>
                {menu.map((category, index) => (
                    <section key={index} className={styles.category}>
                        <h2 className={styles.categoryTitle}>{category.title}</h2>
                        <div className={styles.items}>
                            {category.items.map((item, idx) => (
                                <div key={idx} className={styles.item}>
                                    <div className={styles.itemHeader}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <span className={styles.itemPrice}>$ {item.price}</span>
                                    </div>
                                    <p className={styles.itemDescription}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}
