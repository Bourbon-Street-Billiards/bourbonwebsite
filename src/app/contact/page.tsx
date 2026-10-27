import { getData } from '@/lib/data';
import styles from './page.module.scss';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact & Hours',
    description: 'Address, hours, phone and table rates for Bourbon Street Billiards, 241 Vaughan St, Winnipeg.',
};

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
                        <p className={styles['contact__info-text']}>{site.street}</p>
                        <p className={styles['contact__info-text']}>{site.city}</p>
                        <div className={styles['contact__map']}>
                            <iframe
                                title="Map to Bourbon Street Billiards"
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
                        {site.hours.map(({ days, time }) => (
                            <p key={days} className={styles['contact__info-text']}>{days}: {time}</p>
                        ))}
                    </div>

                    <div className={styles['contact__info-block']}>
                        <h2 className={styles['contact__info-title']}>Contact</h2>
                        <p className={styles['contact__info-text']}><a href={site.phoneHref}>{site.phone}</a></p>
                    </div>
                </div>

                <div className={styles['contact__rates']}>
                    <h2 className={styles['contact__rates-title']}>Billiard Rates</h2>
                    <div className={styles['contact__rates-grid']}>
                        {rates.map((rate) => (
                            <div key={rate.id} className={styles['contact__rate-card']}>
                                <h3 className={styles['contact__rate-name']}>{rate.title}</h3>
                                <div className={styles['contact__rate-price']}>{formatPrice(rate.price)}</div>
                                <p className={styles['contact__rate-desc']}>{rate.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
