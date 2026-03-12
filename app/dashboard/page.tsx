/**
 * F-002 — User Dashboard (/dashboard)
 * PRD ref: §F-002
 */
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';
import LogoutButton from './LogoutButton';
import NewScanFormClient from './NewScanForm';
import Logo from '@/components/Logo';
import ScoreChart from '@/components/ScoreChart';

export const metadata: Metadata = { title: 'Dashboard' };
export const revalidate = 0;

const PLAN_CONFIG: Record<string, { label: string; badgeCls: string; limit: number }> = {
  free:         { label: 'Free',      badgeCls: 'text-secondary border-border', limit: 1 },
  onceoff:      { label: 'One-Off',   badgeCls: 'text-green border-green',      limit: 10 },
  recurring:    { label: 'Recurring', badgeCls: 'text-green border-green',      limit: 20 },
  agency:       { label: 'Agency',    badgeCls: 'text-green border-green',      limit: 9999 },
  // legacy
  early_access: { label: 'Pro',       badgeCls: 'text-green border-green',      limit: 20 },
  pro:          { label: 'Pro',       badgeCls: 'text-green border-green',      limit: 20 },
};

const PAID_PLANS = new Set(['onceoff', 'recurring', 'agency', 'pro', 'early_access']);
const CHART_PLANS = new Set(['recurring', 'agency']);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function scoreColor(score: number | null) {
  if (score === null) return 'text-secondary';
  if (score >= 80) return 'text-green';
  if (score >= 50) return 'text-warn';
  return 'text-fail';
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const profile = await getProfile(user.id);
  const plan = profile?.plan ?? 'free';
  const planConfig = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;
  const isPaid = PAID_PLANS.has(plan);
  const showChart = CHART_PLANS.has(plan);

  const supabase = createSupabaseServerClient();

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
      .select('id, url, summary, score, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const scansToday = usedToday ?? 0;
  const dailyLimit = planConfig.limit;
  const limitReached = !isPaid && scansToday >= dailyLimit;

  // Build delta map: for each scan, find the previous scan of the same URL
  const urlHistory: Record<string, number[]> = {};
  // scans are newest-first; reverse to build history oldest-first
  const scansAsc = [...(scans ?? [])].reverse();
  for (const s of scansAsc) {
    if (s.score == null) continue;
    if (!urlHistory[s.url]) urlHistory[s.url] = [];
    urlHistory[s.url].push(s.score);
  }

  // Delta: current score minus previous score for same URL
  const urlScanIndex: Record<string, number> = {};
  const deltaMap: Record<string, number | null> = {};
  for (const s of scansAsc) {
    const idx = urlScanIndex[s.url] ?? 0;
    urlScanIndex[s.url] = idx + 1;
    if (s.score == null || idx === 0) {
      deltaMap[s.id] = null;
    } else {
      const hist = urlHistory[s.url];
      deltaMap[s.id] = s.score - hist[idx - 1];
    }
  }

  // For ScoreChart: pick the URL with the most scans
  let chartUrl = '';
  let chartData: { label: string; score: number }[] = [];
  if (showChart && scans && scans.length >= 2) {
    const urlCounts: Record<string, typeof scans> = {};
    for (const s of scansAsc) {
      if (!urlCounts[s.url]) urlCounts[s.url] = [];
      if (s.score != null) urlCounts[s.url].push(s);
    }
    const topUrl = Object.entries(urlCounts).sort((a, b) => b[1].length - a[1].length)[0];
    if (topUrl && topUrl[1].length >= 2) {
      chartUrl = topUrl[0];
      chartData = topUrl[1].map((s) => ({ label: shortDate(s.created_at), score: s.score! }));
    }
  }

  const displayScans = (scans ?? []).slice(0, 20);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-green transition-colors" aria-label="A11YO home">
            <Logo size={28} />
          </Link>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-xs uppercase tracking-wider border px-2 py-0.5 ${planConfig.badgeCls}`}>
              {planConfig.label}
            </span>
            <Link href="/account" className="font-mono text-xs text-secondary hidden sm:block truncate max-w-[200px] hover:text-white transition-colors" title="Account settings">
              {user.email}
            </Link>
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

          {/* Score trend chart (recurring/agency with enough data) */}
          {showChart && chartData.length >= 2 && (
            <ScoreChart data={chartData} url={chartUrl} />
          )}

          {/* Scan counter */}
          {planConfig.limit < 9999 && (
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
              <p className="text-secondary text-sm">Resets at midnight. Upgrade for more scans.</p>
            </div>
          ) : (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-2">New scan</p>
              <NewScanFormClient />
            </div>
          )}

          {/* Upgrade CTA (free users only) */}
          {!isPaid && (
            <div className="corner-mark border border-border bg-surface px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-green mb-1">Unlock fix details</p>
                <p className="text-white font-semibold mb-1">See exactly how to fix every issue</p>
                <p className="text-secondary text-sm">One-off €10 · Recurring €29/mo · Agency €99/mo</p>
              </div>
              <Link
                href="/pricing"
                className="font-mono text-xs tracking-wider uppercase bg-green text-black px-5 py-2.5 hover:bg-green-mid transition-colors whitespace-nowrap"
              >
                See plans →
              </Link>
            </div>
          )}

          {/* Scan history */}
          <section aria-labelledby="history-heading">
            <h2 id="history-heading" className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Recent scans
            </h2>

            {displayScans.length === 0 ? (
              <div className="corner-mark border border-border bg-surface p-12 text-center">
                <p className="text-white font-semibold mb-1">No scans yet</p>
                <p className="text-secondary text-sm">Run your first audit above to see results here.</p>
              </div>
            ) : (
              <div className="corner-mark border border-border bg-surface divide-y divide-border overflow-x-auto">
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">URL</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary hidden sm:block">Score</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary hidden sm:block">Delta</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary hidden sm:block">Date</span>
                  <span className="sr-only">Actions</span>
                </div>
                {displayScans.map((scan) => {
                  const score = scan.score ?? null;
                  const delta = deltaMap[scan.id] ?? null;
                  return (
                    <div
                      key={scan.id}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-white text-sm truncate font-mono min-w-0" title={scan.url}>{scan.url}</span>
                      <span className={`font-mono text-sm font-semibold hidden sm:block ${scoreColor(score)}`}>
                        {score !== null ? `${score}%` : '—'}
                      </span>
                      <span className="font-mono text-xs hidden sm:block w-12 text-right">
                        {delta === null ? (
                          <span className="text-secondary">—</span>
                        ) : delta > 0 ? (
                          <span className="text-green">+{delta}</span>
                        ) : delta < 0 ? (
                          <span className="text-fail">{delta}</span>
                        ) : (
                          <span className="text-secondary">±0</span>
                        )}
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
