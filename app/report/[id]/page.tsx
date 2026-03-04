import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ScanRecord } from '@/lib/types';
import ReportSection from '@/components/ReportSection';
import CopyButton from '@/components/CopyButton';

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

  const allChecks = [...results.accessibility, ...results.seo, ...results.launch];
  const totalPassed = allChecks.filter((c) => c.status === 'pass').length;
  const totalChecks = allChecks.length;
  const overallPct = Math.round((totalPassed / totalChecks) * 100);

  const scoreColor =
    overallPct >= 80 ? 'text-pass' : overallPct >= 50 ? 'text-amber' : 'text-fail';

  const reportUrl = `https://launchcheck.vercel.app/report/${params.id}`;

  return (
    <div className="min-h-screen bg-lc-bg grid-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-lc-fg hover:text-lc-purple transition-colors"
          >
            LaunchCheck
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
          <div className="corner-mark border border-lc-border bg-lc-card p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-2">
                  Scan Report
                </span>
                <a
                  href={scan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lc-fg font-semibold text-sm hover:text-lc-purple transition-colors break-all block mb-1"
                >
                  {scan.url}
                </a>
                <p className="font-mono text-xs text-lc-muted">
                  {formatDate(scan.created_at)}
                </p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <span className={`font-mono text-4xl font-semibold ${scoreColor}`}>
                  {overallPct}
                  <span className="text-xl">%</span>
                </span>
                <p className="font-mono text-xs text-lc-muted mt-0.5">
                  {totalPassed}/{totalChecks} passed
                </p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-lc-border flex items-center justify-between gap-4">
              <p className="font-mono text-xs text-lc-muted">
                Share this report
              </p>
              <CopyButton url={reportUrl} />
            </div>
          </div>

          {/* Sections */}
          <ReportSection title="Accessibility" icon="♿" checks={results.accessibility} />
          <ReportSection title="SEO Basics" icon="◎" checks={results.seo} />
          <ReportSection title="Launch Readiness" icon="↗" checks={results.launch} />

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-lc-border px-6 py-5 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-mono text-xs text-lc-muted tracking-wider">
            Powered by LaunchCheck
          </span>
        </div>
      </footer>
    </div>
  );
}
