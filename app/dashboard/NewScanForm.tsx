'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewScanFormClient({ prefillUrl }: { prefillUrl?: string } = {}) {
  const router = useRouter();
  const [url, setUrl] = useState(prefillUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    let normalised = url.trim();
    if (!normalised) return;
    if (!/^https?:\/\//i.test(normalised)) normalised = 'https://' + normalised;

    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalised }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Scan failed. Please try again.');
        return;
      }
      router.push(`/report/${data.id}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8" noValidate>
      <label htmlFor="scan-url" className="font-mono text-xs uppercase tracking-wider text-secondary block mb-2">
        New scan
      </label>
      <div className="flex gap-2">
        <input
          id="scan-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yoursite.com"
          disabled={loading}
          className="flex-1 bg-surface border border-border text-white placeholder-secondary font-mono text-sm px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green disabled:opacity-50"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'scan-error' : undefined}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="font-mono text-xs uppercase tracking-wider border border-green text-green px-6 py-3 hover:bg-green hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Scanning…' : 'Run audit →'}
        </button>
      </div>
      {error && (
        <p id="scan-error" role="alert" className="font-mono text-xs text-fail mt-2">
          {error}
        </p>
      )}
    </form>
  );
}
