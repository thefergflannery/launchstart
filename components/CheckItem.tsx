import { CheckResult } from '@/lib/types';
import { PassIcon, FailIcon, AmberIcon } from './Icons';

const STATUS = {
  pass: {
    Icon: PassIcon,
    label: 'Pass',
    textClass: 'text-pass',
    bg: 'rgba(22,163,74,0.07)',
    border: 'rgba(22,163,74,0.22)',
  },
  amber: {
    Icon: AmberIcon,
    label: 'Amber',
    textClass: 'text-amber',
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.22)',
  },
  fail: {
    Icon: FailIcon,
    label: 'Fail',
    textClass: 'text-fail',
    bg: 'rgba(220,38,38,0.07)',
    border: 'rgba(220,38,38,0.22)',
  },
};

export default function CheckItem({ check }: { check: CheckResult }) {
  const s = STATUS[check.status];

  return (
    <div className="flex items-start gap-4 py-4 border-b border-lc-border last:border-0">
      {/* SVG status icon */}
      <div
        className={`flex-shrink-0 w-7 h-7 flex items-center justify-center mt-0.5 ${s.textClass}`}
        style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
      >
        <s.Icon size={13} className="currentColor" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-lc-fg text-sm font-semibold">{check.label}</span>
          <span
            className={`font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 ${s.textClass}`}
            style={{ backgroundColor: s.bg }}
          >
            {s.label}
          </span>
        </div>
        <p className="text-lc-muted text-sm leading-relaxed">{check.message}</p>
        {check.status !== 'pass' && (
          <div className="mt-2 pl-3 border-l-2 border-lc-border">
            <p className="text-lc-muted text-xs font-mono leading-relaxed">{check.fixHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
