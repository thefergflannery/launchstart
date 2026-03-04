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

  const scoreColor =
    passed === total ? 'text-pass' : passed >= Math.ceil(total * 0.6) ? 'text-amber' : 'text-fail';

  return (
    <div className="corner-mark border border-lc-border bg-lc-card">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-lc-border/20 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-base">{icon}</span>
          <span className="font-semibold text-lc-fg">{title}</span>
        </div>

        <div className="flex items-center gap-5">
          {/* Score */}
          <span className={`font-mono text-sm font-medium ${scoreColor}`}>
            {passed}/{total}
          </span>

          {/* Bar */}
          <div className="w-16 h-px bg-lc-border relative hidden sm:block">
            <div
              className={`absolute left-0 top-0 h-px transition-all ${
                pct === 100 ? 'bg-pass' : pct >= 60 ? 'bg-amber' : 'bg-fail'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <span className="font-mono text-xs text-lc-muted">{open ? '↑' : '↓'}</span>
        </div>
      </button>

      {/* Items */}
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
