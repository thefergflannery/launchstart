import { NextRequest, NextResponse } from 'next/server';
import { getUser, createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  // Must be authenticated
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to redeem a code.' }, { status: 401 });
  }

  const { code } = (await request.json()) as { code?: string };
  const trimmed = code?.trim().toUpperCase() ?? '';
  if (!trimmed) {
    return NextResponse.json({ error: 'Please enter a code.' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  // Check current plan — don't allow double-upgrade
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (profile?.plan && profile.plan !== 'free') {
    return NextResponse.json({ error: 'Your account is already upgraded.' }, { status: 400 });
  }

  // Look up the code (case-insensitive)
  const { data: accessCode, error: lookupError } = await supabase
    .from('access_codes')
    .select('id, used')
    .ilike('code', trimmed)
    .single();

  if (lookupError || !accessCode) {
    return NextResponse.json({ error: 'Invalid code.' }, { status: 400 });
  }

  if (accessCode.used) {
    return NextResponse.json({ error: 'This code has already been used.' }, { status: 400 });
  }

  // Mark the code as used
  const { error: codeUpdateError } = await supabase
    .from('access_codes')
    .update({ used: true, used_by: user.id, used_at: new Date().toISOString() })
    .eq('id', accessCode.id);

  if (codeUpdateError) {
    console.error('Failed to mark code as used:', codeUpdateError);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  // Upgrade the user's plan
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({ plan: 'early_access' })
    .eq('id', user.id);

  if (profileUpdateError) {
    console.error('Failed to upgrade plan:', profileUpdateError);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  // Increment the global early access counter (non-blocking — don't fail if this errors)
  await supabase.rpc('increment_early_access_count').catch(() => {});

  return NextResponse.json({ success: true, plan: 'early_access' });
}
