import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'LaunchCheck — Pre-launch website auditor',
  description:
    'Scan any URL for accessibility issues, SEO basics, and launch readiness in seconds.',
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
