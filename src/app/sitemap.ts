import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';

const pages = ['', '/events', '/menu', '/league', '/rates', '/gallery', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
    return pages.map((path) => ({ url: new URL(path || '/', siteUrl).href }));
}
