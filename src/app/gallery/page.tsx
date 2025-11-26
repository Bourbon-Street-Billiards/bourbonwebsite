import styles from './page.module.css';

// Placeholder images from Unsplash
const images = [
    { id: 1, src: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop', alt: 'Pool Table' },
    { id: 2, src: 'https://images.unsplash.com/photo-1554589252-094e4600d80c?q=80&w=2070&auto=format&fit=crop', alt: 'Bar Area' },
    { id: 3, src: 'https://images.unsplash.com/photo-1534158914592-062992bbe900?q=80&w=2070&auto=format&fit=crop', alt: 'Tournament' },
    { id: 4, src: 'https://images.unsplash.com/photo-1585672661596-419572629b3c?q=80&w=2070&auto=format&fit=crop', alt: 'Cocktails' },
    { id: 5, src: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop', alt: 'Lounge' },
    { id: 6, src: 'https://images.unsplash.com/photo-1605218427368-35b820251715?q=80&w=1974&auto=format&fit=crop', alt: 'Close up' },
];

export default function GalleryPage() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Gallery</h1>
            <div className={styles.grid}>
                {images.map((img) => (
                    <div key={img.id} className={styles.imageWrapper}>
                        {/* Using img tag for simplicity in this demo, but next/image is better for prod */}
                        <img src={img.src} alt={img.alt} className={styles.image} />
                    </div>
                ))}
            </div>
        </main>
    );
}
