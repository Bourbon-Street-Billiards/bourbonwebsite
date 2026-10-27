import styles from './page.module.scss';
import { getData } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Events',
    description: 'Tournaments, live music and special nights at Bourbon Street Billiards in Winnipeg.',
};

// Content is edited in the admin panel, so read it from the database on every request.
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    const { events } = await getData();
    return (

        <main className={styles['events']}>
            <h1 className={styles['events__title']}>Upcoming Events</h1>
            <div className={styles['events__list']}>
                {events?.length ? events.map((event) => (
                    <div key={event.id} className={styles['events__card']}>
                        <div className={styles['events__card-date-box']}>
                            <span className={styles['events__card-date-text']}>{event.date}</span>
                        </div>
                        <div className={styles['events__card-content']}>
                            <h2 className={styles['events__card-title']}>{event.title}</h2>
                            <p className={styles['events__card-desc']}>{event.description}</p>
                        </div>
                    </div>
                )) : <p>No events found</p>}
            </div>
        </main>
    );
}
