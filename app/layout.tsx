import type { Metadata } from 'next';
import { Syne, Inter } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'A11YO — Pre-launch accessibility & SEO checker',
    template: '%s | A11YO',
  },
  description:
    'Paste a URL and get a shareable accessibility, SEO, and launch-readiness report in under 30 seconds. Free, no login required.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://a11yo.io'),
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    siteName: 'A11YO',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} bg-lc-bg`}>
      <body className="font-sans text-lc-fg antialiased">
        {/* SC 2.4.1 — Skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
