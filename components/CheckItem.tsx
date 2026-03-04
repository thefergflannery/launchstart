import { CheckResult } from '@/lib/types';

const STATUS_CONFIG = {
  pass: {
    dot: 'bg-green-500',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    label: 'Pass',
  },
  amber: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'Amber',
  },
  fail: {
    dot: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    label: 'Fail',
  },
};

export default function CheckItem({ check }: { check: CheckResult }) {
  const config = STATUS_CONFIG[check.status];

  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-gray-800 last:border-0">
      {/* Status dot */}
      <div className="mt-1 flex-shrink-0">
        <span className={`block w-2.5 h-2.5 rounded-full ${config.dot}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white text-sm font-medium">{check.label}</span>
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${config.badge}`}
          >
            {config.label}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{check.message}</p>
        {check.status !== 'pass' && (
          <p className="text-gray-600 text-xs mt-1">
            <span className="text-gray-500 font-medium">Fix: </span>
            {check.fixHint}
          </p>
        )}
      </div>
    </div>
  );
}
