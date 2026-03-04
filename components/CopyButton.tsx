'use client';

import { useState } from 'react';

export default function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url).catch(() => {
      // clipboard API unavailable — silent fail, button still shows feedback
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-xs tracking-wider uppercase border border-lc-border px-4 py-2 text-lc-muted hover:border-lc-purple hover:text-lc-purple transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy link →'}
    </button>
  );
}
