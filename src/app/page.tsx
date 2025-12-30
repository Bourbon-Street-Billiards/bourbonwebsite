import Button from '@/components/ui/Button';
import styles from './page.module.scss';
import Link from 'next/link';

export default function Home() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles['hero__content']}>
                    <h1 className={styles['hero__title']}>Bourbon Street Billiards</h1>
                    <p className={styles['hero__subtitle']}>Best Pool Hall in Winnipeg</p>
                    <div className={styles['hero__cta-group']}>
                        <Button href="/events" className={styles['hero__button']}>View Events</Button>
                        <Button href="/menu" variant="outline" className={styles['hero__button']}>See Menu</Button>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles['features__card']}>
                    <h2 className={styles['features__card-title']}>Professional Tables</h2>
                    <p className={styles['features__card-text']}>Play on 11 billiard tables, 5 full-size snooker tables, and 6 coin-operated bar boxes — each maintained daily to ensure a smooth, consistent roll.</p>
                </div>
                <div className={styles['features__card']}>
                    <h2 className={styles['features__card-title']}>Weekly Specials</h2>
                    <p className={styles['features__card-text']}>Enjoy our Monday Special for two players and discounted rates every Sunday.</p>
                </div>
                <div className={styles['features__card']}>
                    <h2 className={styles['features__card-title']}>Leagues & Tournaments</h2>
                    <p className={styles['features__card-text']}>Join our competitive leagues or participate in tournaments for all skill levels.</p>
                </div>
                <div className={styles['features__card']}>
                    <h2 className={styles['features__card-title']}>Food & Drink</h2>
                    <p className={styles['features__card-text']}>Enjoy a full menu of snacks, meals, and drinks — from classic pub food to refreshing cocktails,
                        all served right to your table.</p>
                </div>
            </section>

            <section className={styles.about}>
                <div className={styles['about__content']}>
                    <h2 className={styles['about__title']}>About Us</h2>
                    <p className={styles['about__text']}>
                        Located in the heart of the city, Bourbon Street Billiards offers a sophisticated environment for billiards enthusiasts.
                        Whether you are a seasoned pro or just looking for a night out with friends, our upscale atmosphere and
                        top-tier equipment provide the perfect setting.
                    </p>
                    <Button href="/contact" variant="outline">Visit Us</Button>
                </div>
            </section>
        </main>
    );
}
