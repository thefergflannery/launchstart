/**
 * Plan feature-gate utilities.
 *
 * `early_access` is treated identically to `pro` throughout the codebase —
 * both receive full report access.
 */

// Includes legacy plan slugs ('onceoff', 'recurring') that may exist in the DB
const FULL_REPORT_PLANS = new Set(['pro', 'early_access', 'agency', 'onceoff', 'recurring']);

/**
 * Returns true if the user's plan includes access to the full report:
 * all issues visible, developer tab unlocked, no issue lock overlay.
 *
 * Free and onceoff users see a preview with issues above the fold locked.
 */
export function hasFullReportAccess(plan: string): boolean {
  return FULL_REPORT_PLANS.has(plan);
}
