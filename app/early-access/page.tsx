'use client';

/**
 * F-004 — Early Access page (/early-access)
 * Shows remaining slots, code input form, and redemption confirmation.
 * PRD ref: §F-004
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

interface SlotsData {
  used: number;
  remaining: number;
  total: number;
}

export default function EarlyAccessPage() {
  const [slots, setSlots] = useState<SlotsData | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/early-access')
      .then((r) => r.json())
      .then((d) => setSlots(d))
      .catch(() => null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResult({ type: 'success', message: data.message });
        // Refresh slot count
        fetch('/api/early-access').then((r) => r.json()).then(setSlots).catch(() => null);
      } else {
        setResult({ type: 'error', message: data.error ?? 'Something went wrong.' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error — please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const exhausted = slots !== null && slots.remaining === 0;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} cta={{ href: '/', label: 'Full audit →' }} maxWidth="max-w-2xl" />

      <main id="main-content" className="flex-1 py-16 px-6">
        <div className="max-w-2xl mx-auto">

          <span className="font-mono text-xs uppercase tracking-widest text-green block mb-4">
            Early Access
          </span>
          <h1 className="text-4xl font-display font-extrabold text-white mb-3">
            Get full access — free.
          </h1>
          <p className="text-secondary leading-relaxed mb-10 max-w-lg">
            A11YO is in early access. Enter your code below to unlock full reports, scan history, and
            PDF exports — free for 12 months.
          </p>

          {/* Slot counter */}
          <div className="corner-mark border border-border bg-surface px-6 py-5 mb-8">
            {slots === null ? (
              <div className="h-8 bg-border/30 rounded animate-pulse w-48" />
            ) : exhausted ? (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fail mb-1">Slots full</p>
                <p className="text-white font-semibold">All 25 early access slots have been filled.</p>
                <p className="text-secondary text-sm mt-1">
                  <Link href="/pricing" className="text-green underline hover:no-underline">Upgrade to Pro</Link>{' '}
                  for full access from €10/month.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">Slots remaining</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-green">{slots.remaining}</span>
                    <span className="font-mono text-xs text-secondary">/ {slots.total}</span>
                  </div>
                </div>
                {/* Slot progress bar */}
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green transition-all"
                    style={{ width: `${(slots.used / slots.total) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-secondary whitespace-nowrap">
                  {slots.used} used
                </span>
              </div>
            )}
          </div>

          {/* Code input form */}
          {!exhausted && result?.type !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="early-access-code" className="font-mono text-xs uppercase tracking-widest text-secondary block mb-2">
                  Early access code
                </label>
                <div className="flex gap-3">
                  <input
                    id="early-access-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="A11YO-EARLY-2025"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-surface border border-border text-white font-mono text-sm px-4 py-3 placeholder-secondary focus:outline-none focus:border-green transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="font-mono text-xs tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? 'Checking…' : 'Redeem →'}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {result?.type === 'error' && (
                <p
                  className="font-mono text-xs text-fail bg-fail/10 border border-fail/20 px-4 py-3"
                  role="alert"
                >
                  {result.message}
                </p>
              )}

              <p className="font-mono text-xs text-secondary">
                Don&apos;t have a code?{' '}
                <a href="mailto:hello@a11yo.io" className="text-green hover:underline">
                  Get in touch
                </a>{' '}
                or{' '}
                <Link href="/auth/signup" className="text-green hover:underline">
                  create a free account
                </Link>{' '}
                to start scanning.
              </p>
            </form>
          )}

          {/* Not signed in prompt */}
          {result?.type === 'error' && result.message.includes('signed in') && (
            <div className="mt-4 flex gap-3">
              <Link
                href="/auth/login"
                className="font-mono text-xs tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors"
              >
                Sign in →
              </Link>
              <Link
                href="/auth/signup"
                className="font-mono text-xs tracking-wider uppercase border border-border px-6 py-3 text-secondary hover:text-white hover:border-white transition-colors"
              >
                Create account →
              </Link>
            </div>
          )}

          {/* Success state */}
          {result?.type === 'success' && (
            <div className="corner-mark border border-green/30 bg-green/5 px-6 py-6" role="alert">
              <span className="font-mono text-xs uppercase tracking-widest text-green block mb-2">
                Access granted
              </span>
              <p className="text-white font-semibold mb-1">{result.message}</p>
              <p className="text-secondary text-sm mb-5">
                Your account now has full access for 12 months. Run your first full scan below.
              </p>
              <Link
                href="/"
                className="inline-block font-mono text-xs tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors"
              >
                Scan my website →
              </Link>
            </div>
          )}

          {/* What you get */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-5">
              What&apos;s included
            </p>
            <ul className="space-y-3">
              {[
                'Full 17-check accessibility report in plain English',
                'Severity ratings: Critical, Should Fix, Nice to Have',
                'Per-issue fix instructions your developer can act on immediately',
                'Scan history — access all your previous reports',
                'PDF export for developer handoff',
                'Free for 12 months from redemption',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-green mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                  <span className="text-secondary text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <SiteFooter maxWidth="max-w-2xl" />
    </div>
  );
}
