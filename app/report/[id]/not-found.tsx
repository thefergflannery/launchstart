import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-lc-bg grid-bg flex flex-col items-center justify-center px-6">
      <div className="corner-mark border border-lc-border bg-lc-card p-10 text-center max-w-sm w-full">
        <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-4">
          404
        </span>
        <h1 className="text-xl font-semibold text-lc-fg mb-2">Report not found</h1>
        <p className="text-lc-muted text-sm mb-6">
          This report ID doesn&apos;t exist or the scan didn&apos;t complete.
        </p>
        <Link
          href="/"
          className="font-mono text-xs tracking-wider uppercase border border-lc-border px-5 py-2.5 text-lc-fg hover:border-lc-purple hover:text-lc-purple transition-colors inline-block"
        >
          Run a new scan →
        </Link>
      </div>
    </div>
  );
}
