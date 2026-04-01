'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RedeemCode() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
      // Refresh server data so plan badge and features update
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 border border-green/30 bg-green/5">
        <span className="text-green font-mono text-sm">✓</span>
        <p className="font-mono text-sm text-white">
          Code accepted. Your account has been upgraded to Early Access.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="A11YO-XXXXXXXX"
          disabled={loading}
          className="flex-1 bg-black border border-border text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-green transition-colors placeholder-secondary disabled:opacity-50"
          aria-label="Early access code"
          aria-describedby={error ? 'redeem-error' : undefined}
          aria-invalid={error ? 'true' : 'false'}
          spellCheck={false}
          autoCapitalize="characters"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="font-mono text-xs uppercase tracking-wider border border-green text-green px-5 py-3 hover:bg-green hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Redeeming…' : 'Redeem'}
        </button>
      </div>
      {error && (
        <p id="redeem-error" role="alert" className="font-mono text-xs text-fail mt-2">
          {error}
        </p>
      )}
    </form>
  );
}
