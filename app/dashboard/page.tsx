/**
 * F-002 — User Dashboard (/dashboard)
 * PRD ref: §F-002
 */
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';
import LogoutButton from './LogoutButton';
import NewScanFormClient from './NewScanForm';

export const metadata: Metadata = { title: 'Dashboard' };
export const revalidate = 0;

const FREE_DAILY_LIMIT = 3;
const EARLY_ACCESS_LIMIT = 20;
const PRO_LIMIT = 50;

const PLAN_CONFIG: Record<string, { label: string; badgeCls: string; limit: number }> = {
  free:         { label: 'Free',         badgeCls: 'text-secondary border-border', limit: FREE_DAILY_LIMIT },
  early_access: { label: 'Early Access', badgeCls: 'text-green border-green',      limit: EARLY_ACCESS_LIMIT },
  pro:          { label: 'Pro',          badgeCls: 'text-green border-green',       limit: PRO_LIMIT },
  agency:       { label: 'Agency',       badgeCls: 'text-green border-green',       limit: 9999 },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function scoreFromSummary(summary: string | null): number | null {
  if (!summary) return null;
  const match = summary.match(/^(\d+)\/(\d+)/);
  if (!match) return null;
  const passed = parseInt(match[1]);
  const total = parseInt(match[2]);
  return total > 0 ? Math.round((passed / total) * 100) : null;
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const profile = await getProfile(user.id);
  const plan = profile?.plan ?? 'free';
  const planConfig = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;

  const supabase = createSupabaseServerClient();

  // Today's scan count
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [{ count: usedToday }, { data: scans }] = await Promise.all([
    supabase
      .from('scans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString()),
    supabase
      .from('scans')
      .select('id, url, summary, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const scansToday = usedToday ?? 0;
  const dailyLimit = planConfig.limit;
  const limitReached = plan === 'free' && scansToday >= dailyLimit;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-widest uppercase text-white hover:text-green transition-colors">
            A11YO
          </Link>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-xs uppercase tracking-wider border px-2 py-0.5 ${planConfig.badgeCls}`}>
              {planConfig.label}
            </span>
            <span className="font-mono text-xs text-secondary hidden sm:block truncate max-w-[200px]">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-green block mb-2">Dashboard</span>
            <h1 className="text-3xl font-display font-extrabold text-white">Your audits</h1>
          </div>

          {/* Scan counter (free plan) */}
          {plan === 'free' && (
            <div className="corner-mark border border-border bg-surface px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">Scans today</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-display text-3xl font-extrabold ${limitReached ? 'text-fail' : 'text-white'}`}>
                      {scansToday}
                    </span>
                    <span className="font-mono text-xs text-secondary">/ {dailyLimit}</span>
                  </div>
                </div>
                {!limitReached && (
                  <span className="font-mono text-xs text-secondary">
                    {dailyLimit - scansToday} remaining today
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${limitReached ? 'bg-fail' : 'bg-green'}`}
                  style={{ width: `${Math.min(100, (scansToday / dailyLimit) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* New scan form or limit reached banner */}
          {limitReached ? (
            <div className="corner-mark border border-fail/30 bg-fail/5 px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-widest text-fail mb-1">Daily limit reached</p>
              <p className="text-white font-semibold mb-1">You&apos;ve used all {dailyLimit} free scans today.</p>
              <p className="text-secondary text-sm">Resets at midnight. Get more scans below.</p>
            </div>
          ) : (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-2">New scan</p>
              <NewScanFormClient />
            </div>
          )}

          {/* Upgrade CTAs (free users only) */}
          {plan === 'free' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="corner-mark border border-border bg-surface px-6 py-5">
                <p className="font-mono text-xs uppercase tracking-widest text-green mb-2">Have an access code?</p>
                <p className="text-white font-semibold mb-1">Unlock early access — free</p>
                <p className="text-secondary text-sm mb-4">
                  Full 17-check reports, PDF exports, and {EARLY_ACCESS_LIMIT} scans/day for 12 months. No card needed.
                </p>
                <Link
                  href="/early-access"
                  className="inline-block font-mono text-xs tracking-wider uppercase bg-green text-black px-5 py-2.5 hover:bg-green-mid transition-colors"
                >
                  Redeem code →
                </Link>
              </div>
              <div className="corner-mark border border-border bg-surface px-6 py-5">
                <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-2">Pro plan</p>
                <p className="text-white font-semibold mb-1">€10 / month</p>
                <p className="text-secondary text-sm mb-4">
                  {PRO_LIMIT} scans/day, all 17 checks, PDF exports, scan history, and priority support.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block font-mono text-xs tracking-wider uppercase border border-border text-secondary px-5 py-2.5 hover:text-white hover:border-white transition-colors"
                >
                  See pricing →
                </Link>
              </div>
            </div>
          )}

          {/* Scan history */}
          <section aria-labelledby="history-heading">
            <h2 id="history-heading" className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Recent scans
            </h2>

            {!scans || scans.length === 0 ? (
              <div className="corner-mark border border-border bg-surface p-12 text-center">
                <p className="text-white font-semibold mb-1">No scans yet</p>
                <p className="text-secondary text-sm">Run your first audit above to see results here.</p>
              </div>
            ) : (
              <div className="corner-mark border border-border bg-surface divide-y divide-border overflow-x-auto">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">URL</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary hidden sm:block">Score</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary hidden sm:block">Date</span>
                  <span className="sr-only">Actions</span>
                </div>
                {scans.map((scan) => {
                  const pct = scoreFromSummary(scan.summary);
                  return (
                    <div
                      key={scan.id}
                      className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-white text-sm truncate font-mono" title={scan.url}>{scan.url}</span>
                      <span className={`font-mono text-sm font-semibold hidden sm:block ${
                        pct === null ? 'text-secondary'
                        : pct >= 80 ? 'text-green'
                        : pct >= 50 ? 'text-warn'
                        : 'text-fail'
                      }`}>
                        {pct !== null ? `${pct}%` : '—'}
                      </span>
                      <span className="font-mono text-xs text-secondary hidden sm:block">{formatDate(scan.created_at)}</span>
                      <Link
                        href={`/report/${scan.id}`}
                        className="font-mono text-xs uppercase tracking-wider text-green hover:underline whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-xs text-secondary">A11YO · {user.email}</span>
        </div>
      </footer>
    </div>
  );
}
