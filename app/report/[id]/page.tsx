import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ScanRecord } from '@/lib/types';
import ReportSection from '@/components/ReportSection';
import CopyButton from '@/components/CopyButton';

interface PageProps {
  params: { id: string };
}

export const revalidate = 0; // always fetch fresh

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

  const allChecks = [
    ...results.accessibility,
    ...results.seo,
    ...results.launch,
  ];
  const totalPassed = allChecks.filter((c) => c.status === 'pass').length;
  const totalChecks = allChecks.length;
  const overallPct = Math.round((totalPassed / totalChecks) * 100);

  const reportUrl =
    typeof window === 'undefined'
      ? `https://launchcheck.vercel.app/report/${params.id}`
      : `${window.location.origin}/report/${params.id}`;

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors"
        >
          ← Run another scan
        </Link>

        {/* Report header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs mb-1">Scanned URL</p>
              <a
                href={scan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:text-blue-400 transition-colors break-all"
              >
                {scan.url}
              </a>
              <p className="text-gray-600 text-xs mt-1">
                {formatDate(scan.created_at)}
              </p>
            </div>
            {/* Overall score */}
            <div className="flex-shrink-0 text-center">
              <div
                className={`text-3xl font-bold font-mono ${
                  overallPct >= 80
                    ? 'text-green-400'
                    : overallPct >= 50
                      ? 'text-amber-400'
                      : 'text-red-400'
                }`}
              >
                {overallPct}%
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                {totalPassed}/{totalChecks} passed
              </p>
            </div>
          </div>

          {/* Share */}
          <CopyButton url={reportUrl} />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <ReportSection
            title="Accessibility"
            icon="♿"
            checks={results.accessibility}
            defaultOpen={true}
          />
          <ReportSection
            title="SEO Basics"
            icon="🔍"
            checks={results.seo}
            defaultOpen={true}
          />
          <ReportSection
            title="Launch Readiness"
            icon="🚀"
            checks={results.launch}
            defaultOpen={true}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-10">
          Powered by{' '}
          <Link href="/" className="hover:text-gray-500 transition-colors">
            LaunchCheck
          </Link>
        </p>
      </div>
    </main>
  );
}
