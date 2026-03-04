'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SCAN_MESSAGES = [
  'Loading page…',
  'Running accessibility checks…',
  'Scanning SEO metadata…',
  'Checking launch readiness…',
  'Testing broken links…',
  'Saving your report…',
];

const CHECKS = [
  { label: 'Accessibility', count: '7 checks', desc: 'Images, labels, contrast, ARIA, headings, focus' },
  { label: 'SEO Basics', count: '5 checks', desc: 'Meta description, OG tags, viewport, HTTPS' },
  { label: 'Launch Readiness', count: '5 checks', desc: 'Robots.txt, sitemap, load time, broken links' },
];

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setMsgIndex(0);

    try {
      let normalized = url.trim();
      if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`;
      }

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Scan failed');

      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lc-bg grid-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-mono text-sm tracking-widest uppercase text-lc-fg font-semibold">
            LaunchCheck
          </span>
          <span className="font-mono text-xs tracking-wider uppercase text-lc-muted">
            Pre-launch auditor
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl">

          {/* Label */}
          <div className="mb-6">
            <span className="font-mono text-xs tracking-widest uppercase text-lc-purple font-medium">
              Website Audit Tool
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-semibold text-lc-fg leading-tight tracking-tight mb-4">
            Ship with{' '}
            <span className="text-lc-purple">confidence.</span>
          </h1>
          <p className="text-lc-muted text-lg mb-10 max-w-lg">
            Scan any URL for accessibility violations, SEO gaps, and launch
            readiness — get a shareable report in under 30 seconds.
          </p>

          {/* Input */}
          <form onSubmit={handleSubmit}>
            <div className="corner-mark border border-lc-border bg-lc-card flex items-stretch">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="flex-1 px-5 py-4 bg-transparent text-lc-fg placeholder-lc-muted/60 focus:outline-none text-base font-mono"
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-7 py-4 bg-lc-fg text-lc-bg font-mono text-sm tracking-wider uppercase hover:bg-lc-purple disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-lc-border"
              >
                {loading ? 'Scanning…' : 'Audit →'}
              </button>
            </div>

            {error && (
              <p className="mt-3 font-mono text-xs text-fail">{error}</p>
            )}
          </form>

          {/* Progress */}
          {loading && (
            <div className="mt-6 flex items-center gap-3">
              <span className="w-3 h-3 border border-lc-purple border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="font-mono text-xs tracking-wider text-lc-muted uppercase">
                {SCAN_MESSAGES[msgIndex]}
              </span>
            </div>
          )}

          {/* Check grid */}
          {!loading && (
            <div className="mt-14 grid grid-cols-3 divide-x divide-lc-border border border-lc-border">
              {CHECKS.map((item) => (
                <div key={item.label} className="p-5">
                  <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-2">
                    {item.count}
                  </span>
                  <p className="text-lc-fg font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-lc-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-lc-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-lc-muted tracking-wider uppercase">
            LaunchCheck
          </span>
          <span className="font-mono text-xs text-lc-muted">
            Powered by axe-core + Puppeteer
          </span>
        </div>
      </footer>
    </div>
  );
}
