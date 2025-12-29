import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import type { Metadata } from 'next';
import './globals.css';

import NextTopLoader from 'nextjs-toploader';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Frame from '@/components/layout/Frame';

export const metadata: Metadata = {
    title: 'Bourbon Street Billiards',
    description: 'The premier pool hall experience.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
                    rel="stylesheet"
                />
            </head>
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
