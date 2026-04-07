/**
 * Report format types — used by the owner/developer dual-view report UI.
 *
 * These are separate from CheckResult (the raw scanner output) and IssueEntry
 * (the plain-English library). ReportIssue is the enriched format that combines
 * both and adds owner-facing business context, EN 301 549 references, and
 * task metadata for the developer view.
 *
 * PRD ref: §Report Overhaul — Track 1
 */

import type { CheckStatus } from '@/lib/types';

/** Mirrors IssueSeverity in issue-library.ts — kept separate to avoid coupling */
export type ReportSeverity = 'critical' | 'should-fix' | 'nice-to-have';

/** Who is responsible for fixing this issue */
export type TaskType = 'developer' | 'content' | 'design' | 'infrastructure' | 'hosting';

/** How widely this issue affects the site */
export type ScopeIndicator = 'global' | 'page-level' | 'component';

/** Developer effort ballpark */
export type EstimatedCost = 'minutes' | 'hours' | 'days';

/** Which tab the user is viewing */
export type ReportTab = 'owner' | 'developer';

/**
 * Enriched issue format shown in the report UI.
 * All fields are populated statically via report-mapper.ts based on the check ID,
 * then `status` is set at runtime from the scanner output.
 */
export interface ReportIssue {
  // ── Identity ────────────────────────────────────────────────────────────────
  id: string;
  status: CheckStatus;
  severity: ReportSeverity;

  // ── Owner view ──────────────────────────────────────────────────────────────
  /** Plain-English title (≤10 words, no jargon) */
  title: string;
  /** Who is specifically affected — "People using screen readers", "All mobile visitors" */
  who_is_affected: string;
  /** Business impact — why this costs them money, customers, or legal standing */
  why_it_matters: string;
  /** What the owner should do next — usually "Forward to your developer" with context */
  owner_action: string;
  /** Short message shown when this check passes — positive framing */
  pass_title: string;

  // ── Developer view ──────────────────────────────────────────────────────────
  /** Step-by-step technical fix instruction */
  fix_instruction: string;
  /** WCAG criterion reference — e.g. "WCAG 2.2 — 1.1.1 Non-text Content (Level A)" */
  wcag_criterion: string;
  /** EN 301 549 clause reference for EAA compliance — e.g. "EN 301 549 §9.1.1.1" */
  en_301_549_ref: string;

  // ── Shared metadata ─────────────────────────────────────────────────────────
  task_type: TaskType;
  scope_indicator: ScopeIndicator;
  estimated_cost: EstimatedCost;
  /** True if the scanner can verify this automatically; false means manual review needed */
  passes_automated: boolean;
  /** Present when passes_automated is false — explains what to check manually */
  manual_check_note?: string;
}

/**
 * Top-level summary shown in the executive summary card at the head of the report.
 */
export interface ExecutiveSummary {
  score: number;               // 0–100
  critical_count: number;
  should_fix_count: number;
  nice_to_have_count: number;
  total_checks: number;
  passed_checks: number;
  /** True only when all critical issues pass */
  eaa_ready: boolean;
  /** Issues where estimated_cost === 'minutes' and status !== 'pass' */
  quick_wins: ReportIssue[];
  /** Critical failures first, then should-fix failures */
  top_priority: ReportIssue[];
}

/**
 * Full report data shape passed to the report page.
 */
export interface ReportData {
  scan_id: string;
  url: string;
  scanned_at: string;
  summary: ExecutiveSummary;
  issues: ReportIssue[];
  /** Derived from user plan — gates whether all issues are visible */
  has_full_access: boolean;
}
