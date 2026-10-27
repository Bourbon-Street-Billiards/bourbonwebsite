'use client';

import { useId } from 'react';
import styles from './MenuCategory.module.scss';
import type { MenuCategory as MenuCategoryType } from '@/lib/data';
import { formatPrice } from '@/lib/format';

interface MenuCategoryProps {
    category: MenuCategoryType;
    isOpen: boolean;
    onToggle: () => void;
}

export default function MenuCategory({ category, isOpen, onToggle }: MenuCategoryProps) {
    const itemsId = useId();
    return (
        <section className={styles['category']}>
            <h2 className={styles['category__title']}>
                <button type="button" className={styles['category__toggle']} onClick={onToggle} aria-expanded={isOpen} aria-controls={itemsId}>
                    {category.title}
                    <span aria-hidden="true" className={`${styles['category__icon']} ${isOpen ? styles['category__icon--open'] : ''}`}>
                        ▼
                    </span>
                </button>
            </h2>
            <div id={itemsId} inert={!isOpen} className={`${styles['category__items']} ${!isOpen ? styles['closed'] : ''}`}>
                {category.items.map((item, idx) => (
                    <div key={idx} className={styles['item']}>
                        <div className={styles['item__header']}>
                            <h3 className={styles['item__name']}>{item.name}</h3>
                            <span className={styles['item__spacer']}></span>
                            <span className={styles['item__price']}>
                                {formatPrice(item.price)}
                            </span>
                        </div>
                        <p className={styles['item__desc']}>{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
