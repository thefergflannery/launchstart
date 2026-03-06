import Link from 'next/link';

export interface NavLink {
  href: string;
  label: string;
  hideBelow?: 'sm' | 'md';
  isAnchor?: boolean;
}

interface NavProps {
  links?: NavLink[];
  cta?: { href: string; label: string; isAnchor?: boolean };
  maxWidth?: string;
}

const DEFAULT_CTA = { href: '/#scan', label: 'Audit →' };

export default function Nav({ links, cta = DEFAULT_CTA, maxWidth = 'max-w-5xl' }: NavProps) {
  return (
    <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
      <div className={`${maxWidth} mx-auto px-6 h-14 flex items-center justify-between`}>
        <Link
          href="/"
          className="font-mono text-sm tracking-widest uppercase text-white font-semibold hover:text-green transition-colors"
        >
          A11YO
        </Link>

        {links && links.length > 0 && (
          <nav className="flex items-center gap-1">
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
            {cta && (
              cta.isAnchor ? (
                <a href={cta.href} className="ml-2 font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
                  {cta.label}
                </a>
              ) : (
                <Link href={cta.href} className="ml-2 font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
                  {cta.label}
                </Link>
              )
            )}
          </nav>
        )}

        {(!links || links.length === 0) && cta && (
          cta.isAnchor ? (
            <a href={cta.href} className="font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
              {cta.label}
            </a>
          ) : (
            <Link href={cta.href} className="font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
              {cta.label}
            </Link>
          )
        )}
      </div>
    </header>
  );
}

// Pre-configured nav link sets
export const HOME_NAV_LINKS: NavLink[] = [
  { href: '#how-it-works', label: 'How it works', isAnchor: true, hideBelow: 'sm' },
  { href: '#checks',       label: 'Checks',        isAnchor: true, hideBelow: 'sm' },
  { href: '#pricing',      label: 'Pricing',        isAnchor: true, hideBelow: 'sm' },
  { href: '/tools',        label: 'Tools',          hideBelow: 'md' },
  { href: '/auth/login',   label: 'Sign in',        hideBelow: 'sm' },
];

export const PAGE_NAV_LINKS: NavLink[] = [
  { href: '/tools',       label: 'Tools',   hideBelow: 'sm' },
  { href: '/pricing',     label: 'Pricing', hideBelow: 'sm' },
  { href: '/auth/login',  label: 'Sign in', hideBelow: 'sm' },
];

export const TOOLS_NAV_LINKS: NavLink[] = [
  { href: '/tools',      label: '← Tools', hideBelow: 'sm' },
  { href: '/pricing',    label: 'Pricing',  hideBelow: 'sm' },
  { href: '/auth/login', label: 'Sign in',  hideBelow: 'sm' },
];
