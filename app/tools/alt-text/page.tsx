'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ImageResult } from '@/app/api/alt-text/route';
import {
  PassIcon,
  FailIcon,
  AmberIcon,
  SparkleIcon,
  CopyIcon,
  ImagePlaceholderIcon,
  ScanIcon,
} from '@/components/Icons';

const STATUS_CONFIG = {
  missing: {
    Icon: FailIcon,
    label: 'Missing',
    textClass: 'text-fail',
    bg: 'rgba(220,38,38,0.07)',
    border: 'rgba(220,38,38,0.22)',
  },
  generic: {
    Icon: AmberIcon,
    label: 'Generic',
    textClass: 'text-amber',
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.22)',
  },
  ok: {
    Icon: PassIcon,
    label: 'Has alt',
    textClass: 'text-pass',
    bg: 'rgba(22,163,74,0.07)',
    border: 'rgba(22,163,74,0.22)',
  },
};

const SCAN_STEPS = [
  'Loading page…',
  'Detecting images…',
  'Analysing with Claude…',
];

function ImageRow({ img, index }: { img: ImageResult; index: number }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const s = STATUS_CONFIG[img.status];
  const filename = img.src.split('/').pop()?.split('?')[0] ?? img.src;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex items-start gap-5 py-5 border-b border-lc-border last:border-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Thumbnail / placeholder */}
      <div className="flex-shrink-0 w-20 h-14 border border-lc-border bg-lc-bg flex items-center justify-center overflow-hidden">
        {imgError ? (
          <ImagePlaceholderIcon size={36} className="text-lc-border" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.src}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Status + filename */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 ${s.textClass}`}
            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
          >
            <s.Icon size={11} />
            <span className="font-mono text-[10px] uppercase tracking-widest">{s.label}</span>
          </div>
          <span className="font-mono text-xs text-lc-muted truncate max-w-xs" title={img.src}>
            {filename}
          </span>
        </div>

        {/* Current alt */}
        {img.currentAlt !== null && img.status !== 'ok' && (
          <p className="text-xs text-lc-muted mb-2">
            <span className="font-mono text-lc-muted/60">current: </span>
            &ldquo;{img.currentAlt}&rdquo;
          </p>
        )}
        {img.status === 'ok' && (
          <p className="text-xs text-lc-muted mb-2">
            <span className="font-mono text-lc-muted/60">alt: </span>
            &ldquo;{img.currentAlt}&rdquo;
          </p>
        )}

        {/* AI suggestion */}
        {img.suggestedAlt && (
          <div className="flex items-stretch gap-0">
            <div
              className="flex-1 px-3 py-2.5 border border-lc-border border-r-0"
              style={{ backgroundColor: 'rgba(145,119,207,0.06)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <SparkleIcon size={12} className="text-lc-purple flex-shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-lc-purple">
                  AI suggestion
                </span>
              </div>
              <p className="text-sm text-lc-fg leading-relaxed">{img.suggestedAlt}</p>
            </div>
            <button
              onClick={() => copy(img.suggestedAlt!)}
              className="flex-shrink-0 w-10 flex flex-col items-center justify-center gap-1 border border-lc-border text-lc-muted hover:border-lc-purple hover:text-lc-purple transition-colors"
              title="Copy suggestion"
            >
              {copied ? (
                <PassIcon size={13} className="text-pass" />
              ) : (
                <CopyIcon size={13} />
              )}
              <span className="font-mono text-[9px] uppercase tracking-wider">
                {copied ? 'Done' : 'Copy'}
              </span>
            </button>
          </div>
        )}

        {img.error && (
          <p className="font-mono text-xs text-fail mt-1">{img.error}</p>
        )}
      </div>
    </div>
  );
}

export default function AltTextTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
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
    setStepIndex(0);

    // Cycle through scan steps
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, SCAN_STEPS.length - 1));
    }, 2500);

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
      clearInterval(interval);
      setLoading(false);
    }
  };

  const coveragePct = data
    ? Math.round(((data.total - data.missing) / Math.max(data.total, 1)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-lc-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-lc-fg hover:text-lc-purple transition-colors font-semibold"
          >
            A11YO
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-wider uppercase text-lc-purple">
              Alt Text Tool
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
          <div className="mb-10 grid-bg border border-lc-border bg-lc-card p-8">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-lc-border bg-lc-bg">
                <ScanIcon size={22} className="text-lc-purple" />
              </div>
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-2">
                  Free Tool
                </span>
                <h1 className="text-3xl font-semibold text-lc-fg tracking-tight mb-2">
                  AI Alt Text Generator
                </h1>
                <p className="text-lc-muted leading-relaxed max-w-xl">
                  Finds every image on your page, flags missing or generic alt text,
                  and uses Claude to generate contextual suggestions — ready to copy.
                </p>
              </div>
            </div>
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

            {/* Loading steps */}
            {loading && (
              <div className="mt-5 max-w-2xl">
                <div className="flex gap-1 mb-3">
                  {SCAN_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-0.5 flex-1 transition-colors duration-500"
                      style={{
                        backgroundColor:
                          i <= stepIndex ? '#9177CF' : '#D4D1CB',
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 border border-lc-purple border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="font-mono text-xs tracking-wider uppercase text-lc-muted transition-all">
                    {SCAN_STEPS[stepIndex]}
                  </span>
                </div>
              </div>
            )}
          </form>

          {/* Results */}
          {data && (
            <div className="space-y-5">
              {/* Summary bar */}
              <div className="corner-mark border border-lc-border bg-lc-card">
                {/* Coverage bar */}
                <div className="h-1 bg-lc-border">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${coveragePct}%`,
                      backgroundColor: coveragePct >= 80 ? '#16A34A' : coveragePct >= 50 ? '#D97706' : '#DC2626',
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 divide-x divide-lc-border">
                  <div className="px-6 py-5 text-center">
                    <p className="font-mono text-3xl font-semibold text-lc-fg leading-none mb-1">
                      {data.total}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-wider text-lc-muted">
                      Images found
                    </p>
                  </div>
                  <div className="px-6 py-5 text-center">
                    <p
                      className={`font-mono text-3xl font-semibold leading-none mb-1 ${
                        data.missing > 0 ? 'text-fail' : 'text-pass'
                      }`}
                    >
                      {data.missing}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-wider text-lc-muted">
                      Missing / generic
                    </p>
                  </div>
                  <div className="px-6 py-5 text-center">
                    <p className="font-mono text-3xl font-semibold text-lc-purple leading-none mb-1">
                      {data.generated}
                    </p>
                    <div className="flex items-center justify-center gap-1.5">
                      <SparkleIcon size={11} className="text-lc-purple" />
                      <p className="font-mono text-xs uppercase tracking-wider text-lc-muted">
                        AI suggestions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image list */}
              <div className="corner-mark border border-lc-border bg-lc-card px-5">
                {data.results.map((img, i) => (
                  <ImageRow key={i} img={img} index={i} />
                ))}
              </div>

              {/* Attribution */}
              <p className="font-mono text-xs text-lc-muted/60 text-center flex items-center justify-center gap-1.5">
                <SparkleIcon size={10} className="text-lc-purple/60" />
                Suggestions generated by Claude · Anthropic
              </p>
            </div>
          )}

        </div>
      </main>

      <footer className="border-t border-lc-border px-6 py-5 bg-lc-card mt-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-lc-muted">
            Powered by Claude · A11YO
          </span>
          <Link
            href="/"
            className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors"
          >
            ← Full site audit
          </Link>
        </div>
      </footer>
    </div>
  );
}
