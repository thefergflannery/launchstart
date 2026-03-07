import { NextRequest, NextResponse } from 'next/server';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';

async function assertAdmin() {
  const user = await getUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  if (profile?.role !== 'admin') return null;
  return user;
}

/** PATCH /api/admin/user — update plan or role (admin RLS policy allows this) */
export async function PATCH(request: NextRequest) {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId, plan, role } = await request.json() as {
    userId?: string; plan?: string; role?: string;
  };
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

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

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
