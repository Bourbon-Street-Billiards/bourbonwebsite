'use client';

import styles from './MenuCategory.module.scss';
import { MenuCategory as MenuCategoryType } from '@/lib/data';

interface MenuCategoryProps {
    category: MenuCategoryType;
    isOpen: boolean;
    onToggle: () => void;
}

export default function MenuCategory({ category, isOpen, onToggle }: MenuCategoryProps) {
    return (
        <section className={styles['category']}>
            <h2 className={styles['category__title']} onClick={onToggle}>
                {category.title}
                <span className={`${styles['category__icon']} ${isOpen ? styles['category__icon--open'] : ''}`}>
                    ▼
                </span>
            </h2>
            <div className={`${styles['category__items']} ${!isOpen ? styles['closed'] : ''}`}>
                {category.items.map((item, idx) => (
                    <div key={idx} className={styles['item']}>
                        <div className={styles['item__header']}>
                            <h3 className={styles['item__name']}>{item.name}</h3>
                            <span className={styles['item__spacer']}></span>
                            <span className={styles['item__price']}>
                                $ {item.price.length < 3 ? item.price + '.00' : item.price}
                            </span>
                        </div>
                        <p className={styles['item__desc']}>{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
