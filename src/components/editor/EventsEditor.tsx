'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import EditorModal from '@/components/editor/EditorModal';
import EditorCard from '@/components/editor/card/EditorCard';
import type { Event } from '@/lib/data';
import styles from '@/app/panel/page.module.scss';

interface EventsEditorProps {
    events: Event[];
    onChange: (events: Event[]) => void;
    saving: boolean;
    loading: boolean;
}

export default function EventsEditor({ events, onChange, saving, loading }: EventsEditorProps) {
    const [eventModal, setEventModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        index?: number;
        data: Event;
    }>({
        isOpen: false,
        mode: 'add',
        data: { id: 0, title: '', date: '', description: '' }
    });

    const openAddEvent = () => {
        setEventModal({
            isOpen: true,
            mode: 'add',
            data: { id: Math.floor(Math.random() * 1000000000), title: '', date: '', description: '' }
        });
    };

    const openEditEvent = (index: number, event: Event) => {
        setEventModal({
            isOpen: true,
            mode: 'edit',
            index,
            data: { ...event }
        });
    };

    const closeEventModal = () => {
        setEventModal({ ...eventModal, isOpen: false });
    };

    const saveEvent = () => {
        const { index, mode, data } = eventModal;
        if (!data.title || !data.date) return;

        const newEvents = [...events];
        if (mode === 'add') {
            newEvents.push(data);
        } else if (mode === 'edit' && index !== undefined) {
            newEvents[index] = data;
        }
        onChange(newEvents);
        closeEventModal();
    };

    const removeEvent = (index: number) => {
        if (confirm('Delete this event?')) {
            const newEvents = events.filter((_, i) => i !== index);
            onChange(newEvents);
        }
    };

    return (
        <div className={styles['editor-content']}>
            <Button disabled={loading || saving} onClick={openAddEvent} variant="outline" className={styles['add-button']}>Add Event</Button>

            {eventModal.isOpen && (
                <EditorModal title={eventModal.mode === 'add' ? 'Add Event' : 'Edit Event'} onClose={closeEventModal}>
                    <div className={styles['form-group']}>
                        <label htmlFor="event-title" className={styles['form-group__label']}>Title</label>
                        <input
                            id="event-title"
                            className={styles['form-group__input']}
                            value={eventModal.data.title}
                            onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, title: e.target.value } })}
                            placeholder="Event Title"
                            autoFocus
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="event-date" className={styles['form-group__label']}>Date</label>
                        <input
                            id="event-date"
                            className={styles['form-group__input']}
                            value={eventModal.data.date}
                            onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, date: e.target.value } })}
                            placeholder="e.g., Oct 12, 8PM or Every Thursday, 7PM"
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="event-description" className={styles['form-group__label']}>Description</label>
                        <textarea
                            id="event-description"
                            className={styles['form-group__textarea']}
                            value={eventModal.data.description}
                            onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, description: e.target.value } })}
                            placeholder="Event details..."
                        />
                    </div>
                    <div className={styles['modal__actions']}>
                        <Button onClick={closeEventModal} variant="outline">Cancel</Button>
                        <Button onClick={saveEvent}>{eventModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                    </div>
                </EditorModal>
            )}

            <div className={styles['card-grid']}>
                {events.map((event, index) => (
                    <EditorCard key={event.id} data={event} index={index} openEditEvent={openEditEvent} removeEvent={removeEvent} loading={loading} saving={saving} />
                ))}
            </div>
        </div>
    );
}
