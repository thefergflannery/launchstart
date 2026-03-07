'use client';

import { useState, useTransition } from 'react';

const PLANS = ['free', 'early_access', 'pro', 'agency'] as const;
const PLAN_LABELS: Record<string, { label: string; cls: string }> = {
  free:         { label: 'Free',         cls: 'text-secondary' },
  early_access: { label: 'Early Access', cls: 'text-green' },
  pro:          { label: 'Pro',          cls: 'text-warn' },
  agency:       { label: 'Agency',       cls: 'text-blue-400' },
};

type Profile = {
  id: string;
  email: string | null;
  plan: string | null;
  role: string | null;
  created_at: string | null;
  stripe_customer_id: string | null;
  scan_count?: number;
};

async function patchUser(userId: string, updates: { plan?: string; role?: string }) {
  const res = await fetch('/api/admin/user', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...updates }),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function deleteUser(userId: string) {
  const res = await fetch(`/api/admin/user?userId=${userId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUserTable({ profiles }: { profiles: Profile[] }) {
  const [rows, setRows] = useState(profiles);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  const filtered = rows.filter((p) => {
    const matchSearch = !search || p.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || p.plan === planFilter;
    return matchSearch && matchPlan;
  });

  function toast(id: string, msg: string, ok: boolean) {
    setFeedback({ id, msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  function handlePlanChange(userId: string, plan: string) {
    startTransition(async () => {
      try {
        await patchUser(userId, { plan });
        setRows((r) => r.map((p) => p.id === userId ? { ...p, plan } : p));
        toast(userId, 'Plan updated', true);
      } catch {
        toast(userId, 'Failed to update plan', false);
      }
    });
  }

  function handleToggleAdmin(userId: string, currentRole: string | null) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    startTransition(async () => {
      try {
        await patchUser(userId, { role: newRole });
        setRows((r) => r.map((p) => p.id === userId ? { ...p, role: newRole } : p));
        toast(userId, `Role set to ${newRole}`, true);
      } catch {
        toast(userId, 'Failed to update role', false);
      }
    });
  }

  function handleDelete(userId: string, email: string | null) {
    if (!confirm(`Delete ${email ?? userId}? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteUser(userId);
        setRows((r) => r.filter((p) => p.id !== userId));
        toast(userId, 'User deleted', true);
      } catch {
        toast(userId, 'Failed to delete user', false);
      }
    });
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="search"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-black border border-border text-white text-sm font-mono focus:outline-none focus:border-green transition-colors w-64"
        />
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2 bg-black border border-border text-white text-sm font-mono focus:outline-none focus:border-green transition-colors"
        >
          <option value="all">All plans</option>
          {PLANS.map((p) => <option key={p} value={p}>{PLAN_LABELS[p].label}</option>)}
        </select>
        <span className="ml-auto font-mono text-xs text-secondary self-center">
          {filtered.length} of {rows.length} users
        </span>
      </div>

      {/* Toast */}
      {feedback && (
        <div className={`mb-3 px-4 py-2 font-mono text-xs ${feedback.ok ? 'text-green border-green' : 'text-fail border-fail'} border`}>
          {feedback.msg}
        </div>
      )}

      {/* Table */}
      <div className="corner-mark border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Email</th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Plan</th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Role</th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Scans</th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Joined</th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => {
              const planCfg = PLAN_LABELS[p.plan ?? 'free'] ?? PLAN_LABELS.free;
              const isAdmin = p.role === 'admin';
              const isBusy = isPending;
              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-white">
                    {p.email ?? '—'}
                    {p.stripe_customer_id && (
                      <span className="ml-2 text-[10px] text-secondary">[stripe]</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.plan ?? 'free'}
                      onChange={(e) => handlePlanChange(p.id, e.target.value)}
                      disabled={isBusy}
                      className={`bg-transparent font-mono text-xs uppercase tracking-widest border border-border px-2 py-1 focus:outline-none focus:border-green transition-colors ${planCfg.cls}`}
                    >
                      {PLANS.map((pl) => (
                        <option key={pl} value={pl} className="bg-black text-white normal-case tracking-normal">
                          {PLAN_LABELS[pl].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleAdmin(p.id, p.role)}
                      disabled={isBusy}
                      className={`font-mono text-xs uppercase tracking-widest border px-2 py-1 transition-colors ${
                        isAdmin
                          ? 'border-green text-green hover:bg-green/10'
                          : 'border-border text-secondary hover:border-white hover:text-white'
                      }`}
                    >
                      {isAdmin ? 'Admin' : 'User'}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-secondary">
                    {p.scan_count ?? 0}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-secondary">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(p.id, p.email)}
                      disabled={isBusy || isAdmin}
                      className="font-mono text-xs text-fail hover:text-white hover:bg-fail/20 border border-transparent hover:border-fail px-2 py-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title={isAdmin ? 'Cannot delete admin accounts' : 'Delete user'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-secondary text-sm text-center font-mono">No users match.</p>
        )}
      </div>
    </div>
  );
}
