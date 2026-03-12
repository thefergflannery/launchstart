import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUser, getProfile } from '@/lib/supabase-server';
import { ScanRecord, CheckResult } from '@/lib/types';
import { getIssue, IssueSeverity } from '@/lib/issue-library';
import IssueCard from '@/components/IssueCard';
import CopyButton from '@/components/CopyButton';
import Logo from '@/components/Logo';
import ScoreChart from '@/components/ScoreChart';

interface PageProps {
  params: { id: string };
}

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface EnrichedCheck {
  check: CheckResult;
  severity: IssueSeverity;
  isQuickWin: boolean;
}

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

const PAID_PLANS = new Set(['onceoff', 'recurring', 'agency', 'pro', 'early_access']);

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

  // Determine if fix details should be locked (free/anon users)
  let isPaid = false;
  if (user) {
    const profile = await getProfile(user.id);
    isPaid = PAID_PLANS.has(profile?.plan ?? 'free');
  }
  const locked = !isPaid;

  // Fetch score history for this URL (oldest first, last 10 scans with a score)
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

  const allChecks: CheckResult[] = [
    ...scan.results.accessibility,
    ...scan.results.seo,
    ...scan.results.launch,
  ];

  const issues: EnrichedCheck[] = [];
  const passed: CheckResult[] = [];

  for (const check of allChecks) {
    if (check.status === 'pass') {
      passed.push(check);
    } else {
      const entry = getIssue(check.id);
      issues.push({
        check,
        severity: getSeverity(check),
        isQuickWin: entry?.quickWin ?? false,
      });
    }
  }

  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const shouldFixIssues = issues.filter((i) => i.severity === 'should-fix');
  const niceToHaveIssues = issues.filter((i) => i.severity === 'nice-to-have');
  const quickWins = issues.filter((i) => i.isQuickWin);

  const score = calcScore(allChecks);
  const scoreColor = score >= 80 ? 'text-green-mid' : score >= 50 ? 'text-warn' : 'text-fail';
  const scoreBarColor = score >= 80 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626';

  const reportUrl = `https://a11yo.com/report/${params.id}`;

  const nextStepsText =
    criticalIssues.length > 0
      ? `Start with the ${criticalIssues.length} Critical issue${criticalIssues.length > 1 ? 's' : ''}. These block users entirely and carry legal risk under the EAA — fix them first.${shouldFixIssues.length > 0 ? ` Then work through the ${shouldFixIssues.length} Should Fix item${shouldFixIssues.length > 1 ? 's' : ''} to reach full EAA compliance.` : ' Once those are done, your site will meet the EAA baseline.'}`
      : shouldFixIssues.length > 0
        ? `No critical issues — well done. Work through the ${shouldFixIssues.length} Should Fix item${shouldFixIssues.length > 1 ? 's' : ''} to reach full EAA compliance.`
        : 'No critical or required issues found. Your site is in excellent shape for EAA compliance. Consider the nice-to-have improvements to further enhance the experience for all users.';

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

          {/* ── 1. COVER SUMMARY ── */}
          <div className="corner-mark border border-border bg-surface">
            <div className="px-6 pt-6 pb-4">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-4">
                Accessibility Report
              </span>
              <p className="text-secondary text-xs leading-relaxed mb-6 border-l-2 border-border pl-4">
                Generated by A11YO on {formatDate(scan.created_at)} for{' '}
                <span className="text-white font-semibold">{scan.url}</span>.{' '}
                Share this with your developer — every issue below includes a plain English fix instruction.
                Tick each item as it is resolved.
              </p>

              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="min-w-0 flex-1">
                  <a
                    href={scan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-green transition-colors break-all block mb-1 text-lg"
                  >
                    {scan.url}
                  </a>
                  <p className="font-mono text-xs text-secondary">{formatDate(scan.created_at)}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`font-display text-6xl font-extrabold leading-none ${scoreColor}`}>
                    {score}<span className="text-3xl">%</span>
                  </span>
                  <p className="font-mono text-xs text-secondary mt-1">compliance score</p>
                </div>
              </div>
            </div>

            {/* Score bar */}
            <div className="h-1 bg-border">
              <div className="h-full transition-all" style={{ width: `${score}%`, backgroundColor: scoreBarColor }} />
            </div>

            {/* Severity counts */}
            <div className="px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { count: criticalIssues.length, label: 'Critical', cls: 'text-fail' },
                { count: shouldFixIssues.length, label: 'Should Fix', cls: 'text-warn' },
                { count: niceToHaveIssues.length, label: 'Nice to Have', cls: 'text-blue-400' },
                { count: passed.length, label: 'Passed', cls: 'text-green-mid' },
              ].map(({ count, label, cls }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className={`font-mono text-2xl font-bold ${cls}`}>{count}</span>
                  <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">{label}</span>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-3">
                <a
                  href={`/report/${params.id}/print`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs tracking-wider uppercase bg-green text-black px-4 py-2 hover:bg-green-mid transition-colors whitespace-nowrap"
                >
                  Download PDF →
                </a>
                <CopyButton url={reportUrl} />
              </div>
            </div>
          </div>

          {/* ── Score over time ── */}
          {chartData.length >= 2 && (
            <ScoreChart data={chartData} url={scan.url} />
          )}

          {/* Upgrade banner for free/anon users */}
          {locked && issues.length > 0 && (
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

          {/* ── 2. QUICK WINS ── */}
          {quickWins.length > 0 && (
            <section aria-labelledby="quick-wins-heading">
              <SectionHeader id="quick-wins-heading" color="text-green" title="Quick Wins" subtitle="easy fixes — do these first regardless of severity" />
              <div className="space-y-2">
                {quickWins.map(({ check }) => {
                  const entry = getIssue(check.id);
                  return entry ? <IssueCard key={check.id} entry={entry} locked={locked} /> : null;
                })}
              </div>
            </section>
          )}

          {/* ── 3. CRITICAL ── */}
          {criticalIssues.length > 0 && (
            <section aria-labelledby="critical-heading">
              <SectionHeader id="critical-heading" color="text-fail" title="Critical" subtitle="must fix before EAA deadline — legal risk" />
              <div className="space-y-2">
                {criticalIssues.map(({ check }) => {
                  const entry = getIssue(check.id);
                  return entry ? <IssueCard key={check.id} entry={entry} defaultOpen={!locked && criticalIssues.length === 1} locked={locked} /> : null;
                })}
              </div>
            </section>
          )}

          {/* ── 4. SHOULD FIX ── */}
          {shouldFixIssues.length > 0 && (
            <section aria-labelledby="should-fix-heading">
              <SectionHeader id="should-fix-heading" color="text-warn" title="Should Fix" subtitle="required for full EAA compliance" />
              <div className="space-y-2">
                {shouldFixIssues.map(({ check }) => {
                  const entry = getIssue(check.id);
                  return entry ? <IssueCard key={check.id} entry={entry} locked={locked} /> : null;
                })}
              </div>
            </section>
          )}

          {/* ── 5. NICE TO HAVE (collapsed by default) ── */}
          {niceToHaveIssues.length > 0 && (
            <section aria-labelledby="nice-to-have-heading">
              <SectionHeader id="nice-to-have-heading" color="text-blue-400" title="Nice to Have" subtitle="best practice — not legally required" />
              <div className="space-y-2">
                {niceToHaveIssues.map(({ check }) => {
                  const entry = getIssue(check.id);
                  return entry ? <IssueCard key={check.id} entry={entry} locked={locked} /> : null;
                })}
              </div>
            </section>
          )}

          {/* ── 6. WHAT PASSED ── */}
          {passed.length > 0 && (
            <section aria-labelledby="passed-heading">
              <SectionHeader id="passed-heading" color="text-green" title="What Passed" subtitle={`${passed.length} check${passed.length > 1 ? 's' : ''} passed`} />
              <div className="corner-mark border border-border bg-surface divide-y divide-border">
                {passed.map((check) => {
                  const entry = getIssue(check.id);
                  return (
                    <div key={check.id} className="px-5 py-3 flex items-center gap-3">
                      <span className="text-green-mid text-sm flex-shrink-0" aria-hidden="true">✓</span>
                      <span className="text-secondary text-sm">
                        {entry?.passTitle ?? check.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 7. NEXT STEPS ── */}
          <section aria-labelledby="next-steps-heading">
            <SectionHeader id="next-steps-heading" color="text-green" title="Next Steps" subtitle="your plain English action plan" />
            <div className="corner-mark border border-border bg-surface px-6 py-5 space-y-3">
              <p className="text-secondary text-sm leading-relaxed">{nextStepsText}</p>
              <p className="text-secondary text-sm leading-relaxed">
                Forward this report to your developer. Every issue above includes a plain English fix instruction — they have everything they need to get started without any further briefing from you.
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
            <Link href="/" className="text-green hover:underline">A11YO</Link>{' '}
            · {formatDate(scan.created_at)}
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
