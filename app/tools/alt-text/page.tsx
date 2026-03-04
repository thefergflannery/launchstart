'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ImageResult } from '@/app/api/alt-text/route';

const STATUS_CONFIG = {
  missing: { dot: 'bg-fail', label: 'Missing', text: 'text-fail' },
  generic: { dot: 'bg-amber', label: 'Generic', text: 'text-amber' },
  ok: { dot: 'bg-pass', label: 'Has alt', text: 'text-pass' },
};

function ImageRow({ img }: { img: ImageResult }) {
  const [copied, setCopied] = useState(false);
  const s = STATUS_CONFIG[img.status];

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-lc-border last:border-0 py-4 grid grid-cols-[auto_1fr] gap-4 items-start">
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.src}
        alt=""
        className="w-16 h-12 object-cover border border-lc-border flex-shrink-0 bg-lc-border/20"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      <div className="min-w-0 space-y-1.5">
        {/* Status + filename */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span className="font-mono text-xs text-lc-muted truncate max-w-xs">
            {img.src.split('/').pop()?.split('?')[0]}
          </span>
        </div>

        {/* Current alt */}
        {img.currentAlt !== null && img.status !== 'ok' && (
          <p className="text-xs text-lc-muted">
            <span className="font-mono text-lc-muted/60">current: </span>
            &ldquo;{img.currentAlt}&rdquo;
          </p>
        )}
        {img.status === 'ok' && (
          <p className="text-xs text-lc-muted">
            <span className="font-mono text-lc-muted/60">alt: </span>
            &ldquo;{img.currentAlt}&rdquo;
          </p>
        )}

        {/* Suggested alt */}
        {img.suggestedAlt && (
          <div className="flex items-start gap-2">
            <p className="text-sm text-lc-fg flex-1 bg-lc-purple-light border border-lc-purple/20 px-3 py-2">
              <span className="font-mono text-xs text-lc-purple block mb-0.5">AI suggestion</span>
              {img.suggestedAlt}
            </p>
            <button
              onClick={() => copy(img.suggestedAlt!)}
              className="flex-shrink-0 font-mono text-xs border border-lc-border px-3 py-2 text-lc-muted hover:border-lc-purple hover:text-lc-purple transition-colors"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        )}

        {img.error && (
          <p className="font-mono text-xs text-fail">{img.error}</p>
        )}
      </div>
    </div>
  );
}

export default function AltTextTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<{
    url: string;
    total: number;
    missing: number;
    generated: number;
    results: ImageResult[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      let normalized = url.trim();
      if (!normalized.startsWith('http')) normalized = `https://${normalized}`;

      const res = await fetch('/api/alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lc-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-lc-fg hover:text-lc-purple transition-colors"
          >
            A11YO
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-wider uppercase text-lc-purple">
              Tool
            </span>
            <Link
              href="/pricing"
              className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-3">
              Free Tool
            </span>
            <h1 className="text-4xl font-semibold text-lc-fg tracking-tight mb-3">
              AI Alt Text Generator
            </h1>
            <p className="text-lc-muted max-w-xl">
              Finds every image on your page, identifies those with missing or
              generic alt text, and uses Claude to generate contextual suggestions.
            </p>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="corner-mark border border-lc-border bg-white flex items-stretch max-w-2xl">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="flex-1 px-5 py-4 bg-white text-lc-fg placeholder-lc-muted/50 focus:outline-none text-base font-mono"
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-7 py-4 bg-lc-fg text-lc-bg font-mono text-sm tracking-wider uppercase hover:bg-lc-purple disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-lc-border whitespace-nowrap"
              >
                {loading ? 'Scanning…' : 'Generate →'}
              </button>
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-fail">{error}</p>
            )}
            {loading && (
              <div className="mt-4 flex items-center gap-3">
                <span className="w-3 h-3 border border-lc-purple border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs tracking-wider uppercase text-lc-muted">
                  Scraping images and generating alt text with Claude…
                </span>
              </div>
            )}
          </form>

          {/* Results */}
          {data && (
            <div>
              {/* Summary bar */}
              <div className="border border-lc-border bg-lc-card p-5 mb-6 grid grid-cols-3 divide-x divide-lc-border">
                <div className="px-4 first:pl-0 last:pr-0 text-center">
                  <p className="font-mono text-2xl font-semibold text-lc-fg">{data.total}</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-lc-muted">Images found</p>
                </div>
                <div className="px-4 text-center">
                  <p className={`font-mono text-2xl font-semibold ${data.missing > 0 ? 'text-fail' : 'text-pass'}`}>
                    {data.missing}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-wider text-lc-muted">Missing/generic</p>
                </div>
                <div className="px-4 text-center">
                  <p className="font-mono text-2xl font-semibold text-lc-purple">{data.generated}</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-lc-muted">AI suggestions</p>
                </div>
              </div>

              {/* Image list */}
              <div className="corner-mark border border-lc-border bg-lc-card px-5">
                {data.results.map((img, i) => (
                  <ImageRow key={i} img={img} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="border-t border-lc-border px-6 py-5 bg-lc-card">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs text-lc-muted">
            Powered by Claude · A11YO
          </span>
        </div>
      </footer>
    </div>
  );
}
