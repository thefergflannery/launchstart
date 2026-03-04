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
  A11y:   'text-lc-purple',
  SEO:    'text-pass',
  Launch: 'text-amber',
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
    <div className="min-h-screen bg-lc-bg flex flex-col">

      {/* ── Nav ── */}
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-widest uppercase text-lc-fg font-semibold hover:text-lc-purple transition-colors">
            A11YO
          </Link>
          <nav className="flex items-center gap-1">
            <a href="#how-it-works" className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors px-3 py-2 hidden sm:block">
              How it works
            </a>
            <a href="#checks" className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors px-3 py-2 hidden sm:block">
              Checks
            </a>
            <a href="#pricing" className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors px-3 py-2 hidden sm:block">
              Pricing
            </a>
            <Link href="/tools/alt-text" className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors px-3 py-2 hidden md:block">
              Alt Text Tool
            </Link>
            <a
              href="#scan"
              className="ml-2 font-mono text-xs tracking-wider uppercase bg-lc-fg text-lc-bg px-4 py-2 hover:bg-lc-purple transition-colors"
            >
              Audit →
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section id="scan" className="grid-bg border-b border-lc-border">
          <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
            <div className="max-w-2xl">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-5">
                Accessibility · SEO · Launch readiness
              </span>
              <h1 className="text-5xl lg:text-6xl font-semibold text-lc-fg leading-tight tracking-tight mb-5">
                Ship accessible,<br />audit-ready sites.
              </h1>
              <p className="text-lc-muted text-lg mb-10 leading-relaxed">
                Paste a URL and get a shareable report in under 30 seconds.
                5 checks free — upgrade to Pro for all 17.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="corner-mark border border-lc-border bg-lc-card flex items-stretch max-w-xl">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="flex-1 px-5 py-4 bg-white text-lc-fg placeholder-lc-muted/50 focus:outline-none text-base font-mono"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="px-7 py-4 bg-lc-fg text-lc-bg font-mono text-sm tracking-wider uppercase hover:bg-lc-purple disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-lc-border whitespace-nowrap"
                  >
                    {loading ? 'Scanning…' : 'Audit →'}
                  </button>
                </div>
                {error && <p className="mt-3 font-mono text-xs text-fail">{error}</p>}
              </form>

              {loading && (
                <div className="mt-5 flex items-center gap-3">
                  <span className="w-3 h-3 border border-lc-purple border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="font-mono text-xs tracking-wider text-lc-muted uppercase">
                    {SCAN_MESSAGES[msgIndex]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-b border-lc-border bg-lc-card">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-lc-border">
              {[
                { value: '5',    label: 'Free checks' },
                { value: '17',   label: 'Pro checks'  },
                { value: '<30s', label: 'Per scan'    },
                { value: '€0',   label: 'To start'   },
              ].map((s) => (
                <div key={s.label} className="px-6 py-6 text-center">
                  <p className="font-mono text-2xl font-semibold text-lc-fg mb-1">{s.value}</p>
                  <p className="font-mono text-xs tracking-wider uppercase text-lc-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="border-b border-lc-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-3">How it works</span>
              <h2 className="text-3xl font-semibold text-lc-fg tracking-tight">Three steps to a full audit</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-lc-border">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-lc-bg p-8">
                  <span className="font-mono text-xs tracking-widest text-lc-purple block mb-6">{step.n}</span>
                  <h3 className="text-lc-fg font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-lc-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we check ── */}
        <section id="checks" className="border-b border-lc-border py-20 bg-lc-card">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-3">What we check</span>
                <h2 className="text-3xl font-semibold text-lc-fg tracking-tight">17 checks. 5 free.</h2>
              </div>
              <a href="#pricing" className="font-mono text-xs tracking-wider uppercase text-lc-purple hover:underline hidden sm:block">
                See pricing →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ALL_CHECKS.map((check) => (
                <div
                  key={check.label}
                  className={`flex items-center gap-3 px-4 py-3 border transition-colors ${
                    check.free ? 'border-lc-border bg-lc-bg' : 'border-lc-border/40 bg-lc-bg/30'
                  }`}
                >
                  <div className={check.free ? 'text-pass flex-shrink-0' : 'text-lc-border flex-shrink-0'}>
                    {check.free ? <PassIcon size={13} /> : <LockIcon size={13} />}
                  </div>
                  <span className={`text-sm flex-1 ${check.free ? 'text-lc-fg' : 'text-lc-muted/50'}`}>
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
        <section id="pricing" className="grid-bg border-b border-lc-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12 text-center">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-3">Pricing</span>
              <h2 className="text-3xl font-semibold text-lc-fg tracking-tight mb-3">Simple, honest pricing.</h2>
              <p className="text-lc-muted max-w-sm mx-auto">
                Start free with no account. Upgrade when you need more.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-lc-border mb-16">

              {/* Free */}
              <div className="bg-lc-bg p-10">
                <div className="mb-8">
                  <span className="font-mono text-xs tracking-widest uppercase text-lc-muted block mb-3">Free</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-5xl font-semibold text-lc-fg">€0</span>
                    <span className="text-lc-muted text-sm">forever</span>
                  </div>
                  <p className="text-lc-muted text-sm">No account. No credit card. Just paste and scan.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-pass"><PassIcon size={13} /></span>
                      <span className="text-lc-muted text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#scan"
                  className="block text-center font-mono text-sm tracking-wider uppercase border border-lc-border px-6 py-3.5 text-lc-fg hover:border-lc-fg transition-colors"
                >
                  Start scanning →
                </a>
              </div>

              {/* Pro */}
              <div className="corner-mark p-10" style={{ backgroundColor: '#0C0B09' }}>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs tracking-widest uppercase text-lc-purple">Pro</span>
                    <span className="font-mono text-[10px] bg-lc-purple text-white px-2 py-0.5 uppercase tracking-wider">
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
                      <span className="mt-0.5 flex-shrink-0 text-lc-purple"><SparkleIcon size={11} /></span>
                      <span className="text-white/70 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <WaitlistForm />
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-lc-border px-6 py-6 bg-lc-card">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-lc-fg tracking-wider uppercase font-semibold">A11YO</span>
          <div className="flex items-center gap-4">
            <Link href="/tools/alt-text" className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors">
              Alt Text Tool
            </Link>
            <a href="#pricing" className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors">
              How it works
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
