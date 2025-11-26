import styles from './page.module.css';
import { getData } from '@/lib/data';

export default async function EventsPage() {
    const { events } = await getData();
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Upcoming Events</h1>
            <div className={styles.eventsList}>
                {events.map((event) => (
                    <div key={event.id} className={styles.eventCard}>
                        <div className={styles.dateBox}>
                            <span className={styles.dateText}>{event.date}</span>
                        </div>
                        <div className={styles.content}>
                            <h2 className={styles.eventTitle}>{event.title}</h2>
                            <p className={styles.description}>{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
