/**
 * Superadmin Dashboard (/admin)
 * Restricted to role: admin users.
 */
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';
import AdminUserTable from '@/components/AdminUserTable';
import Logo from '@/components/Logo';

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const profile = await getProfile(user.id);
  if (profile?.role !== 'admin') redirect('/dashboard');

  const supabase = createSupabaseServerClient();

  // All profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, plan, role, created_at, stripe_customer_id, stripe_subscription_id')
    .order('created_at', { ascending: false });

  // Scan counts per user
  const { data: scanRows } = await supabase
    .from('scans')
    .select('user_id')
    .not('user_id', 'is', null);

  const scansByUser: Record<string, number> = {};
  (scanRows ?? []).forEach((s: { user_id: string }) => {
    scansByUser[s.user_id] = (scansByUser[s.user_id] ?? 0) + 1;
  });

  const profilesWithCounts = (profiles ?? []).map((p) => ({
    ...p,
    scan_count: scansByUser[p.id] ?? 0,
  }));

  // Stats
  const totalUsers = profiles?.length ?? 0;
  const proUsers = profiles?.filter((p) => p.plan === 'pro').length ?? 0;
  const agencyUsers = profiles?.filter((p) => p.plan === 'agency').length ?? 0;
  const earlyAccessUsers = profiles?.filter((p) => p.plan === 'early_access').length ?? 0;
  const paidUsers = proUsers + agencyUsers;
  const mrr = proUsers * 5 + agencyUsers * 15;
  const totalScans = Object.values(scansByUser).reduce((a, b) => a + b, 0);

  // Early access
  const { data: earlyAccessRow } = await supabase
    .from('early_access_redemptions')
    .select('count')
    .eq('id', 1)
    .single();
  const earlyAccessUsed = earlyAccessRow?.count ?? 0;
  const earlyAccessRemaining = Math.max(0, 25 - earlyAccessUsed);

  // Waitlist
  const { count: waitlistCount } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  const supabaseProjectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] ?? '';

  return (
    <div className="min-h-screen bg-black flex flex-col">

      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-green transition-colors" aria-label="A11YO home">
            <Logo size={28} />
          </Link>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-green uppercase tracking-widest">Superadmin</span>
            <Link href="/dashboard" className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-white transition-colors">
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-6xl mx-auto space-y-10">

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-green block mb-1">Admin</span>
            <h1 className="text-3xl font-display font-extrabold text-white">Control Panel</h1>
            <p className="font-mono text-xs text-secondary mt-1">{user.email}</p>
          </div>

          {/* ── STATS ── */}
          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Platform Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="corner-mark border border-green bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-green block">€{mrr}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">MRR</span>
              </div>
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">€{mrr * 12}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">ARR (proj.)</span>
              </div>
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">{paidUsers}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">Paid users</span>
              </div>
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">{totalScans}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">Total scans</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">{totalUsers}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">Total users</span>
              </div>
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">{proUsers}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">Pro (€5/mo)</span>
              </div>
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">{agencyUsers}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">Full Site (€15/mo)</span>
              </div>
              <div className="corner-mark border border-border bg-surface px-5 py-4">
                <span className="font-display text-3xl font-extrabold text-white block">{earlyAccessUsers}</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">Early Access</span>
              </div>
            </div>
          </section>

          {/* ── EARLY ACCESS + WAITLIST ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">Early Access Slots</h2>
              <div className="corner-mark border border-border bg-surface px-6 py-5">
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-display text-4xl font-extrabold text-green">{earlyAccessUsed}</span>
                  <span className="font-mono text-xs text-secondary">/ 25 used</span>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-green" style={{ width: `${Math.min(100, (earlyAccessUsed / 25) * 100)}%` }} />
                  </div>
                  <span className={`font-mono text-xs font-semibold ${earlyAccessRemaining === 0 ? 'text-fail' : 'text-secondary'}`}>
                    {earlyAccessRemaining} left
                  </span>
                </div>
                {earlyAccessRemaining === 0 && (
                  <p className="font-mono text-xs text-fail">All slots filled — paid model is active.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">Extension Waitlist</h2>
              <div className="corner-mark border border-border bg-surface px-6 py-5 flex items-center gap-4">
                <span className="font-display text-4xl font-extrabold text-white">{waitlistCount ?? 0}</span>
                <div>
                  <span className="font-mono text-xs text-secondary block">leads captured</span>
                  <span className="font-mono text-[10px] text-secondary">via /extension waitlist</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── USER MANAGEMENT ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-secondary">
                User Management ({totalUsers})
              </h2>
              <span className="font-mono text-[10px] text-secondary hidden sm:block">
                Plan &amp; role editable inline · delete removes auth + profile
              </span>
            </div>
            <AdminUserTable profiles={profilesWithCounts} />
          </section>

          {/* ── QUICK LINKS ── */}
          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">Quick Links</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Stripe Dashboard', href: 'https://dashboard.stripe.com' },
                { label: 'Supabase Dashboard', href: `https://supabase.com/dashboard/project/${supabaseProjectId}` },
                { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard' },
                { label: 'View Site', href: '/' },
                { label: 'Sample Report', href: '/sample-report' },
                { label: 'Extension Page', href: '/extension' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="font-mono text-xs border border-border text-secondary px-4 py-2 hover:border-green hover:text-white transition-colors"
                >
                  {label} →
                </a>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <span className="font-mono text-xs text-secondary">A11YO Superadmin · {user.email}</span>
        </div>
      </footer>
    </div>
  );
}
