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

  const summaryColor =
    passed === total
      ? 'text-green-400'
      : passed >= total * 0.6
        ? 'text-amber-400'
        : 'text-red-400';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="text-white font-semibold text-lg">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-mono text-sm font-medium ${summaryColor}`}>
            {passed}/{total} passed
          </span>
          <div className="flex items-center gap-2">
            {/* Mini progress bar */}
            <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct === 100
                    ? 'bg-green-500'
                    : pct >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {/* Check items */}
      {open && (
        <div className="px-5 pb-2">
          {checks.map((check) => (
            <CheckItem key={check.id} check={check} />
          ))}
        </div>
      )}
    </div>
  );
}
