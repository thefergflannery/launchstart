'use client';

/**
 * IssueCard (report version) — enriched issue card for the new dual-view report.
 *
 * Reads activeTab from ReportTabsContext to switch between:
 *   Owner view  — who_is_affected, why_it_matters, owner_action (plain English)
 *   Dev view    — fix_instruction, wcag_criterion, en_301_549_ref, task metadata
 *
 * Must be rendered inside a <ReportTabs> provider.
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { SEVERITY_CONFIG } from '@/lib/issue-library';
import { useReportTab } from './ReportTabs';
import IssueLock from './IssueLock';
import type { ReportIssue } from '@/types/report';

interface IssueCardProps {
  issue: ReportIssue;
  locked?: boolean;
  defaultOpen?: boolean;
}

// ── Metadata display labels ────────────────────────────────────────────────

const TASK_TYPE_LABELS: Record<string, string> = {
  developer: 'Developer',
  content: 'Content',
  design: 'Design',
  infrastructure: 'Infrastructure',
  hosting: 'Hosting',
};

const COST_LABELS: Record<string, string> = {
  minutes: '< 30 min',
  hours: '1–4 hrs',
  days: '1–3 days',
};

const SCOPE_LABELS: Record<string, string> = {
  global: 'Whole site',
  'page-level': 'This page',
  component: 'Component',
};

// ── Fix instruction renderer ───────────────────────────────────────────────

/**
 * Renders fix_instruction text with minimal markdown support:
 *   - Triple backtick blocks → styled <pre><code> elements
 *   - Inline backticks → styled <code> spans
 *   - Newlines preserved within text segments
 */
function renderFixInstruction(text: string): ReactNode[] {
  // Split on triple-backtick code blocks (```...```)
  const codeBlockRe = /```(?:\w+)?\n?([\s\S]*?)```/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRe.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(renderInlineCode(before, parts.length));

    parts.push(
      <pre
        key={`code-block-${match.index}`}
        className="bg-black border border-border px-4 py-3 overflow-x-auto my-2"
      >
        <code className="font-mono text-xs text-green">{match[1].trim()}</code>
      </pre>
    );

    lastIndex = match.index + match[0].length;
  }

  const tail = text.slice(lastIndex);
  if (tail) parts.push(renderInlineCode(tail, parts.length + 100));

  return parts;
}

/** Renders a text segment, converting inline `backtick` spans to <code>. */
function renderInlineCode(text: string, baseKey: number): ReactNode {
  const inlineRe = /`([^`]+)`/g;
  const segments: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = inlineRe.exec(text)) !== null) {
    if (m.index > last) segments.push(text.slice(last, m.index));
    segments.push(
      <code
        key={`inline-${baseKey}-${m.index}`}
        className="font-mono text-xs bg-black border border-border px-1 py-0.5 text-green"
      >
        {m[1]}
      </code>
    );
    last = m.index + m[0].length;
  }

  if (last < text.length) segments.push(text.slice(last));

  return (
    <p key={`text-${baseKey}`} className="text-secondary text-sm leading-relaxed whitespace-pre-line">
      {segments}
    </p>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function IssueCard({ issue, locked = false, defaultOpen = false }: IssueCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [fixed, setFixed] = useState(false);
  const { activeTab } = useReportTab();

  const s = SEVERITY_CONFIG[issue.severity];

  return (
    <div
      className={`border transition-opacity ${s.borderClass} ${fixed ? 'opacity-50' : ''}`}
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Card header — always visible */}
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 group"
        onClick={() => !locked && setOpen((o) => !o)}
        aria-expanded={locked ? undefined : open}
        aria-disabled={locked ? true : undefined}
      >
        {/* Severity badge */}
        <span
          className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-widest px-2 py-1 mt-0.5 ${s.textClass} ${s.bgClass}`}
        >
          {s.label}
        </span>

        {/* Title */}
        <span className="flex-1 text-white text-sm font-semibold leading-snug group-hover:text-green transition-colors">
          {issue.title}
        </span>

        {/* Lock icon or expand chevron */}
        {locked ? (
          <span className="flex-shrink-0 text-secondary text-xs mt-0.5" aria-hidden="true">
            🔒
          </span>
        ) : (
          <span
            className={`flex-shrink-0 text-secondary text-xs mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▾
          </span>
        )}
      </button>

      {/* Locked state */}
      {locked && <IssueLock />}

      {/* Expanded, unlocked state */}
      {!locked && open && (
        <div className="border-t border-border">
          <div className="px-5 pt-4 pb-5 space-y-4">

            {activeTab === 'owner' ? (
              // ── OWNER VIEW ────────────────────────────────────────────────
              <>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">
                    Who is affected
                  </p>
                  <p className="text-secondary text-sm leading-relaxed">{issue.who_is_affected}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">
                    Why it matters
                  </p>
                  <p className="text-secondary text-sm leading-relaxed">{issue.why_it_matters}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">
                    What to do next
                  </p>
                  <p className="text-secondary text-sm leading-relaxed">{issue.owner_action}</p>
                </div>
              </>
            ) : (
              // ── DEVELOPER VIEW ────────────────────────────────────────────
              <>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">
                    Fix instruction
                  </p>
                  <div className="space-y-1">
                    {renderFixInstruction(issue.fix_instruction)}
                  </div>
                </div>

                {/* Metadata row */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
                  {[
                    { label: 'Responsible', value: TASK_TYPE_LABELS[issue.task_type] ?? issue.task_type },
                    { label: 'Effort', value: COST_LABELS[issue.estimated_cost] ?? issue.estimated_cost },
                    { label: 'Scope', value: SCOPE_LABELS[issue.scope_indicator] ?? issue.scope_indicator },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-0.5">{label}</p>
                      <p className="font-mono text-xs text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {/* WCAG + EN 301 549 references */}
                {issue.wcag_criterion !== 'N/A' && (
                  <div className="space-y-1 border-l-2 border-border pl-4">
                    <p className="font-mono text-xs text-secondary">{issue.wcag_criterion}</p>
                    {issue.en_301_549_ref !== 'N/A' && (
                      <p className="font-mono text-xs text-secondary">{issue.en_301_549_ref}</p>
                    )}
                  </div>
                )}

                {/* Manual check note */}
                {issue.manual_check_note && (
                  <div className="border border-warn/30 bg-warn/5 px-3 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-warn mb-1.5">
                      Manual verification required
                    </p>
                    <p className="text-secondary text-xs leading-relaxed">{issue.manual_check_note}</p>
                  </div>
                )}
              </>
            )}

            {/* Mark as fixed — shared across both views */}
            <label className="flex items-center gap-3 cursor-pointer group/check border-t border-border pt-3">
              <input
                type="checkbox"
                checked={fixed}
                onChange={(e) => setFixed(e.target.checked)}
                className="w-4 h-4 border border-border bg-black accent-green cursor-pointer"
              />
              <span
                className={`text-sm transition-colors ${
                  fixed ? 'line-through text-secondary' : 'text-white group-hover/check:text-green'
                }`}
              >
                Mark as fixed
              </span>
            </label>

          </div>
        </div>
      )}
    </div>
  );
}
