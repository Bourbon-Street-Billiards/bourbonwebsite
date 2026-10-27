// Public site URL for metadata, robots.txt and sitemap.xml. Server-only: SITE_URL isn't exposed to the client.
// Never throws: a missing or malformed SITE_URL must not take down the root layout.
function resolveSiteUrl(): URL {
    const fallback = new URL('http://localhost:3000');
    const raw = process.env.SITE_URL?.trim();

    if (!raw) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('SITE_URL is not set; sitemap, robots.txt and metadata will point at localhost.');
        }
        return fallback;
    }

    try {
        // Accept a bare host like "example.com" as well as a full URL.
        const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
        if (url.protocol === 'http:' || url.protocol === 'https:') return url;
    } catch {
        // Fall through to the warning below
    }
    console.warn(`SITE_URL "${raw}" is not a valid http(s) URL; falling back to ${fallback.origin}.`);
    return fallback;
}

export const siteUrl = resolveSiteUrl();
