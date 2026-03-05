'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutButton({ plan, label }: { plan: string; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        router.push(`/auth/login?redirect=/pricing`);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not start checkout.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full font-mono text-xs uppercase tracking-wider border border-green text-green px-6 py-3 hover:bg-green hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting…' : label}
      </button>
      {error && (
        <p role="alert" className="font-mono text-xs text-fail mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
