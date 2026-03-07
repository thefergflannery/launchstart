'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PassIcon, LockIcon, SparkleIcon } from '@/components/Icons';
import WaitlistForm from '@/components/WaitlistForm';
import Nav, { HOME_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import SignupPanel from '@/components/SignupPanel';

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
    slug: 'ten-accessibility-quick-wins',
    category: 'Accessibility',
    title: 'Is Your Website Leaving People Out? 10 Fixes You Can Ask For Today',
    excerpt: 'WCAG 2.2 AA compliance isn\'t just a legal obligation — it\'s a commercial opportunity. Here are 10 quick wins you can brief your web team on today.',
    date: 'Feb 2026',
  },
  {
    slug: 'seven-free-accessibility-tools',
    category: 'SEO',
    title: '7 Essential Free Tools to Check Your Website\'s Accessibility',
    excerpt: 'Automated scanners identify 30–40% of WCAG failures. Here are 7 free tools — from WAVE and Axe to VoiceOver — that surface the obvious issues fast.',
    date: 'Jan 2026',
  },
  {
    slug: 'curb-cut-effect',
    category: 'Checklist',
    title: 'The Curb Cut Effect: Why Designing for Disability Makes Everything Better',
    excerpt: 'The slope at the footpath wasn\'t designed for you. But you use it constantly. The same principle applies to every accessibility improvement on the web.',
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
  '20 scans / day',
  'Scan history saved to dashboard',
  'PDF export for client delivery',
  'Chrome extension access',
  'Shareable report URL',
];

