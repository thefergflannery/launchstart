'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${redirect}` },
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="block text-center font-display text-xl font-bold text-white hover:text-green transition-colors mb-8">
          A11YO
        </Link>

        <div className="corner-mark border border-border bg-surface p-8">
          <h1 className="text-xl font-display font-semibold text-white mb-1">Sign in</h1>
          <p className="text-secondary text-sm mb-6">Welcome back.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 mb-4">
              <div>
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
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-secondary">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="font-mono text-xs text-secondary hover:text-green transition-colors">
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-border text-white text-sm focus:outline-none focus:border-green transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mb-4 font-mono text-xs text-fail">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green text-black font-mono text-sm tracking-wider uppercase font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-xs text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3 border border-border text-white font-mono text-sm tracking-wider uppercase hover:border-green transition-colors flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <p className="text-center font-mono text-xs text-secondary mt-5">
          No account?{' '}
          <Link href="/auth/signup" className="text-green hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="#f0f0f0" />
    </svg>
  );
}
