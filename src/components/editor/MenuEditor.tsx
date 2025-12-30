'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { MenuCategory, MenuItem } from '@/lib/data';
import styles from '@/app/panel/page.module.scss';

interface MenuEditorProps {
    menu: MenuCategory[];
    onChange: (menu: MenuCategory[]) => void;
    loading: boolean;
    saving: boolean;
}

export default function MenuEditor({ menu, onChange, loading, saving }: MenuEditorProps) {
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');

    const [itemModal, setItemModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        catIndex: number;
        itemIndex?: number;
        data: MenuItem;
    }>({
        isOpen: false,
        mode: 'add',
        catIndex: -1,
        data: { name: '', price: '', description: '' }
    });

    const openAddItem = (catIndex: number) => {
        setItemModal({
            isOpen: true,
            mode: 'add',
            catIndex,
            data: { name: '', price: '', description: '' }
        });
    };

    const openEditItem = (catIndex: number, itemIndex: number, item: MenuItem) => {
        setItemModal({
            isOpen: true,
            mode: 'edit',
            catIndex,
            itemIndex,
            data: { ...item }
        });
    };

    const closeItemModal = () => {
        setItemModal({ ...itemModal, isOpen: false });
    };

    const saveItem = () => {
        const { catIndex, itemIndex, mode, data } = itemModal;
        if (!data.name || !data.price) return;

        const newMenu = [...menu];
        if (mode === 'add') {
            newMenu[catIndex].items.push(data);
        } else if (mode === 'edit' && itemIndex !== undefined) {
            newMenu[catIndex].items[itemIndex] = data;
        }
        onChange(newMenu);
        closeItemModal();
    };

    const addCategory = () => {
        if (!newCategoryTitle.trim()) return;
        const newMenu = [...menu, { title: newCategoryTitle, items: [] }];
        onChange(newMenu);
        setNewCategoryTitle('');
        setIsAddingCategory(false);
    };

    const deleteCategory = (index: number) => {
        if (confirm('Are you sure you want to delete this category and all its items?')) {
            const newMenu = menu.filter((_, i) => i !== index);
            onChange(newMenu);
        }
    };

    const deleteItem = (catIndex: number, itemIndex: number) => {
        if (confirm('Delete this item?')) {
            const newMenu = [...menu];
            newMenu[catIndex].items = newMenu[catIndex].items.filter((_, i) => i !== itemIndex);
            onChange(newMenu);
        }
    };

    return (
        <div className={styles['editor-content']}>
            <Button disabled={loading || saving} onClick={() => setIsAddingCategory(true)} variant="outline" className={styles['add-button']}>Add Category</Button>

            {isAddingCategory && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal']}>
                        <h3 className={styles['modal__title']}>New Category</h3>
                        <div className={styles['form-group']}>
                            <label className={styles['form-group__label']}>Category Title</label>
                            <input
                                className={styles['form-group__input']}
                                value={newCategoryTitle}
                                onChange={(e) => setNewCategoryTitle(e.target.value)}
                                placeholder="e.g., Starters"
                                autoFocus
                            />
                        </div>
                        <div className={styles['modal__actions']}>
                            <Button disabled={loading || saving} onClick={() => setIsAddingCategory(false)} variant="outline">Cancel</Button>
                            <Button disabled={loading || saving} onClick={addCategory}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {itemModal.isOpen && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal']}>
                        <h3 className={styles['modal__title']}>{itemModal.mode === 'add' ? 'Add Item' : 'Edit Item'}</h3>
                        <div className={styles['form-group']}>
                            <label className={styles['form-group__label']}>Name</label>
                            <input
                                className={styles['form-group__input']}
                                value={itemModal.data.name}
                                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, name: e.target.value } })}
                                placeholder="Item Name"
                                autoFocus
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label className={styles['form-group__label']}>Price</label>
                            <input
                                className={styles['form-group__input']}
                                value={itemModal.data.price}
                                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, price: e.target.value } })}
                                placeholder="$0.00"
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label className={styles['form-group__label']}>Description</label>
                            <textarea
                                className={styles['form-group__textarea']}
                                value={itemModal.data.description}
                                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, description: e.target.value } })}
                                placeholder="Description..."
                            />
                        </div>
                        <div className={styles['modal__actions']}>
                            <Button disabled={loading || saving} onClick={closeItemModal} variant="outline">Cancel</Button>
                            <Button disabled={loading || saving} onClick={saveItem}>{itemModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                        </div>
                    </div>
                </div>
            )}

            {menu.map((category, catIndex) => (
                <div key={catIndex} className={styles['category-block']}>
                    <div className={styles['category-block__header']} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', margin: 0 }}>
                            {category.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button disabled={loading || saving} onClick={() => openAddItem(catIndex)} variant="outline" className={styles['button--small']}>Add Item</Button>
                            <Button disabled={loading || saving} onClick={() => deleteCategory(catIndex)} variant="delete" className={styles['button--small']}>Delete Category</Button>
                        </div>
                    </div>
                    <div className={styles['card-grid']}>
                        {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles['compact-item']}>
                                <div className={styles['compact-item__info']}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <span className={styles['compact-item__name']}>{item.name}</span>
                                        <span className={styles['compact-item__price']}>${item.price}</span>
                                    </div>
                                    <span className={styles['compact-item__desc']}>{item.description}</span>
                                </div>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <Button
                                        disabled={loading || saving}
                                        onClick={() => openEditItem(catIndex, itemIndex, item)}
                                        variant="outline"
                                        className={styles['button--small']}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        disabled={loading || saving}
                                        onClick={() => deleteItem(catIndex, itemIndex)}
                                        variant="delete"
                                        className={styles['button--small']}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
