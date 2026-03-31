'use client';

import { useState } from 'react';
import { IssueEntry, SEVERITY_CONFIG } from '@/lib/issue-library';

interface IssueCardProps {
  entry: IssueEntry;
  count?: number;       // instances found (e.g. 14 images missing alt text)
  defaultOpen?: boolean;
  locked?: boolean;     // blur fix details, show upgrade CTA
}

export default function IssueCard({ entry, count, defaultOpen = false, locked = false }: IssueCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [showTechnical, setShowTechnical] = useState(false);
  const [fixed, setFixed] = useState(false);

  const s = SEVERITY_CONFIG[entry.severity];

  return (
    <div
      className={`border rounded-sm transition-opacity ${s.borderClass} ${fixed ? 'opacity-50' : ''}`}
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Card header — always visible */}
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 group"
        onClick={() => !locked && setOpen((o) => !o)}
        aria-expanded={locked ? false : open}
      >
        {/* Severity badge */}
        <span
          className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm mt-0.5 ${s.textClass} ${s.bgClass}`}
        >
          {s.label}
        </span>

        {/* Title */}
        <span className="flex-1 text-white text-sm font-semibold leading-snug group-hover:text-green transition-colors">
          {entry.title}
        </span>

        {/* Lock icon or expand chevron */}
        {locked ? (
          <span className="flex-shrink-0 text-secondary text-xs mt-0.5" aria-hidden="true">🔒</span>
        ) : (
          <span
            className={`flex-shrink-0 text-secondary text-xs mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▾
          </span>
        )}
      </button>

      {/* Locked state — blurred preview + upgrade CTA */}
      {locked && (
        <div className="relative px-5 pb-5 border-t border-border pt-4">
          {/* Blurred content preview */}
          <div className="space-y-3 select-none" style={{ filter: 'blur(4px)', pointerEvents: 'none' }} aria-hidden="true">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">What this means</p>
              <p className="text-secondary text-sm">Upgrade to see the full explanation and fix instructions for this issue.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">What needs to happen</p>
              <p className="text-secondary text-sm">Step-by-step fix instructions are available with a paid plan.</p>
            </div>
          </div>
          {/* Upgrade overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
            <p className="font-mono text-xs text-white text-center">Unlock fix instructions</p>
            <a
              href="/pricing"
              className="font-mono text-xs uppercase tracking-wider bg-green text-black px-5 py-2 hover:bg-green-mid transition-colors"
            >
              Upgrade — from €10 →
            </a>
          </div>
        </div>
      )}

      {/* Expanded content (unlocked) */}
      {!locked && open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">

          {/* What this means */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">
              What this means
            </p>
            <p className="text-secondary text-sm leading-relaxed">{entry.means}</p>
          </div>

          {/* What needs to happen */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">
              What needs to happen
            </p>
            <p className="text-secondary text-sm leading-relaxed">{entry.fix}</p>
          </div>

          {/* Where it is (count) */}
          {count !== undefined && count > 0 && (
            <div className={`text-sm px-3 py-2 rounded-sm ${s.bgClass}`}>
              <span className={`font-mono text-xs ${s.textClass}`}>
                Found {count} {count === 1 ? 'instance' : 'instances'} on this page
              </span>
            </div>
          )}

          {/* Technical detail toggle (WCAG ref) */}
          <div>
            <button
              className="font-mono text-[10px] uppercase tracking-widest text-secondary hover:text-white transition-colors flex items-center gap-1.5"
              onClick={() => setShowTechnical((v) => !v)}
            >
              <span>{showTechnical ? '▾' : '▸'}</span>
              {showTechnical ? 'Hide' : 'Show'} technical detail
            </button>
            {showTechnical && (
              <p className="mt-2 text-secondary text-xs font-mono leading-relaxed pl-4 border-l-2 border-border">
                {entry.wcag}
              </p>
            )}
          </div>

          {/* Checklist checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group/check">
            <input
              type="checkbox"
              checked={fixed}
              onChange={(e) => setFixed(e.target.checked)}
              className="w-4 h-4 rounded-sm border border-border bg-black accent-green cursor-pointer"
            />
            <span className={`text-sm transition-colors ${fixed ? 'line-through text-secondary' : 'text-white group-hover/check:text-green'}`}>
              Mark as fixed
            </span>
          </label>

        </div>
      )}
    </div>
  );
}
