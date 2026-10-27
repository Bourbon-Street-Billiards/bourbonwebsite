import { getData } from '@/lib/data';
import styles from './page.module.scss';

// Content is edited in the admin panel, so read it from the database on every request.
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const { rates } = await getData();

    return (

        <main className={styles['contact']}>
            <h1 className={styles['contact__title']}>Contact Us</h1>

            <div className={styles['contact__container']}>
                <div className={styles['contact__info']}>
                    <div className={styles['contact__info-block']}>
                        <h2 className={styles['contact__info-title']}>Location</h2>
                        <p className={styles['contact__info-text']}>241 Vaughan St</p>
                        <p className={styles['contact__info-text']}>Winnipeg, MB, Canada</p>
                        <div className={styles['contact__map']}>
                            <iframe
                                src="https://maps.google.com/maps?q=Bourbon%20Street%20Billiards%20241%20Vaughan%20St%20Winnipeg%20MB&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    <div className={styles['contact__info-block']}>
                        <h2 className={styles['contact__info-title']}>Hours</h2>
                        <p className={styles['contact__info-text']}>Sun - Thu: 10am - 3am</p>
                        <p className={styles['contact__info-text']}>Fri - Sat: 10am - 4am</p>
                    </div>

                    <div className={styles['contact__info-block']}>
                        <h2 className={styles['contact__info-title']}>Contact</h2>
                        <p className={styles['contact__info-text']}>204-957-1293</p>
                    </div>
                </div>

                <div className={styles['contact__rates']}>
                    <h2 className={styles['contact__rates-title']}>Billiard Rates</h2>
                    <div className={styles['contact__rates-grid']}>
                        {rates.map((rate) => (
                            <div key={rate.id} className={styles['contact__rate-card']}>
                                <h3 className={styles['contact__rate-name']}>{rate.title}</h3>
                                <div className={styles['contact__rate-price']}>{rate.price}</div>
                                <p className={styles['contact__rate-desc']}>{rate.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
