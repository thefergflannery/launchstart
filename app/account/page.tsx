export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getUser, getProfile } from '@/lib/supabase-server';
import Logo from '@/components/Logo';
import LogoutButton from '@/app/dashboard/LogoutButton';
import {
  ChangeEmailForm,
  ChangePasswordForm,
  BillingPortalButton,
  DeleteAccountSection,
} from './AccountForms';

export const metadata: Metadata = { title: 'Account — A11YO' };

const PLAN_LABELS: Record<string, string> = {
  free:         'Free',
  onceoff:      'One-Off',
  recurring:    'Recurring',
  agency:       'Agency',
  early_access: 'Pro (Legacy)',
  pro:          'Pro (Legacy)',
};

const SUBSCRIPTION_PLANS = new Set(['recurring', 'agency', 'pro', 'early_access']);
const PAID_PLANS = new Set(['onceoff', 'recurring', 'agency', 'pro', 'early_access']);

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login?redirect=/account');

  const profile = await getProfile(user.id);
  const plan = profile?.plan ?? 'free';
  const planLabel = PLAN_LABELS[plan] ?? 'Free';
  const isSubscription = SUBSCRIPTION_PLANS.has(plan);
  const isPaid = PAID_PLANS.has(plan);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-green transition-colors" aria-label="A11YO home">
            <Logo size={28} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors">
              ← Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-8">

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-green block mb-2">Settings</span>
            <h1 className="text-3xl font-display font-extrabold text-white">Your account</h1>
          </div>

          {/* ── Plan ── */}
          <section aria-labelledby="plan-heading" className="corner-mark border border-border bg-surface p-7 space-y-5">
            <h2 id="plan-heading" className="font-mono text-xs uppercase tracking-widest text-secondary">Current plan</h2>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-white font-semibold text-lg">{planLabel}</p>
                <p className="font-mono text-xs text-secondary mt-0.5">{user.email}</p>
              </div>
              {!isPaid && (
                <Link
                  href="/pricing"
                  className="font-mono text-xs uppercase tracking-wider bg-green text-black px-5 py-2.5 hover:bg-green-mid transition-colors whitespace-nowrap"
                >
                  Upgrade plan →
                </Link>
              )}
            </div>

            {/* Billing portal — subscription plans only */}
            {isSubscription && profile?.stripe_customer_id && (
              <div className="pt-4 border-t border-border">
                <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-3">Billing</p>
                <p className="text-secondary text-sm mb-4">
                  Update payment method, view invoices, or cancel your subscription via the Stripe billing portal.
                </p>
                <BillingPortalButton />
              </div>
            )}

            {/* One-off plan — no recurring billing */}
            {plan === 'onceoff' && (
              <div className="pt-4 border-t border-border">
                <p className="text-secondary text-sm">
                  You&apos;re on the One-Off plan — a single payment with no recurring charges.
                  Upgrade to Recurring or Agency for ongoing monitoring.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block mt-3 font-mono text-xs uppercase tracking-wider border border-border px-4 py-2 text-secondary hover:text-white hover:border-white transition-colors"
                >
                  See upgrade options →
                </Link>
              </div>
            )}
          </section>

          {/* ── Email ── */}
          <section aria-labelledby="email-heading" className="corner-mark border border-border bg-surface p-7 space-y-4">
            <h2 id="email-heading" className="font-mono text-xs uppercase tracking-widest text-secondary">Email address</h2>
            <p className="text-secondary text-sm">
              Current: <span className="text-white font-mono">{user.email}</span>
            </p>
            <ChangeEmailForm currentEmail={user.email ?? ''} />
          </section>

          {/* ── Password ── */}
          <section aria-labelledby="password-heading" className="corner-mark border border-border bg-surface p-7 space-y-4">
            <h2 id="password-heading" className="font-mono text-xs uppercase tracking-widest text-secondary">Password</h2>
            <ChangePasswordForm />
          </section>

          {/* ── Danger zone ── */}
          <section aria-labelledby="danger-heading" className="corner-mark border border-border bg-surface p-7 space-y-4">
            <h2 id="danger-heading" className="font-mono text-xs uppercase tracking-widest text-secondary">Danger zone</h2>
            <div className="space-y-3">
              <p className="text-secondary text-sm">
                Deleting your account will permanently remove all your scan history and reports.
                {isSubscription && (
                  <span className="text-warn"> Please cancel your subscription via billing settings before deleting your account.</span>
                )}
              </p>
              <DeleteAccountSection />
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-xs text-secondary">A11YO · {user.email}</span>
        </div>
      </footer>
    </div>
  );
}
