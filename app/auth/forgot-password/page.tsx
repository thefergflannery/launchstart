'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm corner-mark border border-border bg-surface p-8 text-center">
          <div className="w-10 h-10 border border-green flex items-center justify-center mx-auto mb-4">
            <span className="text-green font-mono text-lg">✓</span>
          </div>
          <h1 className="text-xl font-display font-semibold text-white mb-2">Check your inbox</h1>
          <p className="text-secondary text-sm mb-4">
            If <strong className="text-white">{email}</strong> has an account, we&apos;ve sent a password reset link.
          </p>
          <Link href="/auth/login" className="font-mono text-xs text-green hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-display text-xl font-bold text-white hover:text-green transition-colors mb-8">
          A11YO
        </Link>

        <div className="corner-mark border border-border bg-surface p-8">
          <h1 className="text-xl font-display font-semibold text-white mb-1">Reset password</h1>
          <p className="text-secondary text-sm mb-6">
            Enter your email and we&apos;ll send a reset link.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-border text-white text-sm focus:outline-none focus:border-green transition-colors"
                disabled={loading}
              />
            </div>

            {error && (
              <p role="alert" className="mb-4 font-mono text-xs text-fail">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3 bg-green text-black font-mono text-sm tracking-wider uppercase font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Sending…' : 'Send reset link →'}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs text-secondary mt-5">
          <Link href="/auth/login" className="text-green hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
