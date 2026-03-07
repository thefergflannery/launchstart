'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-client';

export default function SignupPanel() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) { setError(error.message); setLoading(false); return; }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setDone(true);
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-8 h-8 border border-green flex items-center justify-center mx-auto mb-3">
          <span className="text-green text-sm">✓</span>
        </div>
        <p className="text-white font-semibold text-sm mb-1">Check your inbox</p>
        <p className="text-secondary text-xs">Confirmation link sent to <span className="text-white">{email}</span></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoComplete="email"
          disabled={loading}
          className="flex-1 bg-black border border-border text-white placeholder-secondary font-mono text-sm px-4 py-3 focus:outline-none focus:border-green transition-colors"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
          className="flex-1 bg-black border border-border text-white placeholder-secondary font-mono text-sm px-4 py-3 focus:outline-none focus:border-green transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !email.trim() || !password.trim()}
          className="font-mono text-xs tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Creating…' : 'Create account →'}
        </button>
      </div>
      {error && <p className="font-mono text-xs text-fail mb-3">{error}</p>}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGoogle}
          className="font-mono text-xs tracking-wider uppercase border border-border text-secondary px-4 py-2 hover:border-white hover:text-white transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="currentColor" />
          </svg>
          Continue with Google
        </button>
        <p className="font-mono text-xs text-secondary">
          Already have an account?{' '}
          <a href="/auth/login" className="text-green hover:underline">Sign in →</a>
        </p>
      </div>
    </form>
  );
}
