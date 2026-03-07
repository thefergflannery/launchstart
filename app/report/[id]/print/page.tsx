/**
 * CORE — PDF Export (/report/:id/print)
 * Print-optimised white-background report. Opened from the main report page.
 * Auto-triggers window.print() on load so the user gets a Save as PDF dialog.
 * PRD ref: §2.5
 */
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ScanRecord, CheckResult } from '@/lib/types';
import { getIssue, IssueSeverity } from '@/lib/issue-library';
import AutoPrint from '@/components/AutoPrint';
import PrintButton from '@/components/PrintButton';

interface PageProps {
  params: { id: string };
}

export const revalidate = 0;

const SEVERITY_LABEL: Record<IssueSeverity, string> = {
  critical: 'CRITICAL — Must fix before EAA deadline',
  'should-fix': 'SHOULD FIX — Required for full EAA compliance',
  'nice-to-have': 'NICE TO HAVE — Best practice improvement',
};

const SEVERITY_BORDER: Record<IssueSeverity, string> = {
  critical: '#DC2626',
  'should-fix': '#D97706',
  'nice-to-have': '#60A5FA',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
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
  let passed = 0;
  for (const c of allChecks) {
    const w = WEIGHTS[getSeverity(c)];
    total += w;
    if (c.status === 'pass') passed += w;
  }
  return total === 0 ? 100 : Math.round((passed / total) * 100);
}

export default async function PrintPage({ params }: PageProps) {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) notFound();

  const scan = data as ScanRecord;
  const allChecks: CheckResult[] = [
    ...scan.results.accessibility,
    ...scan.results.seo,
    ...scan.results.launch,
  ];

  const issues: { check: CheckResult; severity: IssueSeverity }[] = [];
  const passed: CheckResult[] = [];

  for (const check of allChecks) {
    if (check.status === 'pass') {
      passed.push(check);
    } else {
      issues.push({ check, severity: getSeverity(check) });
    }
  }

  const critical = issues.filter((i) => i.severity === 'critical');
  const shouldFix = issues.filter((i) => i.severity === 'should-fix');
  const niceToHave = issues.filter((i) => i.severity === 'nice-to-have');
  const score = calcScore(allChecks);

  const nextSteps =
    critical.length > 0
      ? `Start with the ${critical.length} Critical issue${critical.length > 1 ? 's' : ''}. These block users entirely and carry legal risk under the EAA — fix them first.${shouldFix.length > 0 ? ` Then work through the ${shouldFix.length} Should Fix item${shouldFix.length > 1 ? 's' : ''} to reach full EAA compliance.` : ' Once those are done, your site will meet the EAA baseline.'}`
      : shouldFix.length > 0
        ? `No critical issues — well done. Work through the ${shouldFix.length} Should Fix item${shouldFix.length > 1 ? 's' : ''} to reach full EAA compliance.`
        : 'No critical or required issues found. Your site is in excellent shape for EAA compliance.';

  return (
    <>
      <AutoPrint />
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .issue-card { break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ fontFamily: 'ui-monospace, monospace', background: '#fff', color: '#111', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Print button — hidden in print output */}
        <div className="no-print" style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <PrintButton />
          <a
            href={`/report/${params.id}`}
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', color: '#666', textDecoration: 'none', padding: '10px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            ← Back to report
          </a>
        </div>

        {/* Header */}
        <div style={{ borderBottom: '2px solid #111', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>
                Accessibility Report · A11YO
              </p>
              <p style={{ fontSize: '18px', fontWeight: '700', wordBreak: 'break-all', margin: '0 0 4px' }}>{scan.url}</p>
              <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Scanned {formatDate(scan.created_at)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '48px', fontWeight: '800', margin: 0, lineHeight: 1, color: score >= 80 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626' }}>
                {score}%
              </p>
              <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0' }}>compliance score</p>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#444', margin: '16px 0 0', lineHeight: 1.6, borderLeft: '3px solid #ddd', paddingLeft: '12px' }}>
            Share this document with your developer. Every issue below includes a plain English fix instruction.
            Tick each checkbox as it is resolved.
          </p>

          {/* Counts */}
          <div style={{ display: 'flex', gap: '28px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { count: critical.length, label: 'Critical', color: '#DC2626' },
              { count: shouldFix.length, label: 'Should Fix', color: '#D97706' },
              { count: niceToHave.length, label: 'Nice to Have', color: '#60A5FA' },
              { count: passed.length, label: 'Passed', color: '#16A34A' },
            ].map(({ count, label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color }}>{count}</span>
                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Issues by severity */}
        {[
          { items: critical, severity: 'critical' as IssueSeverity, heading: 'Critical Issues' },
          { items: shouldFix, severity: 'should-fix' as IssueSeverity, heading: 'Should Fix' },
          { items: niceToHave, severity: 'nice-to-have' as IssueSeverity, heading: 'Nice to Have' },
        ].map(({ items, severity, heading }) => items.length > 0 && (
          <div key={severity} style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '6px', marginBottom: '12px' }}>
              {heading} ({items.length})
            </p>
            {items.map(({ check }) => {
              const entry = getIssue(check.id);
              if (!entry) return null;
              const borderColor = SEVERITY_BORDER[severity];
              return (
                <div key={check.id} className="issue-card" style={{ border: '1px solid #ddd', borderLeft: `4px solid ${borderColor}`, padding: '16px', marginBottom: '10px', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                    {/* Checkbox */}
                    <div style={{ width: '16px', height: '16px', border: '1.5px solid #aaa', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '10px', color: borderColor, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px', fontWeight: '600' }}>
                        {SEVERITY_LABEL[severity]}
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{entry.title}</p>
                    </div>
                  </div>
                  <div style={{ paddingLeft: '28px', fontSize: '12px', color: '#444', lineHeight: 1.6 }}>
                    <p style={{ margin: '0 0 8px' }}><strong>What this means:</strong> {entry.means}</p>
                    <p style={{ margin: '0 0 8px' }}><strong>What needs to happen:</strong> {entry.fix}</p>
                    <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>Technical reference: {entry.wcag}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* What passed */}
        {passed.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '6px', marginBottom: '12px' }}>
              What Passed ({passed.length})
            </p>
            <div style={{ border: '1px solid #ddd', padding: '0 16px' }}>
              {passed.map((check) => {
                const entry = getIssue(check.id);
                return (
                  <div key={check.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '12px', color: '#444' }}>
                    <span style={{ color: '#16A34A', fontWeight: '700', fontSize: '14px' }}>✓</span>
                    <span>{entry?.passTitle ?? check.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Next steps */}
        <div style={{ borderTop: '2px solid #111', paddingTop: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666', marginBottom: '10px' }}>
            Next Steps
          </p>
          <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.7, margin: '0 0 8px' }}>{nextSteps}</p>
          <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.7, margin: 0 }}>
            Forward this report to your developer. Every issue above includes a plain English fix instruction — they have everything they need to get started without any further briefing from you.
          </p>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
            Generated by A11YO · a11yo.com · {formatDate(scan.created_at)}
          </p>
          <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
            Report ID: {params.id}
          </p>
        </div>
      </div>
    </>
  );
}
