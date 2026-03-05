import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black grid-bg flex flex-col items-center justify-center px-6">
      <div className="corner-mark border border-border bg-surface p-10 text-center max-w-sm w-full">
        <span className="font-mono text-xs tracking-widest uppercase text-green block mb-4">
          404
        </span>
        <h1 className="text-xl font-semibold text-white mb-2">Report not found</h1>
        <p className="text-secondary text-sm mb-6">
          This report ID doesn&apos;t exist or the scan didn&apos;t complete.
        </p>
        <Link
          href="/"
          className="font-mono text-xs tracking-wider uppercase border border-border px-5 py-2.5 text-white hover:border-green hover:text-green transition-colors inline-block"
        >
          Run a new scan →
        </Link>
      </div>
    </div>
  );
}
