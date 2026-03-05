'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PassIcon, LockIcon, SparkleIcon } from '@/components/Icons';
import WaitlistForm from '@/components/WaitlistForm';

const SCAN_MESSAGES = [
  'Loading page…',
  'Running accessibility checks…',
  'Scanning SEO metadata…',
  'Checking launch readiness…',
  'Testing broken links…',
  'Saving your report…',
];

const STEPS = [
  { n: '01', title: 'Enter your URL', desc: 'Paste any public URL — staging, production, or a client site.' },
  { n: '02', title: 'We scan it', desc: 'A headless browser runs up to 17 checks across accessibility, SEO, and launch readiness.' },
  { n: '03', title: 'Get your report', desc: 'Every check returns pass, amber, or fail with a one-line fix. Share the link instantly.' },
];

const ALL_CHECKS = [
  { label: 'Images alt text',   category: 'A11y',   free: true  },
  { label: 'Colour contrast',   category: 'A11y',   free: true  },
  { label: 'Meta description',  category: 'SEO',    free: true  },
  { label: 'HTTPS enforced',    category: 'SEO',    free: true  },
  { label: 'Page load time',    category: 'Launch', free: true  },
  { label: 'Form input labels', category: 'A11y',   free: false },
  { label: 'Page title & lang', category: 'A11y',   free: false },
  { label: 'ARIA errors',       category: 'A11y',   free: false },
  { label: 'Heading structure', category: 'A11y',   free: false },
  { label: 'Keyboard focus',    category: 'A11y',   free: false },
  { label: 'OG image',          category: 'SEO',    free: false },
  { label: 'OG title',          category: 'SEO',    free: false },
  { label: 'Viewport meta tag', category: 'SEO',    free: false },
  { label: 'robots.txt',        category: 'Launch', free: false },
  { label: 'sitemap.xml',       category: 'Launch', free: false },
  { label: 'Broken links',      category: 'Launch', free: false },
  { label: 'Mobile viewport',   category: 'Launch', free: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  A11y:   'text-green',
  SEO:    'text-green-mid',
  Launch: 'text-warn',
};

const BLOG_POSTS = [
  {
    slug: 'wcag-22-what-changed',
    category: 'Accessibility',
    title: 'WCAG 2.2: What Changed and Why It Matters for Your Site',
    excerpt: 'The latest Web Content Accessibility Guidelines introduced 9 new success criteria. Here\'s what\'s new, what was removed, and the fastest way to check your site\'s compliance.',
    date: 'Feb 2026',
  },
  {
    slug: 'accessibility-seo-connection',
    category: 'SEO',
    title: 'Accessibility and SEO Are the Same Problem',
    excerpt: 'Alt text, semantic headings, and descriptive links aren\'t just WCAG requirements — they\'re what Google crawlers read too. Fix your accessibility score and your rankings follow.',
    date: 'Jan 2026',
  },
  {
    slug: 'five-common-accessibility-failures',
    category: 'Checklist',
    title: 'The 5 Most Common Accessibility Failures (and How to Fix Each One)',
    excerpt: 'Missing form labels, low contrast text, images without alt attributes — the same five issues show up on 80% of audited sites. Here\'s how to find and fix them in under an hour.',
    date: 'Jan 2026',
  },
];

const BLOG_CATEGORY_COLORS: Record<string, string> = {
  Accessibility: 'text-green',
  SEO: 'text-green-mid',
  Checklist: 'text-warn',
};

const FREE_FEATURES = [
  '5 automated checks',
  'Single-page scan',
  'Shareable report URL',
  'Pass / amber / fail with fix hints',
  'No account required',
];

const PRO_FEATURES = [
  'All 17 checks',
  'Multi-page crawl — up to 50 pages',
  'Multi-site comparison reports',
  'AI Alt Text Generator',
  'Scheduled weekly scans + email diff',
  'PDF export for client delivery',
  'White-label report branding',
];

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setMsgIndex(0);

    try {
      let normalized = url.trim();
      if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`;
      }
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Scan failed');
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* ── Nav ── */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-widest uppercase text-white font-semibold hover:text-green transition-colors">
            A11YO
          </Link>
          <nav className="flex items-center gap-1">
            <a href="#how-it-works" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3 hidden sm:block">
              How it works
            </a>
            <a href="#checks" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3 hidden sm:block">
              Checks
            </a>
            <a href="#pricing" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3 hidden sm:block">
              Pricing
            </a>
            <a href="#blog" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3 hidden sm:block">
              Blog
            </a>
            <Link href="/tools/alt-text" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3 hidden md:block">
              Alt Text Tool
            </Link>
            <a
              href="#scan"
              className="ml-2 font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors"
            >
              Audit →
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section id="scan" className="grid-bg border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
            <div className="max-w-2xl">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-5">
                Accessibility · SEO · Launch readiness
              </span>
              <h1 className="text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight mb-5">
                Ship accessible,<br />audit-ready sites.
              </h1>
              <p className="text-secondary text-lg mb-10 leading-relaxed">
                Paste a URL and get a shareable report in under 30 seconds.
                5 checks free — upgrade to Pro for all 17.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="hero-url" className="sr-only">Website URL to audit</label>
                <div className="corner-mark border border-border bg-surface flex items-stretch max-w-xl">
                  <input
                    id="hero-url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="flex-1 px-5 py-4 bg-black text-white placeholder-secondary/50 focus:outline-none text-base font-mono"
                    disabled={loading}
                    autoFocus
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'hero-error' : undefined}
                  />
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="px-7 py-4 bg-white text-black font-mono text-sm tracking-wider uppercase hover:bg-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-border whitespace-nowrap"
                  >
                    {loading ? 'Scanning…' : 'Audit →'}
                  </button>
                </div>
                {error && <p id="hero-error" role="alert" className="mt-3 font-mono text-xs text-fail">{error}</p>}
              </form>

              {loading && (
                <div className="mt-5 flex items-center gap-3" aria-live="polite">
                  <span className="w-3 h-3 border border-green border-t-transparent rounded-full animate-spin flex-shrink-0" aria-hidden="true" />
                  <span className="font-mono text-xs tracking-wider text-secondary uppercase">
                    {SCAN_MESSAGES[msgIndex]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-b border-border bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
              {[
                { value: '5',    label: 'Free checks' },
                { value: '17',   label: 'Pro checks'  },
                { value: '<30s', label: 'Per scan'    },
                { value: '€0',   label: 'To start'   },
              ].map((s) => (
                <div key={s.label} className="px-6 py-6 text-center">
                  <p className="font-mono text-2xl font-semibold text-white mb-1">{s.value}</p>
                  <p className="font-mono text-xs tracking-wider uppercase text-secondary">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="border-b border-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">How it works</span>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Three steps to a full audit</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-black p-8">
                  <span className="font-mono text-xs tracking-widest text-green block mb-6">{step.n}</span>
                  <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we check ── */}
        <section id="checks" className="border-b border-border py-20 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">What we check</span>
                <h2 className="text-3xl font-semibold text-white tracking-tight">17 checks. 5 free.</h2>
              </div>
              <a href="#pricing" className="font-mono text-xs tracking-wider uppercase text-green hover:underline hidden sm:block">
                See pricing →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ALL_CHECKS.map((check) => (
                <div
                  key={check.label}
                  className={`flex items-center gap-3 px-4 py-3 border transition-colors ${
                    check.free ? 'border-border bg-black' : 'border-border/40 bg-black/30'
                  }`}
                >
                  <div className={check.free ? 'text-green-mid flex-shrink-0' : 'text-border flex-shrink-0'}>
                    {check.free ? <PassIcon size={13} /> : <LockIcon size={13} />}
                  </div>
                  <span className={`text-sm flex-1 ${check.free ? 'text-white' : 'text-secondary/50'}`}>
                    {check.label}
                  </span>
                  <span className={`font-mono text-[10px] uppercase tracking-wider flex-shrink-0 ${CATEGORY_COLORS[check.category]} ${!check.free ? 'opacity-30' : ''}`}>
                    {check.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="grid-bg border-b border-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12 text-center">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Pricing</span>
              <h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Simple, honest pricing.</h2>
              <p className="text-secondary max-w-sm mx-auto">
                Start free with no account. Upgrade when you need more.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mb-16">

              {/* Free */}
              <div className="bg-black p-10">
                <div className="mb-8">
                  <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Free</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-5xl font-semibold text-white">€0</span>
                    <span className="text-secondary text-sm">forever</span>
                  </div>
                  <p className="text-secondary text-sm">No account. No credit card. Just paste and scan.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-green-mid"><PassIcon size={13} /></span>
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#scan"
                  className="block text-center font-mono text-sm tracking-wider uppercase border border-border px-6 py-3.5 text-white hover:border-white transition-colors"
                >
                  Start scanning →
                </a>
              </div>

              {/* Pro */}
              <div className="corner-mark p-10" style={{ backgroundColor: 'var(--color-green-dark)' }}>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs tracking-widest uppercase text-green">Pro</span>
                    <span className="font-mono text-[10px] bg-green text-white px-2 py-0.5 uppercase tracking-wider">
                      Coming soon
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-5xl font-semibold text-white">€29</span>
                    <span className="text-white/50 text-sm">/ month</span>
                  </div>
                  <p className="text-white/50 text-sm">For agencies, freelancers, and teams shipping regularly.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-green"><SparkleIcon size={11} /></span>
                      <span className="text-white/70 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <WaitlistForm />
              </div>

            </div>
          </div>
        </section>

        {/* ── Chrome Extension ── */}
        <section className="border-b border-border py-20 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Copy */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-xs tracking-widest uppercase text-green">Coming soon</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green/60 px-2 py-0.5 uppercase tracking-wider">Chrome Extension</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white tracking-tight leading-tight mb-5">
                  Audit any page,<br />right from your browser.
                </h2>
                <p className="text-secondary leading-relaxed mb-8">
                  No copy-pasting URLs. The A11YO Chrome extension runs a full accessibility and launch-readiness audit on whatever page you&apos;re viewing — staging, production, or a client&apos;s live site. Results in your browser, shareable report link in one click.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    'One-click audit on any page you\'re viewing',
                    'Instant pass / warn / fail overlay on the page',
                    'Shareable report link synced to your dashboard',
                    'Works on local dev servers and staging URLs',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-green flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4">
                  <WaitlistForm placeholder="Get notified at launch" />
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="border border-border bg-black p-1">
                  {/* Browser chrome mockup */}
                  <div className="bg-surface border-b border-border px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-border" />
                      <span className="w-2.5 h-2.5 rounded-full bg-border" />
                      <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    </div>
                    <div className="flex-1 bg-black border border-border px-3 py-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-mid flex-shrink-0" />
                      <span className="font-mono text-xs text-secondary truncate">https://yourclient.com</span>
                    </div>
                    <div className="w-6 h-6 border border-green/40 flex items-center justify-center flex-shrink-0" title="A11YO extension">
                      <span className="font-display text-[8px] font-bold text-green">A</span>
                    </div>
                  </div>
                  {/* Popup panel */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display font-bold text-sm text-white">A11YO</span>
                      <span className="font-mono text-[10px] text-green uppercase tracking-wider">Scan complete</span>
                    </div>
                    {[
                      { label: 'Images alt text',  status: 'pass' },
                      { label: 'Colour contrast',  status: 'fail' },
                      { label: 'Meta description', status: 'pass' },
                      { label: 'Form labels',      status: 'warn' },
                      { label: 'HTTPS enforced',   status: 'pass' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="font-mono text-xs text-secondary">{item.label}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          item.status === 'pass' ? 'text-green bg-green/10' :
                          item.status === 'fail' ? 'text-fail bg-fail/10' :
                          'text-warn bg-warn/10'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                    <button className="w-full mt-3 font-mono text-xs uppercase tracking-wider bg-green text-black py-2.5 font-semibold">
                      View full report →
                    </button>
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -inset-px bg-green/5 -z-10 blur-xl" aria-hidden="true" />
              </div>

            </div>
          </div>
        </section>

        {/* ── Blog ── */}
        <section id="blog" className="border-b border-border py-20">
          <div className="max-w-5xl mx-auto px-6">

            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">From the blog</span>
                <h2 className="text-3xl font-display font-semibold text-white tracking-tight">Accessibility, SEO & launch guides</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {BLOG_POSTS.map((post) => (
                <article key={post.slug} className="bg-black p-8 flex flex-col group">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-mono text-xs uppercase tracking-wider ${BLOG_CATEGORY_COLORS[post.category] ?? 'text-secondary'}`}>
                      {post.category}
                    </span>
                    <span className="font-mono text-xs text-secondary">{post.date}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-green transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed flex-1 mb-6">
                    {post.excerpt}
                  </p>
                  <span className="font-mono text-xs uppercase tracking-wider text-green mt-auto self-start">
                    Read →
                  </span>
                </article>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-6 bg-surface">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-white tracking-wider uppercase font-semibold">A11YO</span>
          <div className="flex items-center gap-4">
            <Link href="/tools/alt-text" className="font-mono text-xs text-secondary hover:text-white transition-colors">
              Alt Text Tool
            </Link>
            <a href="#pricing" className="font-mono text-xs text-secondary hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#blog" className="font-mono text-xs text-secondary hover:text-white transition-colors">
              Blog
            </a>
            <Link href="/accessibility" className="font-mono text-xs text-secondary hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
