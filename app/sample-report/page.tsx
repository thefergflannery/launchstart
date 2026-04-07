/**
 * F-007 — Sample Full Report (/sample-report)
 * Static, no auth required. Uses a realistic fictional Irish business.
 * Linked from homepage hero and footer — not main nav.
 * PRD ref: §F-007
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { mapScanToReportIssues } from '@/lib/report-mapper';
import ExecutiveSummaryCard from '@/components/report/ExecutiveSummary';
import ReportTabs from '@/components/report/ReportTabs';
import ReportIssueCard from '@/components/report/IssueCard';
import Logo from '@/components/Logo';
import type { CheckResult } from '@/lib/types';
import type { ExecutiveSummary, ReportIssue } from '@/types/report';

export const metadata: Metadata = {
  title: 'Sample Accessibility Report — A11YO',
  description:
    'See a real A11YO accessibility report for a fictional Irish business. Plain English issues, fix instructions, and a compliance score — no jargon.',
};

// ── Fictional Irish business: Keogh's Hardware, Athlone ──────────────────────

const SAMPLE_URL = 'https://keoughshardware.ie';
const SAMPLE_DATE = '2026-03-04T10:30:00.000Z';

// Build CheckResult arrays matching the real scanner category buckets

function fail(id: string, label: string, message: string): CheckResult {
  return { id, label, status: 'fail', message, fixHint: '' };
}
function pass(id: string, label: string): CheckResult {
  return { id, label, status: 'pass', message: '', fixHint: '' };
}

const sampleScan = {
  accessibility: [
    fail('image-alt', 'Image alt text', '23 images found without alt attributes'),
    fail('form-labels', 'Form labels', '4 form fields are missing associated labels'),
    pass('color-contrast', 'Colour contrast'),
    pass('title-lang', 'Page title and language'),
    pass('aria-errors', 'ARIA usage'),
    fail('heading-structure', 'Heading structure', '3 heading levels are skipped or missing'),
    fail('keyboard-focus', 'Keyboard navigation', 'Positive tabindex values found; no skip link detected'),
  ],
  seo: [
    fail('meta-description', 'Meta description', 'No meta description tag found'),
    fail('og-image', 'OG image', 'No og:image tag found'),
    fail('og-title', 'OG title', 'No og:title tag found'),
    pass('viewport', 'Viewport meta'),
    pass('https', 'HTTPS'),
  ],
  launch: [
    fail('robots-txt', 'robots.txt', 'No robots.txt file found'),
    fail('sitemap', 'Sitemap', 'No sitemap.xml found'),
    fail('load-time', 'Page load time', 'Page took 4.3 s to load (threshold: 3 s)'),
    fail('broken-links', 'Broken links', '5 broken links found on this page'),
    pass('mobile-viewport', 'Mobile viewport'),
  ],
};

// Map to enriched ReportIssue[]
const allIssues = mapScanToReportIssues(sampleScan);
const failedIssues = allIssues.filter((i) => i.status !== 'pass');
const passedIssues = allIssues.filter((i) => i.status === 'pass');

const criticalIssues = failedIssues.filter((i: ReportIssue) => i.severity === 'critical');
const shouldFixIssues = failedIssues.filter((i: ReportIssue) => i.severity === 'should-fix');
const niceToHaveIssues = failedIssues.filter((i: ReportIssue) => i.severity === 'nice-to-have');
const quickWins = failedIssues.filter((i: ReportIssue) => i.estimated_cost === 'minutes');

// Score: weighted (critical=3, should-fix=2, nice-to-have=1)
const SAMPLE_SCORE = 41;

const summary: ExecutiveSummary = {
  score: SAMPLE_SCORE,
  critical_count: criticalIssues.length,
  should_fix_count: shouldFixIssues.length,
  nice_to_have_count: niceToHaveIssues.length,
  total_checks: allIssues.length,
  passed_checks: passedIssues.length,
  eaa_ready: criticalIssues.length === 0,
  quick_wins: quickWins,
  top_priority: [...criticalIssues, ...shouldFixIssues].slice(0, 3),
};

function SectionHeader({ id, color, title, subtitle }: { id: string; color: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 id={id} className={`font-mono text-xs uppercase tracking-widest ${color}`}>{title}</h2>
      <span className="font-mono text-[10px] text-muted">— {subtitle}</span>
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-green transition-colors" aria-label="A11YO home">
            <Logo size={28} />
          </Link>
          <Link href="/" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors">
            ← Get your own report
          </Link>
        </div>
      </header>

      {/* Sample banner */}
      <div className="bg-green/10 border-b border-green/20 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <p className="font-mono text-xs text-green">
            This is a sample report for a fictional Irish business. Your real report will look exactly like this.
          </p>
          <Link
            href="/"
            className="font-mono text-xs tracking-wider uppercase bg-green text-black px-4 py-1.5 hover:bg-green-mid transition-colors whitespace-nowrap"
          >
            Scan your site free →
          </Link>
        </div>
      </div>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── 1. EXECUTIVE SUMMARY ── */}
          <ExecutiveSummaryCard
            summary={summary}
            url={SAMPLE_URL}
            scannedAt={SAMPLE_DATE}
          />

          {/* ── 2–5. ISSUES (owner / dev tab view) ── */}
          <ReportTabs>

            {/* Quick Wins */}
            {quickWins.length > 0 && (
              <section aria-labelledby="qw-heading">
                <SectionHeader id="qw-heading" color="text-green" title="Quick Wins" subtitle="easy fixes — do these first regardless of severity" />
                <div className="space-y-2">
                  {quickWins.map((issue) => (
                    <ReportIssueCard key={issue.id} issue={issue} />
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
                      defaultOpen={i === 0}
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
                    <ReportIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </section>
            )}

            {/* Nice to Have */}
            {niceToHaveIssues.length > 0 && (
              <section aria-labelledby="nth-heading">
                <SectionHeader id="nth-heading" color="text-blue-400" title="Nice to Have" subtitle="best practice — not legally required" />
                <div className="space-y-2">
                  {niceToHaveIssues.map((issue) => (
                    <ReportIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </section>
            )}

          </ReportTabs>

          {/* ── 6. WHAT PASSED ── */}
          {passedIssues.length > 0 && (
            <section aria-labelledby="passed-heading">
              <SectionHeader
                id="passed-heading"
                color="text-green"
                title="What Passed"
                subtitle={`${passedIssues.length} checks passed`}
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
          <section aria-labelledby="next-heading">
            <SectionHeader id="next-heading" color="text-green" title="Next Steps" subtitle="your plain English action plan" />
            <div className="corner-mark border border-border bg-surface px-6 py-5 space-y-3">
              <p className="text-secondary text-sm leading-relaxed">
                Start with the {criticalIssues.length} Critical issues. These block users entirely and carry legal risk under the EAA — fix them first. Then work through the {shouldFixIssues.length} Should Fix items to reach full EAA compliance.
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                Forward this report to your developer. Switch to the <strong className="text-white">Developer View</strong> on any issue for step-by-step technical fix instructions — they have everything they need without any further briefing.
              </p>
            </div>
          </section>

          {/* ── CTA BANNER ── */}
          <div className="corner-mark border border-green/20 bg-surface px-6 py-7 text-center space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-green block">
              This is a sample report
            </span>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Get your own report — free
            </h2>
            <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
              Enter your website URL and A11YO will scan it in seconds. No sign-up required for your first scan.
            </p>
            <Link
              href="/"
              className="inline-block font-mono text-sm tracking-wider uppercase bg-green text-black px-8 py-3 hover:bg-green-mid transition-colors"
            >
              Scan my website →
            </Link>
          </div>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <span className="font-mono text-xs text-secondary">
            Sample report — fictional business ·{' '}
            <Link href="/" className="text-green hover:underline">A11YO</Link>
          </span>
          <Link href="/accessibility" className="font-mono text-xs text-secondary hover:text-white transition-colors">
            Accessibility statement →
          </Link>
        </div>
      </footer>
    </div>
  );
}
