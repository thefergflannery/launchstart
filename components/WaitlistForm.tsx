'use client';

import { useState } from 'react';
import { PassIcon } from './Icons';

type State = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export default function WaitlistForm({ placeholder = 'your@email.com' }: { placeholder?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.status === 409) { setState('duplicate'); return; }
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex items-start gap-3 border border-green px-4 py-3">
        <span className="mt-0.5 flex-shrink-0 text-green"><PassIcon size={13} /></span>
        <div>
          <p className="text-white text-sm font-semibold mb-0.5">You&apos;re on the list.</p>
          <p className="text-white/50 text-xs font-mono">{email}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-stretch border border-white/15 hover:border-green transition-colors">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={state === 'loading'}
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/25 focus:outline-none font-mono text-sm"
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email.trim()}
          className="px-5 py-3 bg-green text-white font-mono text-xs tracking-wider uppercase hover:bg-green/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap border-l border-white/15"
        >
          {state === 'loading' ? '…' : 'Join →'}
        </button>
      </div>
      {state === 'duplicate' && (
        <p className="mt-2 font-mono text-xs text-green">Already on the list.</p>
      )}
      {state === 'error' && (
        <p className="mt-2 font-mono text-xs text-fail">Something went wrong — try again.</p>
      )}
    </form>
  );
}
