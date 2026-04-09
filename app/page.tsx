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
  { n: '01', title: 'Paste your URL', desc: 'Any public URL works — staging, production, or a client\'s live site. No install. No setup.' },
  { n: '02', title: 'We scan it', desc: 'A headless browser runs up to 17 checks across accessibility, SEO, and launch readiness — mapped to WCAG 2.2 AA and EAA 2025 standards.' },
  { n: '03', title: 'Get your report', desc: 'Every check returns pass, amber, or fail — with a one-line fix attached. Share the link instantly. No login required for your first 5 checks.' },
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

const ACTION_PLAN_FEATURES = [
  'Everything in Free',
  '10 scans / day',
  'Scan history saved to dashboard',
  'PDF export for client delivery',
];

const RECURRING_FEATURES = [
  'Everything in Action Plan',
  '20 scans / day',
  'Score trend chart',
  'Chrome extension access',
  'Delta badge — track improvement',
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
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

      <main id="main-content" className="flex-1">

        {/* ── Hero ── */}
        <section id="scan" className="border-b border-border">

          {/* Standards strip */}
          <div className="border-b border-border bg-surface">
            <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-6 overflow-x-auto">
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted whitespace-nowrap flex-shrink-0">Covers</span>
              {['WCAG 2.2 AA', 'EN 301 549', 'EAA 2025', 'ADA Title III', 'Section 508', 'AODA'].map((s) => (
                <span key={s} className="font-mono text-[10px] tracking-wider uppercase text-secondary whitespace-nowrap">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Main hero content — two column */}
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-start">

              {/* Left — headline + form + stats */}
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-green block mb-6">
                  Accessibility · SEO · EAA 2025 Compliance
                </span>
                <h1 className="font-display font-extrabold text-white leading-[0.9] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
                  The fast accessibility checker for websites that need to be ready.
                </h1>
                <p className="text-secondary text-lg leading-relaxed max-w-xl mb-10">
                  Paste a URL. Get a full WCAG 2.2 AA, SEO, and launch-readiness audit in under 30 seconds — with a one-line fix for every issue. Free to start. No account needed.
                </p>

                {/* Scan form */}
                <div className="max-w-lg mb-6">
                  <form onSubmit={handleSubmit} aria-label="Run an accessibility audit">
                    <label htmlFor="hero-url" className="sr-only">Website URL to audit</label>
                    <div className="flex items-stretch border border-border focus-within:border-white transition-colors">
                      <input
                        id="hero-url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="yoursite.com"
                        className="flex-1 px-5 py-4 bg-black text-white placeholder-muted focus:outline-none text-base font-mono"
                        disabled={loading}
                        autoFocus
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? 'hero-error' : 'hero-hint'}
                      />
                      <button
                        type="submit"
                        disabled={loading || !url.trim()}
                        className="px-6 py-4 bg-white text-black font-mono text-sm tracking-wider uppercase hover:bg-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex items-center gap-3"
                        aria-busy={loading}
                      >
                        {loading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin flex-shrink-0" aria-hidden="true" />
                            <span className="hidden sm:inline">{SCAN_MESSAGES[msgIndex]}</span>
                            <span className="sm:hidden">Scanning…</span>
                          </>
                        ) : (
                          'Run a free audit →'
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Form meta */}
                  <div className="flex items-center justify-between mt-3 gap-4 flex-wrap">
                    <div id="hero-hint" className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green/50 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
                      </span>
                      <p className="font-mono text-xs text-secondary">
                        No account needed.{' '}
                        <a href="/auth/signup" className="text-white hover:text-green transition-colors">Create a free account</a>
                      </p>
                    </div>
                    <a href="/sample-report" className="font-mono text-xs text-secondary hover:text-white transition-colors">
                      See a sample report ↗
                    </a>
                  </div>

                  {error && (
                    <div aria-live="polite" className="mt-3">
                      <p id="hero-error" role="alert" className="font-mono text-xs text-fail">{error}</p>
                      {(error.includes('Sign up') || error.includes('Upgrade') || error.includes('limit')) && (
                        <div className="flex gap-4 mt-2">
                          <a href="/auth/signup" className="font-mono text-xs text-green hover:underline font-semibold">Create free account →</a>
                          <a href="/auth/login" className="font-mono text-xs text-secondary hover:text-white">Already have an account?</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-stretch divide-x divide-border">
                  {[
                    { value: '17',   label: 'Checks run' },
                    { value: '<30s', label: 'Per scan'    },
                    { value: '€0',   label: 'To start'   },
                  ].map((stat, i) => (
                    <div key={stat.label} className={`py-3 ${i === 0 ? 'pr-8' : 'px-8'}`}>
                      <p className="font-mono text-2xl font-semibold text-white leading-none mb-1">{stat.value}</p>
                      <p className="font-mono text-[10px] tracking-widest uppercase text-secondary">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — live score preview */}
              <div className="hidden lg:block border border-border bg-surface overflow-hidden">
                {/* URL bar */}
                <div className="border-b border-border px-5 py-3 flex items-center justify-between bg-black/40">
                  <span className="font-mono text-xs text-secondary truncate">example.com</span>
                  <span className="font-mono text-[10px] text-green uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5">
                    <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green/50 animate-ping" aria-hidden="true" />
                      <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green" aria-hidden="true" />
                    </span>
                    Scan complete
                  </span>
                </div>

                {/* Score block */}
                <div className="px-6 py-8 border-b border-border relative overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden="true"
                    style={{ background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(0,233,106,0.08) 0%, transparent 70%)' }}
                  />
                  <div className="flex items-center gap-6 relative z-10 mb-5">
                    <div>
                      <span className="font-display font-extrabold text-green leading-none block" style={{ fontSize: '6rem' }}>78</span>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">Compliance score</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="font-mono text-2xl font-bold text-fail leading-none">2</p>
                        <p className="font-mono text-[9px] text-secondary mt-1 uppercase tracking-wider">Critical</p>
                      </div>
                      <div>
                        <p className="font-mono text-2xl font-bold text-warn leading-none">3</p>
                        <p className="font-mono text-[9px] text-secondary mt-1 uppercase tracking-wider">Warnings</p>
                      </div>
                      <div>
                        <p className="font-mono text-2xl font-bold text-green leading-none">12</p>
                        <p className="font-mono text-[9px] text-secondary mt-1 uppercase tracking-wider">Passed</p>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar — segmented fail/warn/pass */}
                  <div className="flex h-1.5 gap-px relative z-10" aria-hidden="true">
                    <div className="bg-fail" style={{ width: '12%' }} />
                    <div className="bg-warn" style={{ width: '17%' }} />
                    <div className="bg-green" style={{ width: '71%' }} />
                  </div>
                </div>

                {/* Issue rows */}
                <div className="divide-y divide-border">
                  {[
                    { label: 'Images have no alt text',   sev: 'Critical', cls: 'text-fail bg-fail/10' },
                    { label: 'Colour contrast too low',   sev: 'Critical', cls: 'text-fail bg-fail/10' },
                    { label: 'Missing meta description',  sev: 'Warning',  cls: 'text-warn bg-warn/10' },
                    { label: 'Form inputs lack labels',   sev: 'Warning',  cls: 'text-warn bg-warn/10' },
                    { label: 'HTTPS enforced',            sev: 'Passed',   cls: 'text-green bg-green/10' },
                    { label: 'Page has valid title tag',  sev: 'Passed',   cls: 'text-green bg-green/10' },
                    { label: 'Viewport meta tag present', sev: 'Passed',   cls: 'text-green bg-green/10' },
                  ].map((item) => (
                    <div key={item.label} className="px-5 py-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-white leading-snug">{item.label}</span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 whitespace-nowrap flex-shrink-0 ${item.cls}`}>{item.sev}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-5 py-3.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-green">View full report with fix instructions →</span>
                  <span className="font-mono text-[10px] text-secondary">17 checks run</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Signup panel ── */}
        <section className="border-b border-border bg-surface">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-5">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-1">Free account</span>
              <p className="text-white font-semibold text-sm">Save your results and scan more pages</p>
            </div>
            <SignupPanel />
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="border-b border-border py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">How it works</span>
              <h2 className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Three steps. Under 30 seconds.
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-black p-8 relative overflow-hidden">
                  <span className="absolute bottom-2 right-4 font-display font-extrabold text-white/[0.04] leading-none select-none pointer-events-none" style={{ fontSize: '7rem' }} aria-hidden="true">{step.n}</span>
                  <span className="font-mono text-xs tracking-widest text-green block mb-8 relative z-10">{step.n}</span>
                  <h3 className="text-white font-semibold text-xl mb-3 font-display relative z-10">{step.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed relative z-10">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Report preview ── */}
        <section id="report" className="border-b border-border py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Your report</span>
              <h2 className="font-display font-bold text-white tracking-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Two views. One for you. One for your developer.
              </h2>
              <p className="text-secondary max-w-xl leading-relaxed">
                Every issue has an <strong className="text-white font-semibold">Owner View</strong> — plain English, business impact, what to ask for — and a <strong className="text-white font-semibold">Developer View</strong> with step-by-step fix instructions, WCAG references, and effort estimates.
              </p>
            </div>

            {/* Two-column preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mb-10">

              {/* Owner View */}
              <div className="bg-black p-7 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 bg-green text-black font-semibold">Owner View</span>
                  <span className="font-mono text-[10px] text-secondary">plain English · no jargon</span>
                </div>

                <div className="border border-fail/30 bg-surface px-4 py-3 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 text-fail bg-fail/10">Critical</span>
                  <span className="text-white text-sm font-semibold">Images have no description for screen readers</span>
                </div>

                <div className="space-y-4 px-1">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">Who is affected</p>
                    <p className="text-secondary text-sm leading-relaxed">People who are blind or have low vision and use a screen reader to navigate the web.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">Why it matters</p>
                    <p className="text-secondary text-sm leading-relaxed">Screen reader users will hear nothing when they reach these images. This is a direct EAA compliance risk affecting roughly 1 in 6 people.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">What to do next</p>
                    <p className="text-secondary text-sm leading-relaxed">Forward this report to your developer and ask them to add a text description to every meaningful image.</p>
                  </div>
                </div>
              </div>

              {/* Developer View */}
              <div className="bg-black p-7 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 bg-surface border border-border text-white">Developer View</span>
                  <span className="font-mono text-[10px] text-secondary">fix instructions · WCAG refs · effort</span>
                </div>

                <div className="border border-fail/30 bg-surface px-4 py-3 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 text-fail bg-fail/10">Critical</span>
                  <span className="text-white text-sm font-semibold">Images have no description for screen readers</span>
                </div>

                <div className="space-y-4 px-1">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">Fix instruction</p>
                    <p className="text-secondary text-sm leading-relaxed mb-2">Add an <code className="font-mono text-xs bg-surface border border-border px-1 py-0.5 text-green">alt</code> attribute to every <code className="font-mono text-xs bg-surface border border-border px-1 py-0.5 text-green">&lt;img&gt;</code> element. Decorative images use <code className="font-mono text-xs bg-surface border border-border px-1 py-0.5 text-green">alt=&quot;&quot;</code>.</p>
                  </div>
                  <div className="flex gap-8">
                    {[
                      { label: 'Responsible', value: 'Developer' },
                      { label: 'Effort', value: '1–4 hrs' },
                      { label: 'Scope', value: 'Page-level' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-0.5">{label}</p>
                        <p className="font-mono text-xs text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-l-2 border-border pl-4 space-y-1">
                    <p className="font-mono text-xs text-secondary">WCAG 2.2 — 1.1.1 Non-text Content (Level A)</p>
                    <p className="font-mono text-xs text-secondary">EN 301 549 §9.1.1.1</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <a href="/sample-report" className="font-mono text-sm tracking-wider uppercase bg-white text-black px-7 py-3 hover:bg-green transition-colors">
                See a full sample report →
              </a>
              <a href="#scan" className="font-mono text-sm tracking-wider uppercase text-secondary hover:text-white transition-colors">
                Scan your site free →
              </a>
            </div>

          </div>
        </section>

        {/* ── What we check ── */}
        <section id="checks" className="border-b border-border py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">What we check</span>
                <h2 className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  17 checks. Instant results.
                </h2>
              </div>
              <a href="#pricing" className="font-mono text-xs tracking-wider uppercase text-green hover:underline hidden sm:block flex-shrink-0">
                See pricing →
              </a>
            </div>

            <p className="text-secondary mb-12 leading-relaxed max-w-2xl">A11YO runs automated checks across three categories. Free accounts get 5 checks. Pro gets all 17.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {[
                {
                  category: 'Accessibility',
                  tag: 'A11y',
                  color: 'text-green',
                  borderColor: 'border-green/20',
                  checks: ALL_CHECKS.filter(c => c.category === 'A11y'),
                  desc: 'WCAG 2.2 AA — mapped to EN 301 549 and EAA 2025',
                },
                {
                  category: 'SEO',
                  tag: 'SEO',
                  color: 'text-green-mid',
                  borderColor: 'border-green-mid/20',
                  checks: ALL_CHECKS.filter(c => c.category === 'SEO'),
                  desc: 'Meta, Open Graph, HTTPS, and indexability fundamentals',
                },
                {
                  category: 'Launch Readiness',
                  tag: 'Launch',
                  color: 'text-warn',
                  borderColor: 'border-warn/20',
                  checks: ALL_CHECKS.filter(c => c.category === 'Launch'),
                  desc: 'Performance, robots, sitemap, and mobile checks',
                },
              ].map((group) => (
                <div key={group.category} className="bg-black p-8">
                  <div className="mb-6 pb-6 border-b border-border">
                    <span className={`font-mono text-xs tracking-widest uppercase ${group.color} block mb-2`}>{group.category}</span>
                    <p className="font-mono text-[10px] text-secondary leading-relaxed">{group.desc}</p>
                  </div>
                  <ul className="space-y-0 divide-y divide-border/50">
                    {group.checks.map((check) => (
                      <li key={check.label} className={`flex items-center gap-3 py-3 ${!check.free ? 'opacity-40' : ''}`}>
                        <span className={check.free ? `${group.color} flex-shrink-0` : 'text-border flex-shrink-0'}>
                          {check.free ? <PassIcon size={13} /> : <LockIcon size={13} />}
                        </span>
                        <span className={`text-sm flex-1 ${check.free ? 'text-white' : 'text-secondary'}`}>
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="grid-bg border-b border-border py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14 text-center">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Pricing</span>
              <h2 className="font-display font-bold text-white tracking-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Simple pricing. No surprises.
              </h2>
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
                  <p className="text-secondary text-sm">No account, no card — just paste and go.</p>
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

              {/* Action Plan */}
              <div className="bg-black p-8">
                <div className="mb-6">
                  <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Action Plan</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-semibold text-white">€10</span>
                    <span className="text-secondary text-sm">one-time</span>
                  </div>
                  <p className="text-secondary text-sm">Pay once. Get 10 scans a day and full history — no subscription.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {ACTION_PLAN_FEATURES.map((f) => (
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
                  Get Action Plan — €10 →
                </a>
              </div>

              {/* Recurring */}
              <div className="relative corner-mark p-8 bg-black border border-green/30">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs tracking-widest uppercase text-green">Recurring</span>
                    <span className="font-mono text-[10px] border border-green/30 text-green px-2 py-0.5 uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-semibold text-white">€29</span>
                    <span className="text-secondary text-sm">/ month</span>
                  </div>
                  <p className="text-secondary text-sm">Everything you need to audit client sites and track history.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {RECURRING_FEATURES.map((f) => (
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
                  Get Recurring — €29/month →
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Chrome Extension ── */}
        <section className="border-b border-border py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              {/* Copy */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-xs tracking-widest uppercase text-green">Chrome Extension</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green/60 px-2 py-0.5 uppercase tracking-wider">Beta</span>
                </div>
                <h2 className="font-display font-bold text-white tracking-tight leading-tight mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  Audit while you browse.
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  The A11YO Chrome Extension runs a full accessibility check on any page you&apos;re looking at — no copy-pasting, no tab-switching.
                </p>
                <p className="text-secondary leading-relaxed mb-8">
                  One click on any page — staging, localhost, or a client&apos;s live site. Plain-English results. Shareable report. Saved to your dashboard automatically.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    'One click — no copy-pasting URLs',
                    'Guest scan: free, no account needed',
                    'Shareable report link saved to your dashboard',
                    'Works on localhost and staging URLs',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 bg-green flex-shrink-0" aria-hidden="true" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="/extension" className="font-mono text-xs tracking-wider uppercase bg-white text-black px-6 py-3 hover:bg-green transition-colors text-center">
                    Learn more →
                  </a>
                  <div className="flex-1">
                    <WaitlistForm placeholder="Notify me at launch" />
                  </div>
                </div>
              </div>

              {/* Extension popup mockup */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="border border-border bg-black shadow-lg" style={{ width: 300 }}>
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
                      <div><div className="font-mono text-base font-bold text-fail">2</div><div className="font-mono text-[9px] text-secondary">Critical</div></div>
                      <div><div className="font-mono text-base font-bold text-warn">3</div><div className="font-mono text-[9px] text-secondary">Should fix</div></div>
                      <div><div className="font-mono text-base font-bold text-secondary">1</div><div className="font-mono text-[9px] text-secondary">Nice to have</div></div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      { label: 'Images have no text description', sev: 'CRITICAL', cls: 'text-fail bg-fail/10' },
                      { label: 'Form fields have no labels', sev: 'CRITICAL', cls: 'text-fail bg-fail/10' },
                      { label: 'Text may be hard to read', sev: 'SHOULD FIX', cls: 'text-warn bg-warn/10' },
                      { label: 'No meta description found', sev: 'SHOULD FIX', cls: 'text-warn bg-warn/10' },
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
              </div>

            </div>
          </div>
        </section>

        {/* ── Blog ── */}
        <section id="blog" className="border-b border-border py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">From the blog</span>
              <h2 className="font-display font-semibold text-white tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                From the A11YO blog
              </h2>
            </div>
            <p className="text-secondary mb-10 leading-relaxed">Practical guides on web accessibility, WCAG compliance, and getting sites ready for the European Accessibility Act.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {BLOG_POSTS.map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}`} className="bg-black p-10 flex flex-col group border-b-2 border-transparent hover:border-green transition-colors">
                  <div className="flex items-center justify-between mb-8">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border ${
                      BLOG_CATEGORY_COLORS[post.category] === 'text-green' ? 'text-green border-green/30' :
                      BLOG_CATEGORY_COLORS[post.category] === 'text-green-mid' ? 'text-green-mid border-green-mid/30' :
                      'text-warn border-warn/30'
                    }`}>
                      {post.category}
                    </span>
                    <span className="font-mono text-xs text-muted">{post.date}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg leading-snug mb-4 group-hover:text-green transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed flex-1 mb-8">
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

      {/* ── FAQ ── */}
      <section className="border-b border-border py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display font-semibold text-white tracking-tight mb-10" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            About A11YO
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="font-mono text-sm tracking-wide text-white mb-3">What is A11YO?</h3>
              <p className="text-secondary text-sm leading-relaxed">A11YO is a free web accessibility and launch-readiness checker. Paste any URL and get an automated WCAG 2.2 AA audit in under 30 seconds — with plain-English fixes for every issue found.</p>
            </div>
            <div>
              <h3 className="font-mono text-sm tracking-wide text-white mb-3">Who is A11YO for?</h3>
              <p className="text-secondary text-sm leading-relaxed">A11YO is built for web developers, digital agencies, and business owners who need to check their site&apos;s accessibility compliance quickly — without commissioning a full audit. It&apos;s particularly useful for teams working toward EAA 2025 or WCAG 2.2 AA requirements.</p>
            </div>
            <div>
              <h3 className="font-mono text-sm tracking-wide text-white mb-3">Is A11YO free?</h3>
              <p className="text-secondary text-sm leading-relaxed">Yes. A11YO is free to use with no account required. Free accounts run 5 checks. Pro accounts (€5/month) unlock all 17 checks, scan history, and PDF export.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <SiteFooter maxWidth="max-w-7xl" />

    </div>
  );
}
