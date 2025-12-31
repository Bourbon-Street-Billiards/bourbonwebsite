'use client';

import { useState } from 'react';
import { MenuCategory as MenuCategoryType } from '@/lib/data';
import MenuCategory from './MenuCategory';

interface MenuAccordionProps {
    menu: MenuCategoryType[];
}

export default function MenuAccordion({ menu }: MenuAccordionProps) {
    // Default to the first category (index 0) being open
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setActiveIndex(current => current === index ? null : index);
    };

    return (
        <>
            {menu.map((category, index) => (
                <MenuCategory
                    key={index}
                    category={category}
                    isOpen={activeIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </>
    );
}
