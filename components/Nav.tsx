import Link from 'next/link';
import Logo from './Logo';
import NavUserArea from './NavUserArea';

export interface NavLink {
  href: string;
  label: string;
  hideBelow?: 'sm' | 'md';
  isAnchor?: boolean;
}

interface NavProps {
  links?: NavLink[];
  cta?: { href: string; label: string; isAnchor?: boolean } | null;
  maxWidth?: string;
}

const DEFAULT_CTA = { href: '/#scan', label: 'Audit →' };

export default function Nav({ links, cta = DEFAULT_CTA, maxWidth = 'max-w-5xl' }: NavProps) {
  return (
    <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
      <div className={`${maxWidth} mx-auto px-6 h-14 flex items-center justify-between`}>
        <Link
          href="/"
          className="text-white hover:text-green transition-colors flex-shrink-0"
        >
          <Logo size={28} />
          <span className="sr-only">A11YO</span>
        </Link>

        <div className="flex items-center">
          {links && links.length > 0 && (
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {links.map((link) => {
                const cls = `font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3 ${
                  link.hideBelow === 'md' ? 'hidden md:block' : link.hideBelow === 'sm' ? 'hidden sm:block' : ''
                }`;
                return link.isAnchor ? (
                  <a key={link.href} href={link.href} className={cls}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={cls}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <NavUserArea />

          {cta && (
            <div className="ml-1 hidden sm:block">
              {cta.isAnchor ? (
                <a href={cta.href} className="font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
                  {cta.label}
                </a>
              ) : (
                <Link href={cta.href} className="font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
                  {cta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Pre-configured nav link sets (Sign in removed — handled by NavUserArea)
export const HOME_NAV_LINKS: NavLink[] = [
  { href: '#how-it-works', label: 'How it works', isAnchor: true, hideBelow: 'sm' },
  { href: '#checks',       label: 'Checks',        isAnchor: true, hideBelow: 'sm' },
  { href: '#pricing',      label: 'Pricing',        isAnchor: true, hideBelow: 'sm' },
  { href: '/extension',    label: 'Extension',      hideBelow: 'md' },
  { href: '/tools',        label: 'Tools',          hideBelow: 'md' },
];

export const PAGE_NAV_LINKS: NavLink[] = [
  { href: '/extension',   label: 'Extension', hideBelow: 'md' },
  { href: '/tools',       label: 'Tools',     hideBelow: 'sm' },
  { href: '/pricing',     label: 'Pricing',   hideBelow: 'sm' },
];

export const TOOLS_NAV_LINKS: NavLink[] = [
  { href: '/tools',      label: '← Tools', hideBelow: 'sm' },
  { href: '/pricing',    label: 'Pricing',  hideBelow: 'sm' },
];
