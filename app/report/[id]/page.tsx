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
    overallPct >= 80 ? 'text-green-mid' : overallPct >= 50 ? 'text-warn' : 'text-fail';

  const reportUrl = `https://a11yo.vercel.app/report/${params.id}`;

  return (
    <div className="min-h-screen bg-black grid-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-white hover:text-green transition-colors"
          >
            A11YO
          </Link>
          <Link
            href="/"
            className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors"
          >
            ← New scan
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Report header card */}
          <div className="corner-mark border border-border bg-surface">
            <div className="px-6 pt-6 pb-5">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-4">
                Scan Report
              </span>
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <a
                    href={scan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-green transition-colors break-all block mb-1"
                  >
                    {scan.url}
                  </a>
                  <p className="font-mono text-xs text-secondary">
                    {formatDate(scan.created_at)}
                  </p>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <span className={`font-mono text-5xl font-semibold leading-none ${scoreColor}`}>
                    {overallPct}<span className="text-2xl">%</span>
                  </span>
                  <p className="font-mono text-xs text-secondary mt-1">
                    {totalPassed}/{totalChecks} free checks
                  </p>
                </div>
              </div>
            </div>

            {/* Score gauge bar */}
            <div className="h-1 bg-border">
              <div
                className="h-full transition-all"
                style={{
                  width: `${overallPct}%`,
                  backgroundColor: overallPct >= 80 ? '#16A34A' : overallPct >= 50 ? '#D97706' : '#DC2626',
                }}
              />
            </div>

            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <p className="font-mono text-xs text-secondary">Share this report</p>
              <CopyButton url={reportUrl} />
            </div>
          </div>

          {/* Sections */}
          <ReportSection title="Accessibility" icon="♿" checks={freeAccessibility} />
          <ReportSection title="SEO Basics" icon="◎" checks={freeSeo} />
          <ReportSection title="Launch Readiness" icon="↗" checks={freeLaunch} />

          {/* Upgrade CTA */}
          <div className="corner-mark border border-border" style={{ backgroundColor: 'var(--color-green-dark)' }}>
            <div className="h-0.5 w-full" style={{ backgroundColor: 'var(--color-green)' }} />
            <div className="px-6 py-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs tracking-widest uppercase text-green">
                      Pro
                    </span>
                    <span className="font-mono text-[10px] bg-green text-white px-2 py-0.5 uppercase tracking-widest">
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
                  className="flex-shrink-0 font-mono text-xs tracking-wider uppercase border border-green px-5 py-2.5 text-green hover:bg-green hover:text-white transition-colors whitespace-nowrap mt-1"
                >
                  Join waitlist →
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-mono text-xs text-secondary tracking-wider">
            Powered by A11YO
          </span>
        </div>
      </footer>
    </div>
  );
}
