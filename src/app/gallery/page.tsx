import styles from './page.module.scss';

import GalleryImage from '@/components/gallery/GalleryImage';

// Local images from public/assets/gallery
const images = [
    { id: 1, src: '/assets/gallery/1.avif', alt: 'Gallery Image 1' },
    { id: 2, src: '/assets/gallery/2.avif', alt: 'Gallery Image 2' },
    { id: 3, src: '/assets/gallery/3.avif', alt: 'Gallery Image 3' },
    { id: 4, src: '/assets/gallery/4.jpg', alt: 'Gallery Image 4' },
    { id: 5, src: '/assets/gallery/5.jpg', alt: 'Gallery Image 5' },
    { id: 6, src: '/assets/gallery/6.avif', alt: 'Gallery Image 6' },
    { id: 7, src: '/assets/gallery/7.avif', alt: 'Gallery Image 7' },
    { id: 8, src: '/assets/gallery/8.avif', alt: 'Gallery Image 8' },
    { id: 9, src: '/assets/gallery/9.avif', alt: 'Gallery Image 9' },
];

export default function GalleryPage() {
    return (
        <main className={styles['gallery']}>
            <h1 className={styles['gallery__title']}>Gallery</h1>
            <div className={styles['gallery__grid']}>
                {images.map((img) => (
                    <div key={img.id} className={styles['gallery__card']}>
                        <GalleryImage src={img.src} alt={img.alt} />
                    </div>
                ))}
            </div>
        </main>
    );
}
