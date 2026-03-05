import Link from 'next/link';
import type { Metadata } from 'next';
import { ScanIcon, SparkleIcon, PassIcon } from '@/components/Icons';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Free Accessibility Tools — A11YO',
  description: 'Free tools for web accessibility: AI alt text generator, accessibility statement generator, colour contrast checker, and more.',
};

const TOOLS = [
  {
    href: '/tools/alt-text',
    badge: 'Free · Live',
    icon: 'scan',
    title: 'AI Alt Text Generator',
    desc: 'Paste a URL. We scan every image, flag missing or generic alt text, and generate contextual suggestions using Claude AI — ready to copy into your codebase.',
    tags: ['WCAG 1.1.1', 'SC 1.1.1', 'Images'],
    live: true,
  },
  {
    href: '/tools/accessibility-statement',
    badge: 'Free · Live',
    icon: 'sparkle',
    title: 'Accessibility Statement Generator',
    desc: 'Generate a legally compliant accessibility statement for EAA 2025, ACA (Accessible Canada Act), ADA, Section 508, and WCAG 2.2 AA — in under 2 minutes.',
    tags: ['EAA 2025', 'ACA', 'WCAG 2.2 AA'],
    live: true,
  },
  {
    href: '#',
    badge: 'Coming soon',
    icon: 'pass',
    title: 'Colour Contrast Checker',
    desc: 'Enter two hex values and get an instant WCAG 2.2 contrast ratio with AA and AAA pass/fail for normal text, large text, and UI components.',
    tags: ['WCAG 1.4.3', '1.4.11', 'Colour'],
    live: false,
  },
  {
    href: '#',
    badge: 'Coming soon',
    icon: 'pass',
    title: 'ARIA Landmark Validator',
    desc: 'Paste a URL or HTML snippet. Validates landmark structure, heading hierarchy, and ARIA roles against WCAG 2.2 AA requirements.',
    tags: ['WCAG 1.3.1', 'ARIA', 'Landmarks'],
    live: false,
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  scan:    <ScanIcon size={22} className="text-green" />,
  sparkle: <SparkleIcon size={22} className="text-green" />,
  pass:    <PassIcon size={22} className="text-muted" />,
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">

      <Nav links={PAGE_NAV_LINKS} cta={{ href: '/', label: 'Audit →' }} />

      <main id="main-content" className="flex-1">

        {/* Hero */}
        <section className="grid-bg border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-5">Free tools</span>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-none tracking-tight mb-5">
              Accessibility<br /><span className="text-green">toolbox.</span>
            </h1>
            <p className="text-secondary text-lg max-w-xl leading-relaxed">
              Standalone tools to fix the most common accessibility issues — no account needed. Each one is free, fast, and built around a specific WCAG success criterion.
            </p>
          </div>
        </section>

        {/* Tools grid */}
        <section className="py-16 border-b border-border">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
              {TOOLS.map((tool) => (
                <div
                  key={tool.href}
                  className={`bg-black p-8 flex flex-col group relative ${tool.live ? '' : 'opacity-60'}`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border ${
                      tool.live
                        ? 'text-green border-green/30 bg-green/5'
                        : 'text-secondary border-border'
                    }`}>
                      {tool.badge}
                    </span>
                    <div className="w-10 h-10 border border-border flex items-center justify-center bg-surface">
                      {ICON_MAP[tool.icon]}
                    </div>
                  </div>

                  <h2 className={`text-xl font-semibold text-white mb-3 ${tool.live ? 'group-hover:text-green transition-colors' : ''}`}>
                    {tool.title}
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed flex-1 mb-6">
                    {tool.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-secondary border border-border px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {tool.live ? (
                    <Link
                      href={tool.href}
                      className="inline-block font-mono text-xs tracking-wider uppercase border border-border px-5 py-3 text-white hover:border-green hover:text-green transition-colors self-start"
                    >
                      Open tool →
                    </Link>
                  ) : (
                    <span className="font-mono text-xs tracking-wider uppercase text-muted border border-border/40 px-5 py-3 self-start cursor-not-allowed">
                      Coming soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — full audit */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid-bg border border-border p-10 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Need more?</span>
                <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-3">
                  Run the full 17-check site audit.
                </h2>
                <p className="text-secondary leading-relaxed max-w-md">
                  The tools above fix individual issues. The full audit scans your entire page across accessibility, SEO, and launch readiness — with a shareable report.
                </p>
              </div>
              <Link
                href="/"
                className="flex-shrink-0 font-mono text-sm tracking-wider uppercase bg-green text-black px-8 py-4 hover:bg-green/80 transition-colors whitespace-nowrap"
              >
                Run full audit →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />

    </div>
  );
}
