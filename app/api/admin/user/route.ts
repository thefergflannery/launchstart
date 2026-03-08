import { NextRequest, NextResponse } from 'next/server';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';

async function assertAdmin() {
  const user = await getUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  if (profile?.role !== 'admin') return null;
  return user;
}

const VALID_PLANS = new Set(['free', 'early_access', 'pro', 'agency']);
const VALID_ROLES = new Set(['admin', 'user']);

/** PATCH /api/admin/user — update plan or role (admin RLS policy allows this) */
export async function PATCH(request: NextRequest) {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId, plan, role } = await request.json() as {
    userId?: string; plan?: string; role?: string;
  };
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  // Prevent admin from revoking their own admin role
  if (userId === caller.id && role && role !== 'admin') {
    return NextResponse.json({ error: 'Cannot revoke your own admin role' }, { status: 400 });
  }

  // Whitelist valid values
  if (plan && !VALID_PLANS.has(plan)) {
    return NextResponse.json({ error: 'Invalid plan value' }, { status: 400 });
  }
  if (role && !VALID_ROLES.has(role)) {
    return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const updates: Record<string, string> = {};
  if (plan) updates.plan = plan;
  if (role) updates.role = role;

  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/user?userId=... — delete profile row (auth user must be deleted via Supabase dashboard or service role) */
export async function DELETE(request: NextRequest) {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  // Prevent admin from deleting their own account
  if (userId === caller.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
