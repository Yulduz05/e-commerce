import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/common/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090d16',
};

export const metadata: Metadata = {
  title: 'OmniStore | Multi-Category E-Commerce Platform',
  description:
    'Experience high-performance multi-category commerce across Computers, Apparel, Soccer Cleats, Beauty, and Office Supplies with server-authoritative integrity and modern UX.',
  keywords: [
    'e-commerce',
    'computers',
    'apparel',
    'soccer cleats',
    'cosmetics',
    'office supplies',
    'nextjs',
    'full-stack',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <CartDrawer />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
