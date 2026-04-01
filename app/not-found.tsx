import Link from 'next/link';
import type { Metadata } from 'next';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} />

      <main id="main-content" className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <span className="font-mono text-xs tracking-widest uppercase text-green block mb-6">404</span>
          <h1 className="text-4xl font-display font-extrabold text-white mb-4 tracking-tight">
            Page not found.
          </h1>
          <p className="text-secondary leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="font-mono text-sm tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="font-mono text-sm tracking-wider uppercase border border-border text-white px-6 py-3 hover:border-white transition-colors"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
