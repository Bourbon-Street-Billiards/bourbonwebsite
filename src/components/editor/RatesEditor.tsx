'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import EditorModal from '@/components/editor/EditorModal';
import type { BilliardRate } from '@/lib/data';
import styles from '@/app/panel/page.module.scss';
import { LIMITS } from '@/lib/validation';
import { formatPrice } from '@/lib/format';

interface RatesEditorProps {
    rates: BilliardRate[];
    onChange: (rates: BilliardRate[]) => void;
    loading: boolean;
    saving: boolean;
}

export default function RatesEditor({ rates, onChange, loading, saving }: RatesEditorProps) {
    const [rateModal, setRateModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        index?: number;
        data: BilliardRate;
    }>({
        isOpen: false,
        mode: 'add',
        data: { id: 0, title: '', price: '', description: '' }
    });

    const openAddRate = () => {
        setRateModal({
            isOpen: true,
            mode: 'add',
            data: { id: Math.floor(Math.random() * 1000000000), title: '', price: '', description: '' }
        });
    };

    const openEditRate = (index: number, rate: BilliardRate) => {
        setRateModal({
            isOpen: true,
            mode: 'edit',
            index,
            data: { ...rate }
        });
    };

    const closeRateModal = () => {
        setRateModal({ ...rateModal, isOpen: false });
    };

    const saveRate = () => {
        const { index, mode } = rateModal;
        const data = { ...rateModal.data, title: rateModal.data.title.trim(), price: rateModal.data.price.trim() };
        if (!data.title || !data.price) return;

        const newRates = [...rates];
        if (mode === 'add') {
            newRates.push(data);
        } else if (mode === 'edit' && index !== undefined) {
            newRates[index] = data;
        }
        onChange(newRates);
        closeRateModal();
    };

    const removeRate = (index: number) => {
        if (confirm('Delete this rate?')) {
            const newRates = rates.filter((_, i) => i !== index);
            onChange(newRates);
        }
    };


    return (
        <div>
            <Button disabled={loading || saving} onClick={openAddRate} variant="outline" className={styles['add-button']}>Add Rate</Button>

            {rateModal.isOpen && (
                <EditorModal title={rateModal.mode === 'add' ? 'Add Rate' : 'Edit Rate'} onClose={closeRateModal}>
                    <div className={styles['form-group']}>
                        <label htmlFor="rate-title" className={styles['form-group__label']}>Title</label>
                        <input
                            id="rate-title"
                            maxLength={LIMITS.title}
                            className={styles['form-group__input']}
                            value={rateModal.data.title}
                            onChange={(e) => setRateModal({ ...rateModal, data: { ...rateModal.data, title: e.target.value } })}
                            placeholder="e.g., Hourly Rate"
                            autoFocus
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="rate-price" className={styles['form-group__label']}>Price</label>
                        <input
                            id="rate-price"
                            maxLength={LIMITS.price}
                            className={styles['form-group__input']}
                            value={rateModal.data.price}
                            onChange={(e) => setRateModal({ ...rateModal, data: { ...rateModal.data, price: e.target.value } })}
                            placeholder="$0.00"
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="rate-description" className={styles['form-group__label']}>Description</label>
                        <textarea
                            id="rate-description"
                            maxLength={LIMITS.description}
                            className={styles['form-group__textarea']}
                            value={rateModal.data.description}
                            onChange={(e) => setRateModal({ ...rateModal, data: { ...rateModal.data, description: e.target.value } })}
                            placeholder="Details..."
                        />
                    </div>
                    <div className={styles['modal__actions']}>
                        <Button onClick={closeRateModal} variant="outline">Cancel</Button>
                        <Button onClick={saveRate}>{rateModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                    </div>
                </EditorModal>
            )}

            <div className={styles['card-grid']}>
                {rates.map((rate, index) => (
                    <div key={rate.id} className={styles['compact-item']}>
                        <div className={styles['compact-item__info']}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                                <span className={styles['compact-item__name']}>{rate.title}</span>
                                <span className={styles['compact-item__price']}>{formatPrice(rate.price)}</span>
                            </div>
                            <span className={styles['compact-item__desc']}>{rate.description}</span>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <Button disabled={loading || saving} onClick={() => openEditRate(index, rate)} variant="outline" className={styles['button--small']}>Edit</Button>
                            <Button disabled={loading || saving} onClick={() => removeRate(index)} variant="delete" className={styles['button--small']}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
