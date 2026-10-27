import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import type { Metadata } from 'next';
import './globals.scss';
import { siteUrl } from '@/lib/site-url';

import NextTopLoader from 'nextjs-toploader';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Frame from '@/components/layout/Frame';

import { Playfair_Display, Cormorant_Garamond, Crimson_Text } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading',
});

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-subheading',
});

const crimson = Crimson_Text({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '600', '700'],
    variable: '--font-body',
});

export const metadata: Metadata = {
    metadataBase: siteUrl,
    title: {
        default: 'Bourbon Street Billiards | Pool Hall in Winnipeg',
        template: '%s | Bourbon Street Billiards',
    },
    description: 'Pool and snooker hall in Winnipeg with 11 billiard tables, 5 snooker tables, leagues, tournaments, food and drinks.',
    openGraph: {
        siteName: 'Bourbon Street Billiards',
        type: 'website',
        locale: 'en_CA',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${cormorant.variable} ${crimson.variable}`}>
            <body>
                <NeonAuthUIProvider authClient={authClient} redirectTo="/panel">
                    <NextTopLoader color="#D4AF37" showSpinner={false} />
                    <Frame />
                    <Header />
                    {children}
                    <Footer />
                </NeonAuthUIProvider>
            </body>
        </html>
    );
}
