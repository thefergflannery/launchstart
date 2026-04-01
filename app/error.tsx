'use client';

import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <span className="font-mono text-xs tracking-widest uppercase text-fail block mb-6">Error</span>
        <h1 className="text-4xl font-display font-extrabold text-white mb-4 tracking-tight">
          Something went wrong.
        </h1>
        <p className="text-secondary leading-relaxed mb-10">
          An unexpected error occurred. Try again, or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="font-mono text-sm tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-mono text-sm tracking-wider uppercase border border-border text-white px-6 py-3 hover:border-white transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
