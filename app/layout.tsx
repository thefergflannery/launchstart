import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'A11YO — Ship accessible, ready sites',
  description:
    'A11YO scans any URL for accessibility violations, SEO gaps, and launch readiness. Get a shareable report in under 30 seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} bg-lc-bg`}
    >
      <body className="font-sans text-lc-fg antialiased">{children}</body>
    </html>
  );
}
