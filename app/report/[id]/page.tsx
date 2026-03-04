import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ScanRecord } from '@/lib/types';
import ReportSection from '@/components/ReportSection';
import CopyButton from '@/components/CopyButton';

const FREE_CHECK_IDS = new Set(['image-alt', 'color-contrast', 'meta-description', 'https', 'load-time']);

interface PageProps {
  params: { id: string };
}

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function ReportPage({ params }: PageProps) {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) notFound();

  const scan = data as ScanRecord;
  const { results } = scan;

  const freeAccessibility = results.accessibility.filter((c) => FREE_CHECK_IDS.has(c.id));
  const freeSeo = results.seo.filter((c) => FREE_CHECK_IDS.has(c.id));
  const freeLaunch = results.launch.filter((c) => FREE_CHECK_IDS.has(c.id));
  const freeChecks = [...freeAccessibility, ...freeSeo, ...freeLaunch];
  const lockedCount = results.accessibility.length + results.seo.length + results.launch.length - freeChecks.length;

  const totalPassed = freeChecks.filter((c) => c.status === 'pass').length;
  const totalChecks = freeChecks.length;
  const overallPct = Math.round((totalPassed / totalChecks) * 100);

  const scoreColor =
    overallPct >= 80 ? 'text-pass' : overallPct >= 50 ? 'text-amber' : 'text-fail';

  const reportUrl = `https://a11yo.vercel.app/report/${params.id}`;

  return (
    <div className="min-h-screen bg-lc-bg grid-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-lc-fg hover:text-lc-purple transition-colors"
          >
            A11YO
          </Link>
          <Link
            href="/"
            className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors"
          >
            ← New scan
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Report header card */}
          <div className="corner-mark border border-lc-border bg-lc-card">
            <div className="px-6 pt-6 pb-5">
              <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-4">
                Scan Report
              </span>
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <a
                    href={scan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lc-fg font-semibold hover:text-lc-purple transition-colors break-all block mb-1"
                  >
                    {scan.url}
                  </a>
                  <p className="font-mono text-xs text-lc-muted">
                    {formatDate(scan.created_at)}
                  </p>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <span className={`font-mono text-5xl font-semibold leading-none ${scoreColor}`}>
                    {overallPct}<span className="text-2xl">%</span>
                  </span>
                  <p className="font-mono text-xs text-lc-muted mt-1">
                    {totalPassed}/{totalChecks} free checks
                  </p>
                </div>
              </div>
            </div>

            {/* Score gauge bar */}
            <div className="h-1 bg-lc-border">
              <div
                className="h-full transition-all"
                style={{
                  width: `${overallPct}%`,
                  backgroundColor: overallPct >= 80 ? '#16A34A' : overallPct >= 50 ? '#D97706' : '#DC2626',
                }}
              />
            </div>

            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <p className="font-mono text-xs text-lc-muted">Share this report</p>
              <CopyButton url={reportUrl} />
            </div>
          </div>

          {/* Sections */}
          <ReportSection title="Accessibility" icon="♿" checks={freeAccessibility} />
          <ReportSection title="SEO Basics" icon="◎" checks={freeSeo} />
          <ReportSection title="Launch Readiness" icon="↗" checks={freeLaunch} />

          {/* Upgrade CTA */}
          <div className="corner-mark border border-lc-border" style={{ backgroundColor: '#0C0B09' }}>
            <div className="h-0.5 w-full" style={{ backgroundColor: '#9177CF' }} />
            <div className="px-6 py-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs tracking-widest uppercase text-lc-purple">
                      Pro
                    </span>
                    <span className="font-mono text-[10px] bg-lc-purple text-white px-2 py-0.5 uppercase tracking-widest">
                      {lockedCount} checks locked
                    </span>
                  </div>
                  <p className="text-white font-semibold mb-1">Unlock the full report</p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    All 17 checks, multi-page crawls, scheduled scans, and PDF exports.
                  </p>
                </div>
                <a
                  href="mailto:hello@a11yo.io?subject=Pro waitlist"
                  className="flex-shrink-0 font-mono text-xs tracking-wider uppercase border border-lc-purple px-5 py-2.5 text-lc-purple hover:bg-lc-purple hover:text-white transition-colors whitespace-nowrap mt-1"
                >
                  Join waitlist →
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-lc-border px-6 py-5 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-mono text-xs text-lc-muted tracking-wider">
            Powered by A11YO
          </span>
        </div>
      </footer>
    </div>
  );
}
