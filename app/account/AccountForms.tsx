'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-client';

// ─── Change Email ────────────────────────────────────────────────────────────

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || email === currentEmail) return;
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      setStatus('err');
      setMsg(error.message);
    } else {
      setStatus('ok');
      setMsg('Check your new email address for a confirmation link.');
      setEmail('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="new-email" className="font-mono text-[10px] uppercase tracking-widest text-secondary block mb-1.5">
          New email address
        </label>
        <div className="flex gap-2">
          <input
            id="new-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={currentEmail}
            className="flex-1 px-3 py-2.5 bg-black border border-border text-white text-sm font-mono placeholder-secondary/40 focus:outline-none focus:border-green/50"
            required
          />
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-wider border border-border px-4 py-2 text-secondary hover:text-white hover:border-white transition-colors whitespace-nowrap"
          >
            Update →
          </button>
        </div>
      </div>
      {status === 'ok' && <p className="font-mono text-xs text-green">{msg}</p>}
      {status === 'err' && <p role="alert" className="font-mono text-xs text-fail">{msg}</p>}
    </form>
  );
}

// ─── Change Password ─────────────────────────────────────────────────────────

export function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      setStatus('err');
      setMsg('Passwords do not match.');
      return;
    }
    if (next.length < 8) {
      setStatus('err');
      setMsg('Password must be at least 8 characters.');
      return;
    }
    // Re-authenticate first
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setStatus('err'); setMsg('Not signed in.'); return; }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInError) {
      setStatus('err');
      setMsg('Current password is incorrect.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) {
      setStatus('err');
      setMsg(error.message);
    } else {
      setStatus('ok');
      setMsg('Password updated.');
      setCurrent(''); setNext(''); setConfirm('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {[
        { id: 'cur-pw', label: 'Current password', val: current, set: setCurrent },
        { id: 'new-pw', label: 'New password',     val: next,    set: setNext    },
        { id: 'cfm-pw', label: 'Confirm new password', val: confirm, set: setConfirm },
      ].map(({ id, label, val, set }) => (
        <div key={id}>
          <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-secondary block mb-1.5">
            {label}
          </label>
          <input
            id={id}
            type="password"
            value={val}
            onChange={(e) => set(e.target.value)}
            className="w-full px-3 py-2.5 bg-black border border-border text-white text-sm font-mono focus:outline-none focus:border-green/50"
            required
            minLength={id === 'cur-pw' ? 1 : 8}
          />
        </div>
      ))}
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-wider border border-border px-4 py-2 text-secondary hover:text-white hover:border-white transition-colors"
      >
        Update password →
      </button>
      {status === 'ok' && <p className="font-mono text-xs text-green">{msg}</p>}
      {status === 'err' && <p role="alert" className="font-mono text-xs text-fail">{msg}</p>}
    </form>
  );
}

// ─── Billing Portal Button ────────────────────────────────────────────────────

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not open billing portal.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="font-mono text-xs uppercase tracking-wider bg-green text-black px-5 py-2.5 hover:bg-green-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Opening…' : 'Manage billing & subscription →'}
      </button>
      {error && <p role="alert" className="font-mono text-xs text-fail mt-2">{error}</p>}
    </div>
  );
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleDelete() {
    if (typed !== 'DELETE') return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not delete account.');
        setLoading(false);
        return;
      }
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push('/?deleted=1');
    } catch {
      setError('Could not reach the server.');
      setLoading(false);
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="font-mono text-xs uppercase tracking-wider text-fail hover:underline"
      >
        Delete account and all data →
      </button>
    );
  }

  return (
    <div className="space-y-3 border border-fail/30 bg-fail/5 p-5">
      <p className="text-white text-sm font-semibold">Are you sure?</p>
      <p className="text-secondary text-sm">
        This will permanently delete your account, all scan history, and all reports. This cannot be undone.
        Your Stripe subscription (if any) will not be automatically cancelled — please cancel it first in billing settings.
      </p>
      <div>
        <label htmlFor="delete-confirm" className="font-mono text-[10px] uppercase tracking-widest text-secondary block mb-1.5">
          Type DELETE to confirm
        </label>
        <input
          id="delete-confirm"
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="w-full px-3 py-2.5 bg-black border border-fail/40 text-white text-sm font-mono focus:outline-none focus:border-fail focus:ring-1 focus:ring-fail/40"
          placeholder="DELETE"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={typed !== 'DELETE' || loading}
          className="font-mono text-xs uppercase tracking-wider bg-fail text-white px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? 'Deleting…' : 'Yes, delete everything'}
        </button>
        <button
          onClick={() => { setConfirming(false); setTyped(''); }}
          className="font-mono text-xs uppercase tracking-wider border border-border px-4 py-2 text-secondary hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
      {error && <p role="alert" className="font-mono text-xs text-fail">{error}</p>}
    </div>
  );
}
