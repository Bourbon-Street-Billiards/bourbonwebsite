import type { MetadataRoute } from 'next';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
const pages = ['', '/events', '/menu', '/league', '/rates', '/gallery', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
    return pages.map((path) => ({ url: `${siteUrl}${path}` }));
}
