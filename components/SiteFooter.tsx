import Link from 'next/link';

const BUILD_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev';
const BUILD_VERSION = `v0.1.0-${BUILD_SHA}`;

interface SiteFooterProps {
  maxWidth?: string;
}

export default function SiteFooter({ maxWidth = 'max-w-5xl' }: SiteFooterProps) {
  return (
    <footer className="border-t border-border px-6 py-5">
      <div className={`${maxWidth} mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs text-white tracking-wider uppercase font-semibold">A11YO</span>
          <Link href="/tools" className="font-mono text-xs text-secondary hover:text-white transition-colors">
            Tools
          </Link>
          <Link href="/pricing" className="font-mono text-xs text-secondary hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="font-mono text-xs text-secondary hover:text-white transition-colors hidden sm:inline">
            Blog
          </Link>
          <Link href="/accessibility" className="font-mono text-xs text-secondary hover:text-white transition-colors hidden sm:inline">
            Accessibility
          </Link>
        </div>
        <span className="font-mono text-[10px] text-muted tracking-wider" title="Build version">
          {BUILD_VERSION}
        </span>
      </div>
    </footer>
  );
}
