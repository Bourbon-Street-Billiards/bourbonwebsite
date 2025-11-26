import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Bourbon Pool Hall',
    description: 'The premier pool hall experience.',
}

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Frame from '@/components/layout/Frame'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Frame />
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}
