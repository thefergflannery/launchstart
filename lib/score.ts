import { CheckResult } from '@/lib/types';
import { getIssue, IssueSeverity } from '@/lib/issue-library';

const WEIGHTS: Record<IssueSeverity, number> = { critical: 3, 'should-fix': 2, 'nice-to-have': 1 };

export function getSeverityForCheck(check: CheckResult): IssueSeverity {
  const entry = getIssue(check.id);
  if (entry) return entry.severity;
  if (check.status === 'fail') return 'critical';
  if (check.status === 'amber') return 'should-fix';
  return 'nice-to-have';
}

export function calcScore(allChecks: CheckResult[]): number {
  let total = 0;
  let passedWeight = 0;
  for (const c of allChecks) {
    const w = WEIGHTS[getSeverityForCheck(c)];
    total += w;
    if (c.status === 'pass') passedWeight += w;
  }
  return total === 0 ? 100 : Math.round((passedWeight / total) * 100);
}

export function calcCounts(allChecks: CheckResult[]) {
  let critical = 0, should_fix = 0, nice_to_have = 0;
  for (const c of allChecks) {
    if (c.status === 'pass') continue;
    const sev = getSeverityForCheck(c);
    if (sev === 'critical') critical++;
    else if (sev === 'should-fix') should_fix++;
    else nice_to_have++;
  }
  return { critical, should_fix, nice_to_have };
}
