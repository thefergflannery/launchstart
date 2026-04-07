import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUser, getProfile } from '@/lib/supabase-server';
import { ScanRecord, CheckResult } from '@/lib/types';
import { getIssue, IssueSeverity } from '@/lib/issue-library';
import { mapScanToReportIssues } from '@/lib/report-mapper';
import { hasFullReportAccess } from '@/lib/plan-utils';
import ExecutiveSummaryCard from '@/components/report/ExecutiveSummary';
import ReportTabs from '@/components/report/ReportTabs';
import ReportIssueCard from '@/components/report/IssueCard';
import CopyButton from '@/components/CopyButton';
import Logo from '@/components/Logo';
import ScoreChart from '@/components/ScoreChart';
import type { ExecutiveSummary } from '@/types/report';

interface PageProps {
  params: { id: string };
}

export const revalidate = 0;

function getSeverity(check: CheckResult): IssueSeverity {
  const entry = getIssue(check.id);
  if (entry) return entry.severity;
  if (check.status === 'fail') return 'critical';
  if (check.status === 'amber') return 'should-fix';
  return 'nice-to-have';
}

function calcScore(allChecks: CheckResult[]): number {
  const WEIGHTS: Record<IssueSeverity, number> = { critical: 3, 'should-fix': 2, 'nice-to-have': 1 };
  let total = 0;
  let passedWeight = 0;
  for (const c of allChecks) {
    const w = WEIGHTS[getSeverity(c)];
    total += w;
    if (c.status === 'pass') passedWeight += w;
  }
  return total === 0 ? 100 : Math.round((passedWeight / total) * 100);
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default async function ReportPage({ params }: PageProps) {
  const [{ data, error }, user] = await Promise.all([
    supabase.from('scans').select('*').eq('id', params.id).single(),
    getUser(),
  ]);

  if (error || !data) notFound();

  const scan = data as ScanRecord;

  // Plan gate
  let hasAccess = false;
  if (user) {
    const profile = await getProfile(user.id);
    hasAccess = hasFullReportAccess(profile?.plan ?? 'free');
  }
  const locked = !hasAccess;

  // Score history for chart
  const { data: history } = await supabase
    .from('scans')
    .select('created_at, score')
    .eq('url', scan.url)
    .not('score', 'is', null)
    .order('created_at', { ascending: true })
    .limit(10);

  const chartData = (history ?? [])
    .filter((s) => s.score != null)
    .map((s) => ({ label: shortDate(s.created_at), score: s.score as number }));

  // Map scan results to enriched ReportIssue[]
  const allIssues = mapScanToReportIssues(scan.results);
  const failedIssues = allIssues.filter((i) => i.status !== 'pass');
  const passedIssues = allIssues.filter((i) => i.status === 'pass');

  const criticalIssues = failedIssues.filter((i) => i.severity === 'critical');
  const shouldFixIssues = failedIssues.filter((i) => i.severity === 'should-fix');
  const niceToHaveIssues = failedIssues.filter((i) => i.severity === 'nice-to-have');
  const quickWins = failedIssues.filter((i) => i.estimated_cost === 'minutes');

  // Score (consistent with chart)
  const allChecks: CheckResult[] = [
    ...scan.results.accessibility,
    ...scan.results.seo,
    ...scan.results.launch,
  ];
  const score = calcScore(allChecks);

  const summary: ExecutiveSummary = {
    score,
    critical_count: criticalIssues.length,
    should_fix_count: shouldFixIssues.length,
    nice_to_have_count: niceToHaveIssues.length,
    total_checks: allIssues.length,
    passed_checks: passedIssues.length,
    eaa_ready: criticalIssues.length === 0,
    quick_wins: quickWins,
    top_priority: [...criticalIssues, ...shouldFixIssues].slice(0, 3),
  };

  const reportUrl = `https://a11yo.com/report/${params.id}`;

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-green transition-colors" aria-label="A11YO home">
            <Logo size={28} />
          </Link>
          <Link href="/" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors">
            ← New scan
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── 1. EXECUTIVE SUMMARY ── */}
          <ExecutiveSummaryCard
            summary={summary}
            url={scan.url}
            scannedAt={scan.created_at}
            reportId={params.id}
          />

          {/* ── Score over time ── */}
          {chartData.length >= 2 && (
            <ScoreChart data={chartData} url={scan.url} />
          )}

          {/* Upgrade banner for locked users */}
          {locked && failedIssues.length > 0 && (
            <div className="border border-green/20 bg-green/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
              <p className="font-mono text-xs text-white">
                <span className="text-green font-semibold">Fix details are locked.</span>{' '}
                Upgrade to see plain English fix instructions for every issue.
              </p>
              <a
                href="/pricing"
                className="font-mono text-xs uppercase tracking-wider bg-green text-black px-4 py-2 hover:bg-green-mid transition-colors whitespace-nowrap flex-shrink-0"
              >
                Upgrade — from €10 →
              </a>
            </div>
          )}

          {/* ── 2–5. ISSUES (owner / dev tab view) ── */}
          {failedIssues.length > 0 && (
            <ReportTabs>

              {/* Quick Wins */}
              {quickWins.length > 0 && (
                <section aria-labelledby="quick-wins-heading">
                  <SectionHeader id="quick-wins-heading" color="text-green" title="Quick Wins" subtitle="easy fixes — do these first regardless of severity" />
                  <div className="space-y-2">
                    {quickWins.map((issue) => (
                      <ReportIssueCard key={issue.id} issue={issue} locked={locked} />
                    ))}
                  </div>
                </section>
              )}

              {/* Critical */}
              {criticalIssues.length > 0 && (
                <section aria-labelledby="critical-heading">
                  <SectionHeader id="critical-heading" color="text-fail" title="Critical" subtitle="must fix before EAA deadline — legal risk" />
                  <div className="space-y-2">
                    {criticalIssues.map((issue, i) => (
                      <ReportIssueCard
                        key={issue.id}
                        issue={issue}
                        locked={locked}
                        defaultOpen={!locked && i === 0 && criticalIssues.length === 1}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Should Fix */}
              {shouldFixIssues.length > 0 && (
                <section aria-labelledby="should-fix-heading">
                  <SectionHeader id="should-fix-heading" color="text-warn" title="Should Fix" subtitle="required for full EAA compliance" />
                  <div className="space-y-2">
                    {shouldFixIssues.map((issue) => (
                      <ReportIssueCard key={issue.id} issue={issue} locked={locked} />
                    ))}
                  </div>
                </section>
              )}

              {/* Nice to Have */}
              {niceToHaveIssues.length > 0 && (
                <section aria-labelledby="nice-to-have-heading">
                  <SectionHeader id="nice-to-have-heading" color="text-blue-400" title="Nice to Have" subtitle="best practice — not legally required" />
                  <div className="space-y-2">
                    {niceToHaveIssues.map((issue) => (
                      <ReportIssueCard key={issue.id} issue={issue} locked={locked} />
                    ))}
                  </div>
                </section>
              )}

            </ReportTabs>
          )}

          {/* ── 6. WHAT PASSED ── */}
          {passedIssues.length > 0 && (
            <section aria-labelledby="passed-heading">
              <SectionHeader
                id="passed-heading"
                color="text-green"
                title="What Passed"
                subtitle={`${passedIssues.length} check${passedIssues.length > 1 ? 's' : ''} passed`}
              />
              <div className="corner-mark border border-border bg-surface divide-y divide-border">
                {passedIssues.map((issue) => (
                  <div key={issue.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="text-green-mid text-sm flex-shrink-0" aria-hidden="true">✓</span>
                    <span className="text-secondary text-sm">{issue.pass_title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 7. NEXT STEPS ── */}
          <section aria-labelledby="next-steps-heading">
            <SectionHeader id="next-steps-heading" color="text-green" title="Next Steps" subtitle="your plain English action plan" />
            <div className="corner-mark border border-border bg-surface px-6 py-5 space-y-3">
              <p className="text-secondary text-sm leading-relaxed">
                {summary.eaa_ready
                  ? 'No critical issues. Work through any remaining Should Fix items to reach full EAA compliance.'
                  : `Start with the ${criticalIssues.length} Critical issue${criticalIssues.length > 1 ? 's' : ''}. These block users entirely and carry legal risk under the EAA — fix them first.${shouldFixIssues.length > 0 ? ` Then work through the ${shouldFixIssues.length} Should Fix item${shouldFixIssues.length > 1 ? 's' : ''} to reach full EAA compliance.` : ''}`
                }
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                Forward this report to your developer. Switch to the Developer View on any issue for step-by-step technical fix instructions — they have everything they need to get started.
              </p>
              <div className="pt-3 border-t border-border flex flex-wrap gap-3">
                <a
                  href={`/report/${params.id}/print`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs tracking-wider uppercase bg-green text-black px-4 py-2 hover:bg-green-mid transition-colors"
                >
                  Download PDF →
                </a>
                <CopyButton url={reportUrl} label="Copy report link" />
                <a
                  href="/"
                  className="font-mono text-xs tracking-wider uppercase border border-border px-4 py-2 text-secondary hover:text-white hover:border-white transition-colors"
                >
                  Scan another page →
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <span className="font-mono text-xs text-secondary">
            Generated by{' '}
            <Link href="/" className="text-green hover:underline">A11YO</Link>
          </span>
          <Link href="/sample-report" className="font-mono text-xs text-secondary hover:text-white transition-colors">
            View sample report →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ id, color, title, subtitle }: { id: string; color: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 id={id} className={`font-mono text-xs uppercase tracking-widest ${color}`}>{title}</h2>
      <span className="font-mono text-[10px] text-muted">— {subtitle}</span>
    </div>
  );
}
