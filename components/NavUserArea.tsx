'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase-client';

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 13.5c0-2.5 2.686-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 5.5 9.5 8 7 10.5M2 8h7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type AuthState = 'loading' | 'authed' | 'anon';

export default function NavUserArea() {
  const [state, setState] = useState<AuthState>('loading');

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? 'authed' : 'anon');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? 'authed' : 'anon');
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fixed width placeholder while loading to prevent layout shift
  if (state === 'loading') {
    return <span className="w-16 h-8 inline-block" aria-hidden="true" />;
  }

  if (state === 'authed') {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-secondary hover:text-white transition-colors px-3 py-3"
        aria-label="Your dashboard"
        title="Dashboard"
      >
        <UserIcon />
        <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="flex items-center gap-1 font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors px-3 py-3"
      title="Sign in"
    >
      <LoginIcon />
      <span className="hidden sm:inline">Sign in</span>
    </Link>
  );
}
