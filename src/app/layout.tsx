import type { Metadata, Viewport } from 'next';
import { Mitr, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const mitr = Mitr({
  subsets: ['thai', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TNR MapHub — Smart Land Valuation & Spatial Analysis',
  description: 'Professional GIS analysis, land subdivision planning, and 3D architectural rendering services by TNR Geoservice.',
  keywords: ['GIS', 'land subdivision', '3D rendering', 'spatial analysis', 'TNR Geoservice', 'MapHub'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1520',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${mitr.variable} ${ibmPlexMono.variable} bg-[var(--bg)]`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
