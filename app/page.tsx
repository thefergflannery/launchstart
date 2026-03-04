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
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Pre-launch website auditor
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tight mb-4">
            LaunchCheck
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Scan any URL for accessibility issues, SEO basics, and launch readiness — in one click.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="flex-1 px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-colors"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {loading ? 'Scanning…' : 'Check site'}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center pt-1">{error}</p>
          )}
        </form>

        {/* Scan progress */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 text-gray-300 text-sm">
              <span className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin flex-shrink-0" />
              <span>{SCAN_MESSAGES[msgIndex]}</span>
            </div>
            <p className="mt-2 text-gray-600 text-xs">
              This can take up to 30 seconds for complex pages
            </p>
          </div>
        )}

        {/* Feature grid */}
        {!loading && (
          <div className="mt-16 grid grid-cols-3 gap-4">
            {[
              {
                icon: '♿',
                title: 'Accessibility',
                desc: 'axe-core WCAG checks',
                cls: 'border-purple-500/20 bg-purple-500/5',
              },
              {
                icon: '🔍',
                title: 'SEO Basics',
                desc: 'Meta tags, OG & HTTPS',
                cls: 'border-blue-500/20 bg-blue-500/5',
              },
              {
                icon: '🚀',
                title: 'Launch Readiness',
                desc: 'Robots, sitemap & links',
                cls: 'border-green-500/20 bg-green-500/5',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-xl p-5 border ${item.cls} text-center`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
