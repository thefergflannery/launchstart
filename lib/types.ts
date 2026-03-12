export type CheckStatus = 'pass' | 'amber' | 'fail';

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
  fixHint: string;
}

export interface ScanResults {
  url: string;
  scannedAt: string;
  accessibility: CheckResult[];
  seo: CheckResult[];
  launch: CheckResult[];
}

export interface ScanRecord {
  id: string;
  url: string;
  results: ScanResults;
  created_at: string;
  score?: number;
  critical_count?: number;
  should_fix_count?: number;
  nice_to_have_count?: number;
}