const FULL_SITE_FEATURES = [
  'Everything in Pro',
  '50-page full site crawl',
  '50 scans / day',
  'Site-wide compliance score',
  'Priority support',
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
      let data: { id?: string; error?: string } = {};
      try { data = await res.json(); } catch { /* empty body — timeout or crash */ }
      if (!res.ok) throw new Error(data.error ?? 'Scan timed out — please try again.');
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">

      <Nav links={HOME_NAV_LINKS} cta={{ href: '#scan', label: 'Audit →', isAnchor: true }} />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section id="scan" className="grid-bg border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-28 lg:py-40">
            <div className="max-w-3xl">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-6">
                Accessibility · SEO · Launch readiness
              </span>
              <h1 className="text-6xl lg:text-8xl font-display font-extrabold text-white leading-none tracking-tight mb-6">
                Ship sites<br />that work<br /><span className="text-green">for everyone.</span>
              </h1>
              <p className="text-secondary text-xl mb-12 leading-relaxed max-w-xl">
                Paste a URL. Get a full accessibility, SEO, and launch-readiness audit in under 30 seconds — with a shareable report and one-line fixes for every issue.
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
                {error && (
                  <div className="mt-3">
                    <p id="hero-error" role="alert" className="font-mono text-xs text-fail">{error}</p>
                    {(error.includes('Sign up') || error.includes('Upgrade')) && (
                      <div className="flex gap-4 mt-2">
                        <a href="/auth/signup" className="font-mono text-xs text-green hover:underline">Create free account →</a>
                        <a href="/auth/login" className="font-mono text-xs text-secondary hover:text-white">Sign in</a>
                      </div>
                    )}
                  </div>
                )}
              </form>

              <p className="mt-5 font-mono text-xs text-secondary">
                No account needed to scan.{' '}
                <a href="/auth/signup" className="text-green hover:underline">Create a free account</a>{' '}
                to save your scan history.
              </p>

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

        {/* ── Signup panel ── */}
        <section className="border-b border-border bg-surface">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="mb-5">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-1">Free account</span>
              <p className="text-white font-semibold text-sm">Save your results and scan more pages</p>
            </div>
            <SignupPanel />
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

        {/* ── Compliance standards strip ── */}
        <section className="border-b border-border bg-black overflow-hidden" aria-label="Supported compliance standards">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted flex-shrink-0">Standards covered</span>
              {[
                { label: 'WCAG 2.2 AA' },
                { label: 'EN 301 549' },
                { label: 'ADA Title III' },
                { label: 'Section 508' },
                { label: 'EAA 2025' },
                { label: 'AODA' },
              ].map((s) => (
                <span key={s.label} className="font-mono text-xs tracking-wider uppercase text-secondary border border-border px-3 py-1.5">
                  {s.label}
                </span>
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
                  <span className={`text-sm flex-1 ${check.free ? 'text-white' : 'text-secondary'}`}>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border mb-16">

              {/* Free */}
              <div className="bg-black p-8">
                <div className="mb-6">
                  <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Free</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-semibold text-white">€0</span>
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
                  className="block text-center font-mono text-sm tracking-wider uppercase border border-border px-6 py-3 text-white hover:border-white transition-colors"
                >
                  Start scanning →
                </a>
              </div>

              {/* Pro */}
              <div className="relative corner-mark p-8 bg-black border border-green/20" style={{ boxShadow: '0 0 40px -8px rgba(0,233,106,0.12)' }}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs tracking-widest uppercase text-green">Pro</span>
                    <span className="font-mono text-[10px] border border-green/30 text-green px-2 py-0.5 uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-semibold text-white">€5</span>
                    <span className="text-secondary text-sm">/ month</span>
                  </div>
                  <p className="text-secondary text-sm">Single-page scans with history and Chrome extension.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-green"><SparkleIcon size={11} /></span>
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/pricing"
                  className="block text-center font-mono text-sm tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors"
                >
                  Get Pro — €5/month →
                </a>
              </div>

              {/* Full Site */}
              <div className="bg-black p-8">
                <div className="mb-6">
                  <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Full Site</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-semibold text-white">€15</span>
                    <span className="text-secondary text-sm">/ month</span>
                  </div>
                  <p className="text-secondary text-sm">Full site crawl — audit every page at once.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {FULL_SITE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-green"><SparkleIcon size={11} /></span>
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/pricing"
                  className="block text-center font-mono text-sm tracking-wider uppercase border border-border px-6 py-3 text-white hover:border-white transition-colors"
                >
                  Get Full Site — €15/month →
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Chrome Extension ── */}
        <section className="border-b border-border py-20 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              {/* Copy */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-xs tracking-widest uppercase text-green">Chrome Extension</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green/60 px-2 py-0.5 uppercase tracking-wider">Beta</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white tracking-tight leading-tight mb-5">
                  Audit any page,<br />right from your browser.
                </h2>
                <p className="text-secondary leading-relaxed mb-8">
                  Click the A11YO icon while you&apos;re on any page — staging, production, or a client&apos;s live site. A full accessibility audit runs in seconds. Plain English results. Shareable report in one click.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    'One click — no copy-pasting URLs',
                    'Guest scan: free, no account needed',
                    'Shareable report link saved to your dashboard',
                    'Works on localhost and staging URLs',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-green flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/extension"
                    className="font-mono text-xs tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors text-center"
                  >
                    Learn more →
                  </a>
                  <div className="flex-1">
                    <WaitlistForm placeholder="Notify me at launch" />
                  </div>
                </div>
              </div>

              {/* Popup mockup */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="border border-border bg-black" style={{ width: 300 }}>
                  <div className="border-b border-border px-4 py-3 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">A11<span className="text-green">YO</span></span>
                    <span className="font-mono text-[10px] text-green uppercase tracking-wider">Scan complete</span>
                  </div>
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="font-mono text-2xl font-bold text-green">78</div>
                      <div className="font-mono text-[9px] text-secondary uppercase tracking-wider">compliance score</div>
                    </div>
                    <div className="flex gap-3 text-right">
                      <div><div className="font-mono text-base font-bold text-red-400">2</div><div className="font-mono text-[9px] text-secondary">Critical</div></div>
                      <div><div className="font-mono text-base font-bold text-amber-400">3</div><div className="font-mono text-[9px] text-secondary">Should fix</div></div>
                      <div><div className="font-mono text-base font-bold text-secondary">1</div><div className="font-mono text-[9px] text-secondary">Nice to have</div></div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      { label: 'Images have no text description', sev: 'CRITICAL', cls: 'text-red-400 bg-red-400/10' },
                      { label: 'Form fields have no labels', sev: 'CRITICAL', cls: 'text-red-400 bg-red-400/10' },
                      { label: 'Text may be hard to read', sev: 'SHOULD FIX', cls: 'text-amber-400 bg-amber-400/10' },
                      { label: 'No meta description found', sev: 'SHOULD FIX', cls: 'text-amber-400 bg-amber-400/10' },
                    ].map((item) => (
                      <div key={item.label} className="px-4 py-2.5 flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-white leading-snug flex-1">{item.label}</span>
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 whitespace-nowrap flex-shrink-0 ${item.cls}`}>
                          {item.sev}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-green">View full report →</span>
                    <span className="font-mono text-[10px] text-secondary">Scan again</span>
                  </div>
                </div>
                <div className="absolute -inset-px bg-green/5 -z-10 blur-2xl pointer-events-none" aria-hidden="true" />
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
                <a key={post.slug} href={`/blog/${post.slug}`} className="bg-black p-8 flex flex-col group">
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
                </a>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <SiteFooter />

    </div>
  );
}
