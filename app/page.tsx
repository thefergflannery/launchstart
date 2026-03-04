'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  { n: '02', title: 'We scan it', desc: 'A headless browser loads your page and runs 17 checks across three categories.' },
  { n: '03', title: 'Get your report', desc: 'Every check returns pass, amber, or fail with a one-line fix.' },
];

const CATEGORIES = [
  {
    label: 'Accessibility',
    tag: '7 checks',
    desc: 'Powered by axe-core — the same engine used by Google Lighthouse.',
    checks: [
      'Images missing alt text',
      'Form inputs without labels',
      'Colour contrast failures',
      'Missing page title or lang attribute',
      'ARIA errors',
      'Heading structure issues',
      'Keyboard focus issues',
    ],
  },
  {
    label: 'SEO Basics',
    tag: '5 checks',
    desc: 'No third-party API. Pure DOM and HTTP inspection.',
    checks: [
      'Meta description present',
      'OG image set',
      'OG title set',
      'Viewport meta tag correct',
      'HTTPS enforced',
    ],
  },
  {
    label: 'Launch Readiness',
    tag: '5 checks',
    desc: 'The things that always get forgotten before go-live.',
    checks: [
      'robots.txt accessible',
      'sitemap.xml accessible',
      'Page load time under 3s',
      'Broken links (first 20)',
      'Mobile viewport configured',
    ],
  },
];

const STATS = [
  { value: '17', label: 'Automated checks' },
  { value: '<30s', label: 'Per full scan' },
  { value: '3', label: 'Report categories' },
  { value: '100%', label: 'Free, no login' },
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

      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-mono text-sm tracking-widest uppercase text-lc-fg font-semibold">
            A11YO
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/tools/alt-text"
              className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors hidden sm:block"
            >
              Alt Text Tool
            </Link>
            <Link
              href="/pricing"
              className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors hidden sm:block"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="grid-bg border-b border-lc-border">
          <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
            <div className="max-w-2xl">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-5">
                Ship accessible, ready sites
              </span>
              <h1 className="text-5xl lg:text-6xl font-semibold text-lc-fg leading-tight tracking-tight mb-5">
                A11YO
              </h1>
              <p className="text-lc-muted text-xl mb-2 font-medium text-lc-fg">
                Ship accessible, ready sites.
              </p>
              <p className="text-lc-muted text-lg mb-10 leading-relaxed">
                17 automated checks across accessibility, SEO, and launch readiness.
                Paste a URL and get a shareable report in under 30 seconds.
              </p>

              {/* Input */}
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
                {error && (
                  <p className="mt-3 font-mono text-xs text-fail">{error}</p>
                )}
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
              {STATS.map((s) => (
                <div key={s.label} className="px-6 py-6 text-center">
                  <p className="font-mono text-2xl font-semibold text-lc-fg mb-1">{s.value}</p>
                  <p className="font-mono text-xs tracking-wider uppercase text-lc-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b border-lc-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-3">
                How it works
              </span>
              <h2 className="text-3xl font-semibold text-lc-fg tracking-tight">
                Three steps to a full audit
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-lc-border">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-lc-bg p-8">
                  <span className="font-mono text-xs tracking-widest text-lc-purple block mb-6">
                    {step.n}
                  </span>
                  <h3 className="text-lc-fg font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-lc-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we check ── */}
        <section className="border-b border-lc-border py-20 bg-lc-card">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-3">
                What we check
              </span>
              <h2 className="text-3xl font-semibold text-lc-fg tracking-tight">
                17 checks. Three categories.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => (
                <div key={cat.label} className="corner-mark border border-lc-border bg-lc-bg p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lc-fg font-semibold">{cat.label}</h3>
                    <span className="font-mono text-xs tracking-wider text-lc-purple uppercase">
                      {cat.tag}
                    </span>
                  </div>
                  <p className="text-lc-muted text-xs mb-5 leading-relaxed">{cat.desc}</p>
                  <ul className="space-y-2">
                    {cat.checks.map((c) => (
                      <li key={c} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lc-purple flex-shrink-0" />
                        <span className="text-lc-muted text-sm">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="grid-bg py-24 border-b border-lc-border">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-4">
              Ready?
            </span>
            <h2 className="text-4xl font-semibold text-lc-fg tracking-tight mb-4">
              Audit your site now.
            </h2>
            <p className="text-lc-muted mb-10 max-w-md mx-auto">
              Free, no account needed. Get a shareable report with every issue
              and a one-line fix for each.
            </p>
            <form onSubmit={handleSubmit} className="flex justify-center">
              <div className="corner-mark border border-lc-border bg-lc-card flex items-stretch w-full max-w-lg">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="flex-1 px-5 py-4 bg-white text-lc-fg placeholder-lc-muted/50 focus:outline-none text-base font-mono"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="px-7 py-4 bg-lc-fg text-lc-bg font-mono text-sm tracking-wider uppercase hover:bg-lc-purple disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-lc-border whitespace-nowrap"
                >
                  {loading ? 'Scanning…' : 'Audit →'}
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-lc-border px-6 py-6 bg-lc-card">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-lc-fg tracking-wider uppercase font-semibold">
            A11YO
          </span>
          <div className="flex items-center gap-4">
            <Link href="/tools/alt-text" className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors">
              Alt Text Tool
            </Link>
            <Link href="/pricing" className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
