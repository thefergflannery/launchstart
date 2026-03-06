/**
 * F-006 — Admin Dashboard (/admin)
 * Visible only to role: admin users.
 * PRD ref: §F-006
 */
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const PLAN_LABELS: Record<string, { label: string; cls: string }> = {
  free:         { label: 'Free',         cls: 'text-secondary' },
  early_access: { label: 'Early Access', cls: 'text-green' },
  pro:          { label: 'Pro',          cls: 'text-warn' },
  agency:       { label: 'Agency',       cls: 'text-blue-400' },
};

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const profile = await getProfile(user.id);
  if (profile?.role !== 'admin') redirect('/dashboard');

  const supabase = createSupabaseServerClient();

  // Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, plan, role, created_at')
    .order('created_at', { ascending: false });

  // Fetch scan stats
  const { count: totalScans } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true });

  // Early access redemption count
  const { data: earlyAccess } = await supabase
    .from('early_access_redemptions')
    .select('count')
    .eq('id', 1)
    .single();

  const earlyAccessUsed = earlyAccess?.count ?? 0;
  const earlyAccessRemaining = Math.max(0, 25 - earlyAccessUsed);

  const totalUsers = profiles?.length ?? 0;
  const paidUsers = profiles?.filter((p) => p.plan === 'pro' || p.plan === 'agency').length ?? 0;
  const earlyAccessUsers = profiles?.filter((p) => p.plan === 'early_access').length ?? 0;

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-widest uppercase text-white hover:text-green transition-colors">
            A11YO
          </Link>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-secondary">Admin</span>
            <Link href="/dashboard" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors">
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-8">

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-green block mb-2">Admin</span>
            <h1 className="text-3xl font-display font-extrabold text-white">Dashboard</h1>
          </div>

          {/* ── PLATFORM STATS ── */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Platform overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: totalUsers, label: 'Total users' },
                { value: totalScans ?? 0, label: 'Total scans' },
                { value: earlyAccessUsers, label: 'Early access' },
                { value: paidUsers, label: 'Paid users' },
              ].map(({ value, label }) => (
                <div key={label} className="corner-mark border border-border bg-surface px-5 py-4">
                  <span className="font-display text-3xl font-extrabold text-white block">{value}</span>
                  <span className="font-mono text-xs text-secondary uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── EARLY ACCESS ── */}
          <section aria-labelledby="early-access-heading">
            <h2 id="early-access-heading" className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Early access slots
            </h2>
            <div className="corner-mark border border-border bg-surface px-6 py-5">
              <div className="flex items-center gap-6 mb-3">
                <div>
                  <span className="font-display text-4xl font-extrabold text-green">{earlyAccessUsed}</span>
                  <span className="font-mono text-xs text-secondary ml-2">/ 25 used</span>
                </div>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green transition-all"
                    style={{ width: `${(earlyAccessUsed / 25) * 100}%` }}
                  />
                </div>
                <span className={`font-mono text-sm font-semibold ${earlyAccessRemaining === 0 ? 'text-fail' : 'text-secondary'}`}>
                  {earlyAccessRemaining} remaining
                </span>
              </div>
              {earlyAccessRemaining === 0 && (
                <p className="font-mono text-xs text-fail">
                  All slots filled — new users will see the paid upgrade option.
                </p>
              )}
            </div>
          </section>

          {/* ── USER TABLE ── */}
          <section aria-labelledby="users-heading">
            <h2 id="users-heading" className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Users ({totalUsers})
            </h2>
            <div className="corner-mark border border-border bg-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Email</th>
                    <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Plan</th>
                    <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Role</th>
                    <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profiles?.map((p) => {
                    const planConfig = PLAN_LABELS[p.plan ?? 'free'] ?? PLAN_LABELS.free;
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 text-white font-mono text-xs">{p.email}</td>
                        <td className="px-5 py-3">
                          <span className={`font-mono text-xs uppercase tracking-widest ${planConfig.cls}`}>
                            {planConfig.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {p.role === 'admin' ? (
                            <span className="font-mono text-xs text-green uppercase tracking-widest">Admin</span>
                          ) : (
                            <span className="font-mono text-xs text-secondary">User</span>
                          )}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-secondary">
                          {p.created_at ? formatDate(p.created_at) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(!profiles || profiles.length === 0) && (
                <p className="px-5 py-8 text-secondary text-sm text-center">No users yet.</p>
              )}
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-xs text-secondary">A11YO Admin · {user.email}</span>
        </div>
      </footer>
    </div>
  );
}
