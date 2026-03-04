import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';
import LogoutButton from './LogoutButton';

export const metadata: Metadata = { title: 'Dashboard' };
export const revalidate = 0;

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:   { label: 'Free',   color: 'text-lc-muted border-lc-border' },
  pro:    { label: 'Pro',    color: 'text-lc-accent border-lc-accent' },
  agency: { label: 'Agency', color: 'text-lc-accent border-lc-accent' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const profile = await getProfile(user.id);
  const plan = profile?.plan ?? 'free';
  const planMeta = PLAN_LABELS[plan] ?? PLAN_LABELS.free;

  // Fetch this user's recent scans
  const supabase = createSupabaseServerClient();
  const { data: scans } = await supabase
    .from('scans')
    .select('id, url, summary, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-lc-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-sm font-bold text-lc-fg hover:text-lc-accent transition-colors">
            A11YO
          </Link>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-xs uppercase tracking-wider border px-2 py-0.5 ${planMeta.color}`}>
              {planMeta.label}
            </span>
            <span className="font-mono text-xs text-lc-muted hidden sm:block truncate max-w-[200px]">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-lc-accent block mb-3">Dashboard</span>
            <h1 className="text-3xl font-display font-semibold text-lc-fg">Your audits</h1>
          </div>

          {/* New scan */}
          <NewScanForm />

          {/* Upgrade banner (free users) */}
          {plan === 'free' && (
            <div className="border border-lc-border bg-lc-card p-5 mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-lc-fg text-sm font-semibold mb-0.5">You&apos;re on the Free plan</p>
                <p className="text-lc-muted text-xs">5 checks per scan, single page only. Upgrade for all 17 checks + crawl.</p>
              </div>
              <Link
                href="/pricing"
                className="flex-shrink-0 font-mono text-xs uppercase tracking-wider border border-lc-accent text-lc-accent px-4 py-2 hover:bg-lc-accent hover:text-lc-bg transition-colors"
              >
                Upgrade →
              </Link>
            </div>
          )}

          {/* Scan history */}
          <section aria-labelledby="history-heading">
            <h2 id="history-heading" className="font-mono text-xs uppercase tracking-widest text-lc-muted mb-4">
              Recent scans
            </h2>

            {!scans || scans.length === 0 ? (
              <div className="border border-lc-border bg-lc-card p-12 text-center">
                <p className="text-lc-fg font-semibold mb-1">No scans yet</p>
                <p className="text-lc-muted text-sm">Run your first audit above to see results here.</p>
              </div>
            ) : (
              <div className="border border-lc-border bg-lc-card divide-y divide-lc-border">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-lc-border">
                  <span className="font-mono text-xs uppercase tracking-wider text-lc-muted">URL</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-lc-muted hidden sm:block">Score</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-lc-muted hidden sm:block">Date</span>
                  <span className="sr-only">Actions</span>
                </div>
                {scans.map((scan) => {
                  const match = scan.summary?.match(/^(\d+)\/(\d+)/);
                  const pct = match ? Math.round(parseInt(match[1]) / parseInt(match[2]) * 100) : null;
                  return (
                    <div key={scan.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors">
                      <span className="text-lc-fg text-sm truncate" title={scan.url}>{scan.url}</span>
                      <span className={`font-mono text-sm font-semibold hidden sm:block ${pct !== null ? (pct >= 80 ? 'text-pass' : pct >= 50 ? 'text-amber' : 'text-fail') : 'text-lc-muted'}`}>
                        {pct !== null ? `${pct}%` : '—'}
                      </span>
                      <span className="font-mono text-xs text-lc-muted hidden sm:block">{formatDate(scan.created_at)}</span>
                      <Link
                        href={`/report/${scan.id}`}
                        className="font-mono text-xs uppercase tracking-wider text-lc-accent hover:underline whitespace-nowrap"
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

      <footer className="border-t border-lc-border px-6 py-5">
        <div className="max-w-5xl mx-auto text-center">
          <span className="font-mono text-xs text-lc-muted">A11YO</span>
        </div>
      </footer>
    </div>
  );
}

// ── Client components ──────────────────────────────────

function NewScanForm() {
  return <NewScanFormClient />;
}

import NewScanFormClient from './NewScanForm';
