'use client';

import { useState, useEffect, useRef } from 'react';
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function Nav({ links, cta = DEFAULT_CTA, maxWidth = 'max-w-5xl' }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-40">
        <div className={`${maxWidth} mx-auto px-6 h-14 flex items-center justify-between`}>
          <Link
            href="/"
            className="text-white hover:text-green transition-colors flex-shrink-0"
            onClick={closeMenu}
          >
            <Logo size={28} />
            <span className="sr-only">A11YO</span>
          </Link>

          <div className="flex items-center">
            {/* Desktop nav links */}
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

            {/* Desktop CTA */}
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

            {/* Hamburger — mobile only */}
            {links && links.length > 0 && (
              <button
                ref={triggerRef}
                className="sm:hidden ml-2 p-2 text-secondary hover:text-white transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <HamburgerIcon open={menuOpen} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          className="sm:hidden fixed inset-x-0 top-14 bottom-0 z-30 bg-black border-t border-border flex flex-col overflow-y-auto shadow-lg"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
        >
          <nav className="flex-1 px-6 py-6 space-y-1" aria-label="Mobile navigation">
            {links?.map((link) =>
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block font-mono text-sm tracking-wider uppercase text-secondary hover:text-white transition-colors py-3.5 border-b border-border/50"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block font-mono text-sm tracking-wider uppercase text-secondary hover:text-white transition-colors py-3.5 border-b border-border/50"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {cta && (
            <div className="px-6 py-6 border-t border-border">
              {cta.isAnchor ? (
                <a
                  href={cta.href}
                  onClick={closeMenu}
                  className="block text-center font-mono text-sm tracking-wider uppercase bg-white text-black px-6 py-4 hover:bg-green transition-colors font-semibold"
                >
                  {cta.label}
                </a>
              ) : (
                <Link
                  href={cta.href}
                  onClick={closeMenu}
                  className="block text-center font-mono text-sm tracking-wider uppercase bg-white text-black px-6 py-4 hover:bg-green transition-colors font-semibold"
                >
                  {cta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Standard nav links — used on every page
export const PAGE_NAV_LINKS: NavLink[] = [
  { href: '/tools',      label: 'Tools',      hideBelow: 'sm' },
  { href: '/pricing',    label: 'Pricing',    hideBelow: 'sm' },
  { href: '/why-a11yo',  label: 'Why A11YO',  hideBelow: 'md' },
  { href: '/blog',       label: 'Blog',       hideBelow: 'md' },
  { href: '/extension',  label: 'Extension',  hideBelow: 'md' },
];

// Homepage only — replaces pricing/tools with anchor links into the same page
export const HOME_NAV_LINKS: NavLink[] = [
  { href: '#how-it-works', label: 'How it works', isAnchor: true, hideBelow: 'sm' },
  { href: '#pricing',      label: 'Pricing',       isAnchor: true, hideBelow: 'sm' },
  { href: '/tools',        label: 'Tools',          hideBelow: 'md' },
  { href: '/extension',    label: 'Extension',      hideBelow: 'md' },
];

// Alias — keeps old import working for tools pages
export const TOOLS_NAV_LINKS = PAGE_NAV_LINKS;
