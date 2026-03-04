import { CheckResult } from '@/lib/types';

const STATUS = {
  pass: { dot: 'bg-pass', label: 'Pass', text: 'text-pass' },
  amber: { dot: 'bg-amber', label: 'Amber', text: 'text-amber' },
  fail: { dot: 'bg-fail', label: 'Fail', text: 'text-fail' },
};

export default function CheckItem({ check }: { check: CheckResult }) {
  const s = STATUS[check.status];

  return (
    <div className="flex items-start gap-4 py-4 border-b border-lc-border last:border-0">
      {/* Dot */}
      <div className="mt-1.5 flex-shrink-0">
        <span className={`block w-2 h-2 rounded-full ${s.dot}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-0.5">
          <span className="text-lc-fg text-sm font-semibold">{check.label}</span>
          <span className={`font-mono text-xs uppercase tracking-wider ${s.text}`}>
            {s.label}
          </span>
        </div>
        <p className="text-lc-muted text-sm">{check.message}</p>
        {check.status !== 'pass' && (
          <p className="text-lc-muted/60 text-xs mt-1 font-mono">
            ↳ {check.fixHint}
          </p>
        )}
      </div>
    </div>
  );
}
