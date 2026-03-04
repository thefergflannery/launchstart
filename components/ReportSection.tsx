'use client';

import { useState } from 'react';
import { CheckResult } from '@/lib/types';
import CheckItem from './CheckItem';

interface Props {
  title: string;
  icon: string;
  checks: CheckResult[];
  defaultOpen?: boolean;
}

export default function ReportSection({ title, icon, checks, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const passed = checks.filter((c) => c.status === 'pass').length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  const barColor =
    pct === 100 ? '#16A34A' : pct >= 60 ? '#D97706' : '#DC2626';

  const scoreColor =
    pct === 100 ? 'text-pass' : pct >= 60 ? 'text-amber' : 'text-fail';

  return (
    <div className="corner-mark border border-lc-border bg-lc-card">
      {/* Coloured accent bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: barColor }} />

      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-lc-border/20 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center border border-lc-border bg-lc-bg text-sm">
            {icon}
          </span>
          <span className="font-semibold text-lc-fg">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className={`font-mono text-sm font-semibold ${scoreColor}`}>
            {passed}/{total}
          </span>

          {/* Progress bar */}
          <div className="w-20 h-1.5 bg-lc-border hidden sm:block">
            <div
              className="h-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>

          <span className="font-mono text-xs text-lc-muted">{open ? '↑' : '↓'}</span>
        </div>
      </button>

      {open && (
        <div className="px-6 border-t border-lc-border pb-2">
          {checks.map((check) => (
            <CheckItem key={check.id} check={check} />
          ))}
        </div>
      )}
    </div>
  );
}
